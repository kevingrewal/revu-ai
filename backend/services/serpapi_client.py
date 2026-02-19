"""SerpApi client for Amazon product search and review fetching"""
import requests
from datetime import datetime
from flask import current_app
from models.api_usage import ApiUsage
from utils.database import db

SERPAPI_BASE_URL = "https://serpapi.com/search"


class SerpApiClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or current_app.config.get("SERPAPI_API_KEY", "")

    def _get_monthly_usage(self):
        """Count SerpApi calls this month"""
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return ApiUsage.query.filter(
            ApiUsage.api_name == "serpapi",
            ApiUsage.called_at >= month_start,
        ).count()

    def _can_make_request(self):
        """Check if we're within the monthly limit (with 10-call buffer)"""
        limit = current_app.config.get("SERPAPI_MONTHLY_LIMIT", 250)
        usage = self._get_monthly_usage()
        return usage < (limit - 10)

    def _log_usage(self, endpoint, product_id=None):
        """Log an API call for tracking"""
        usage = ApiUsage(
            api_name="serpapi",
            endpoint=endpoint,
            product_id=product_id,
        )
        db.session.add(usage)
        db.session.commit()

    def _request(self, params, product_id=None):
        """Make an authenticated SerpApi request with usage tracking"""
        if not self.api_key:
            raise ValueError("SERPAPI_API_KEY not configured")

        if not self._can_make_request():
            return None  # Rate limited

        params["api_key"] = self.api_key
        endpoint = params.get("engine", "unknown")

        response = requests.get(SERPAPI_BASE_URL, params=params, timeout=20)
        response.raise_for_status()

        self._log_usage(endpoint, product_id)
        return response.json()

    def search_amazon_products(self, query, product_id=None):
        """
        Search Amazon for products by keyword.
        Returns list of product dicts with: asin, title, price, rating, reviews_count, image, link.
        """
        params = {
            "engine": "amazon",
            "amazon_domain": "amazon.com",
            "k": query,
        }
        data = self._request(params, product_id)
        if not data:
            return []

        results = data.get("organic_results", [])
        products = []
        for r in results:
            asin = r.get("asin")
            if not asin:
                continue

            # Extract price (SerpApi returns various price formats)
            price = None
            price_info = r.get("price", {})
            if isinstance(price_info, dict):
                price = price_info.get("extracted_value") or price_info.get("value")
            elif isinstance(price_info, (int, float)):
                price = price_info
            if not price:
                price = r.get("extracted_price")

            products.append({
                "asin": asin,
                "title": r.get("title", ""),
                "price": price,
                "rating": r.get("rating"),
                "reviews_count": r.get("reviews", {}).get("total") if isinstance(r.get("reviews"), dict) else None,
                "image": r.get("thumbnail", ""),
                "link": r.get("link", ""),
            })
        return products

    def search_amazon_asin(self, product_name, product_id=None):
        """Search Amazon for a product by name. Returns the ASIN of the top result."""
        products = self.search_amazon_products(product_name, product_id)
        if products:
            return products[0].get("asin")
        return None

    def get_amazon_reviews(self, asin, product_id=None):
        """Fetch reviews for an Amazon product by ASIN. Returns list of review dicts."""
        params = {
            "engine": "amazon_product",
            "amazon_domain": "amazon.com",
            "asin": asin,
        }
        data = self._request(params, product_id)
        if not data:
            return []

        # SerpApi returns reviews in different paths depending on the response
        reviews_raw = []

        # Try reviews_results.reviews first (most common)
        reviews_section = data.get("reviews_results", {})
        if isinstance(reviews_section, dict):
            reviews_raw = reviews_section.get("reviews", [])

        # Fallback: top_reviews
        if not reviews_raw:
            reviews_raw = data.get("top_reviews", [])

        # Fallback: reviews_information.authors_reviews
        if not reviews_raw:
            info = data.get("reviews_information", {})
            if isinstance(info, dict):
                reviews_raw = info.get("authors_reviews", [])

        reviews = []
        for r in reviews_raw:
            review_text = r.get("body", "") or r.get("text", "") or r.get("title", "")
            if not review_text:
                continue
            reviews.append({
                "title": r.get("title", ""),
                "text": review_text,
                "rating": r.get("rating", 3),
                "date": r.get("date", ""),
            })
        return reviews

    def get_usage_stats(self):
        """Return current month's usage statistics"""
        limit = current_app.config.get("SERPAPI_MONTHLY_LIMIT", 250)
        usage = self._get_monthly_usage()
        return {
            "used": usage,
            "limit": limit,
            "remaining": max(0, limit - usage),
        }

    @staticmethod
    def convert_sentiment(star_rating):
        """Convert Amazon 1-5 star rating to 0-1 sentiment score"""
        if not star_rating:
            return 0.5
        rating = max(1, min(5, float(star_rating)))
        return round((rating - 1) / 4.0, 2)
