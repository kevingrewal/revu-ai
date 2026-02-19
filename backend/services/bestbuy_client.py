"""Best Buy Products API client"""
import requests
from flask import current_app

BESTBUY_BASE_URL = "https://api.bestbuy.com/v1"

# Map Best Buy category IDs to Revu category slugs
CATEGORY_MAP = {
    "abcat0502000": "electronics",       # Laptops
    "abcat0501000": "electronics",       # Desktops
    "abcat0204000": "electronics",       # Headphones
    "abcat0101000": "electronics",       # TVs
    "pcmcat241600050001": "electronics", # Cell Phones
    "abcat0904000": "electronics",       # Cameras
    "abcat0912000": "electronics",       # Wearable Technology
    "abcat0901000": "electronics",       # Home Audio
    "pcmcat312300050015": "home-kitchen",    # Small Kitchen Appliances
    "pcmcat242800050021": "health-wellness", # Health & Fitness
}

PRODUCT_FIELDS = ",".join([
    "sku", "name", "shortDescription", "longDescription",
    "salePrice", "regularPrice",
    "customerReviewAverage", "customerReviewCount",
    "image", "largeFrontImage", "thumbnailImage",
    "categoryPath", "url",
])


class BestBuyClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or current_app.config.get("BESTBUY_API_KEY", "")

    def _request(self, path, params=None):
        """Make an authenticated request to Best Buy API"""
        if not self.api_key:
            raise ValueError("BESTBUY_API_KEY not configured")

        url = f"{BESTBUY_BASE_URL}/{path}"
        default_params = {
            "apiKey": self.api_key,
            "format": "json",
        }
        if params:
            default_params.update(params)

        response = requests.get(url, params=default_params, timeout=15)
        response.raise_for_status()
        return response.json()

    def get_products_by_category(self, category_id, page=1, page_size=20, min_reviews=10):
        """Fetch products from a Best Buy category, sorted by review average descending."""
        filter_str = (
            f"(categoryPath.id={category_id}"
            f"&customerReviewCount>={min_reviews})"
        )
        path = f"products{filter_str}"
        params = {
            "show": PRODUCT_FIELDS,
            "sort": "customerReviewAverage.desc",
            "page": page,
            "pageSize": page_size,
        }
        return self._request(path, params)

    def search_products(self, query, page=1, page_size=20):
        """Search Best Buy products by keyword."""
        path = f"products(search={query})"
        params = {
            "show": PRODUCT_FIELDS,
            "sort": "customerReviewAverage.desc",
            "page": page,
            "pageSize": page_size,
        }
        return self._request(path, params)

    @staticmethod
    def convert_rating(bestbuy_rating):
        """Convert Best Buy 1-5 scale to Revu 0-10 scale"""
        if not bestbuy_rating:
            return 0.0
        return round(float(bestbuy_rating) * 2.0, 1)

    @staticmethod
    def map_category(category_path):
        """Map Best Buy categoryPath list to a Revu category slug."""
        if not category_path:
            return "electronics"
        for cat in category_path:
            cat_id = cat.get("id", "")
            if cat_id in CATEGORY_MAP:
                return CATEGORY_MAP[cat_id]
        return "electronics"
