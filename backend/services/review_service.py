"""Service for fetching and caching product reviews from SerpApi"""
import logging
from datetime import datetime, timedelta
from flask import current_app
from models.review import Review
from services.serpapi_client import SerpApiClient
from services.sentiment_service import analyze_reviews
from utils.database import db

logger = logging.getLogger(__name__)


def fetch_reviews_for_product(product):
    """
    Fetch Amazon reviews for a product if cache is stale.
    Returns True if new reviews were fetched, False if using cache.
    """
    cache_days = current_app.config.get("REVIEW_CACHE_DAYS", 7)

    # Check if reviews are fresh enough
    if product.reviews_fetched_at:
        cache_cutoff = datetime.utcnow() - timedelta(days=cache_days)
        if product.reviews_fetched_at > cache_cutoff:
            return False  # Cache is still fresh

    client = SerpApiClient()

    # Step 1: If we don't have an ASIN, search Amazon for one
    asin = product.amazon_asin
    if not asin:
        asin = client.search_amazon_asin(product.name, product.id)
        if asin:
            product.amazon_asin = asin
            db.session.commit()
        else:
            # Rate limited or no results — mark as attempted
            product.reviews_fetched_at = datetime.utcnow()
            db.session.commit()
            return False

    # Step 2: Fetch reviews using ASIN
    raw_reviews = client.get_amazon_reviews(asin, product.id)
    if not raw_reviews:
        # Rate limited or no reviews — mark as attempted
        product.reviews_fetched_at = datetime.utcnow()
        db.session.commit()
        return False

    # Step 3: Delete old Amazon reviews for this product
    Review.query.filter_by(product_id=product.id, source="amazon").delete()

    # Step 4: Prepare reviews for AI analysis
    review_inputs = []
    for idx, raw in enumerate(raw_reviews):
        review_inputs.append({
            "id": idx,
            "text": raw.get("text", raw.get("title", "No review text")),
            "star_rating": raw.get("rating", 3),
        })

    # Step 5: Attempt AI sentiment analysis (returns None on failure)
    ai_results = None
    try:
        ai_results = analyze_reviews(review_inputs)
    except Exception as e:
        logger.warning("AI sentiment analysis failed for product %s: %s", product.id, e)

    # Build lookup from AI results (keyed by index)
    ai_lookup = {}
    if ai_results:
        for result in ai_results:
            ai_lookup[result["id"]] = result

    # Step 6: Create Review objects with AI or fallback data
    for idx, raw in enumerate(raw_reviews):
        star_rating = raw.get("rating")
        review_text = raw.get("text", raw.get("title", "No review text"))

        ai = ai_lookup.get(idx)
        if ai:
            sentiment = ai["sentiment_score"]
            pros = ai["pros"]
            cons = ai["cons"]
        else:
            # Fallback: star-rating-based sentiment (original formula)
            sentiment = SerpApiClient.convert_sentiment(star_rating)
            pros = [raw.get("title", "Positive review")] if sentiment > 0.6 else []
            cons = [raw.get("title", "Negative review")] if sentiment < 0.3 else []

        review = Review(
            product_id=product.id,
            source="amazon",
            text=review_text,
            sentiment_score=sentiment,
            source_rating=float(star_rating) if star_rating else None,
        )
        review.set_pros(pros)
        review.set_cons(cons)
        db.session.add(review)

    # Step 7: Update product metadata and recalculate rating
    product.reviews_fetched_at = datetime.utcnow()
    db.session.flush()

    all_reviews = Review.query.filter_by(product_id=product.id).all()
    product.review_count = len(all_reviews)

    if all_reviews:
        avg_sentiment = sum(r.sentiment_score for r in all_reviews) / len(all_reviews)
        product.rating = round(avg_sentiment * 10, 1)
    else:
        product.rating = 0.0

    db.session.commit()
    return True
