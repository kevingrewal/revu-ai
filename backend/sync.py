"""
Sync script to populate products from Amazon via SerpApi.
Run: python sync.py [--clean] [--limit N]

Each search query costs 1 SerpApi call (~20 results per call).
Default config uses ~10 queries = ~10 of your 250 monthly calls.
"""
import argparse
from datetime import datetime
from app import create_app
from models.product import Product
from models.category import Category
from services.serpapi_client import SerpApiClient
from utils.database import db


# Categories with Amazon search queries to populate them
# ~7 queries per category × 8 categories = ~56 SerpApi calls
CATEGORY_SEARCHES = {
    "electronics": [
        "best wireless headphones 2025",
        "best laptops 2025",
        "best smartwatch 2025",
        "best bluetooth speaker",
        "best noise cancelling earbuds",
        "best 4k monitor",
        "best mechanical keyboard",
    ],
    "home-kitchen": [
        "best air fryer",
        "best robot vacuum",
        "best instant pot pressure cooker",
        "best coffee maker",
        "best blender",
        "best knife set kitchen",
        "best air purifier home",
    ],
    "health-wellness": [
        "best fitness tracker 2025",
        "best massage gun",
        "best yoga mat",
        "best foam roller",
        "best resistance bands set",
        "best weight scale smart",
        "best meditation cushion",
    ],
    "sports-outdoors": [
        "best running shoes men",
        "best running shoes women",
        "best hiking backpack",
        "best camping tent",
        "best water bottle insulated",
        "best cycling helmet",
        "best adjustable dumbbells",
    ],
    "beauty-personal-care": [
        "best electric toothbrush",
        "best hair dryer",
        "best electric shaver men",
        "best skincare set",
        "best hair straightener",
        "best face moisturizer",
        "best beard trimmer",
    ],
    "toys-games": [
        "best board games adults",
        "best lego sets 2025",
        "best puzzle 1000 piece",
        "best remote control car",
        "best kids tablet",
        "best drone with camera",
        "best card games family",
    ],
    "fashion-accessories": [
        "best mens wallet leather",
        "best sunglasses polarized",
        "best crossbody bag women",
        "best watch men under 100",
        "best backpack laptop",
        "best winter gloves touchscreen",
        "best belt men leather",
    ],
    "office-supplies": [
        "best standing desk",
        "best office chair ergonomic",
        "best monitor stand",
        "best desk lamp",
        "best wireless mouse",
        "best webcam 2025",
        "best desk organizer",
    ],
}

# All categories to ensure exist (even those without search queries yet)
ALL_CATEGORIES = {
    "electronics": "Electronics",
    "home-kitchen": "Home & Kitchen",
    "health-wellness": "Health & Wellness",
    "sports-outdoors": "Sports & Outdoors",
    "beauty-personal-care": "Beauty & Personal Care",
    "toys-games": "Toys & Games",
    "fashion-accessories": "Fashion & Accessories",
    "office-supplies": "Office Supplies",
}


def run_migrations():
    """Add new columns if they don't exist (SQLite-safe, idempotent)"""
    migrations = [
        "ALTER TABLE products ADD COLUMN bestbuy_sku VARCHAR(50)",
        "ALTER TABLE products ADD COLUMN amazon_asin VARCHAR(20)",
        "ALTER TABLE products ADD COLUMN reviews_fetched_at DATETIME",
        "ALTER TABLE reviews ADD COLUMN source_rating FLOAT",
    ]
    for sql in migrations:
        try:
            db.session.execute(db.text(sql))
            db.session.commit()
        except Exception as e:
            error_msg = str(e).lower()
            if 'duplicate column' in error_msg or 'already exists' in error_msg:
                db.session.rollback()
            else:
                print(f"Migration failed: {sql}")
                print(f"Error: {e}")
                raise


def ensure_categories():
    """Create categories that don't exist yet"""
    for slug, name in ALL_CATEGORIES.items():
        existing = Category.query.filter_by(slug=slug).first()
        if not existing:
            cat = Category(name=name, slug=slug, product_count=0)
            db.session.add(cat)
    db.session.commit()


def convert_amazon_rating(rating):
    """Convert Amazon 1-5 star rating to Revu 0-10 scale"""
    if not rating:
        return 0.0
    return round(float(rating) * 2.0, 1)


def sync_products(limit_per_query=10, clean=False):
    """Sync products from Amazon via SerpApi"""
    app = create_app()

    with app.app_context():
        db.create_all()

        if clean:
            print("Cleaning existing data...")
            from models.review import Review
            from models.api_usage import ApiUsage
            Review.query.delete()
            Product.query.delete()
            Category.query.delete()
            ApiUsage.query.delete()
            db.session.commit()
        else:
            run_migrations()

        ensure_categories()

        client = SerpApiClient()
        total_synced = 0
        total_updated = 0
        total_skipped = 0
        api_calls = 0

        for category_slug, queries in CATEGORY_SEARCHES.items():
            category_name = ALL_CATEGORIES.get(category_slug, category_slug)
            print(f"\n{'='*50}")
            print(f"Category: {category_name}")

            for query in queries:
                print(f"\n  Searching: \"{query}\"")
                api_calls += 1

                try:
                    products = client.search_amazon_products(query)
                except Exception as e:
                    print(f"  Error: {e}")
                    continue

                if not products:
                    print("  No results (possibly rate limited)")
                    continue

                # Limit results per query
                products = products[:limit_per_query]
                print(f"  Found {len(products)} products")

                for p in products:
                    asin = p.get("asin")
                    if not asin:
                        continue

                    title = p.get("title", "").strip()
                    if not title:
                        continue

                    price = p.get("price")
                    rating = convert_amazon_rating(p.get("rating"))
                    reviews_count = p.get("reviews_count") or 0
                    image_url = p.get("image", "")
                    link = p.get("link", "")

                    # Skip products without a price
                    if not price or price <= 0:
                        total_skipped += 1
                        continue

                    # Upsert by ASIN
                    existing = Product.query.filter_by(amazon_asin=asin).first()
                    if existing:
                        existing.name = title
                        existing.price = price
                        existing.rating = rating
                        existing.review_count = reviews_count
                        existing.image_url = image_url
                        existing.source_url = link
                        existing.updated_at = datetime.utcnow()
                        total_updated += 1
                    else:
                        product = Product(
                            name=title,
                            description="",  # Filled when reviews are fetched
                            category=category_slug,
                            price=price,
                            rating=rating,
                            review_count=reviews_count,
                            image_url=image_url,
                            source_url=link,
                            amazon_asin=asin,
                        )
                        db.session.add(product)
                        total_synced += 1

                db.session.commit()

        # Update category product counts
        for slug in ALL_CATEGORIES:
            cat = Category.query.filter_by(slug=slug).first()
            if cat:
                cat.product_count = Product.query.filter_by(category=slug).count()
        db.session.commit()

        # Print summary
        total_in_db = Product.query.count()
        usage = client.get_usage_stats()

        print(f"\n{'='*50}")
        print(f"Sync complete!")
        print(f"  SerpApi calls used: {api_calls}")
        print(f"  New products: {total_synced}")
        print(f"  Updated products: {total_updated}")
        print(f"  Skipped (no price): {total_skipped}")
        print(f"  Total in database: {total_in_db}")

        print(f"\nSerpApi monthly usage: {usage['used']}/{usage['limit']} ({usage['remaining']} remaining)")

        print(f"\nProducts by category:")
        for slug, name in ALL_CATEGORIES.items():
            count = Product.query.filter_by(category=slug).count()
            if count > 0:
                print(f"  {name}: {count}")

        if total_in_db > 0:
            print(f"\nTop rated products:")
            top = Product.query.order_by(Product.rating.desc()).limit(5).all()
            for p in top:
                print(f"  {p.rating}/10 - {p.name[:60]} (${float(p.price):.2f})")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sync products from Amazon via SerpApi")
    parser.add_argument("--clean", action="store_true", help="Clear existing data first")
    parser.add_argument("--limit", type=int, default=15, help="Max products per search query (default: 15)")
    args = parser.parse_args()

    print("Starting Amazon product sync via SerpApi...")
    sync_products(limit_per_query=args.limit, clean=args.clean)
    print("\nDone! Run 'python app.py' to start the server.")
