"""Service for fetching and caching product reviews from SerpApi"""
from datetime import datetime, timedelta
from flask import current_app
from models.review import Review
from services.serpapi_client import SerpApiClient
from utils.database import db


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

    # Step 4: Insert new reviews
    for raw in raw_reviews:
        star_rating = raw.get("rating")
        sentiment = SerpApiClient.convert_sentiment(star_rating)

        review = Review(
            product_id=product.id,
            source="amazon",
            text=raw.get("text", raw.get("title", "No review text")),
            sentiment_score=sentiment,
            source_rating=float(star_rating) if star_rating else None,
        )

        # Set basic pros/cons based on sentiment
        if sentiment > 0.6:
            review.set_pros([raw.get("title", "Positive review")])
        elif sentiment < 0.3:
            review.set_cons([raw.get("title", "Negative review")])

        db.session.add(review)

    # Step 5: Update product metadata
    product.reviews_fetched_at = datetime.utcnow()
    all_reviews = Review.query.filter_by(product_id=product.id).all()
    product.review_count = len(all_reviews)

    db.session.commit()
    return True
