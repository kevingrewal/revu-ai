"""One-time database seed — runs sync only if DB is empty."""
from app import create_app
from models.product import Product
from utils.database import db


def seed_if_empty():
    app = create_app()
    with app.app_context():
        db.create_all()
        count = Product.query.count()
        if count > 0:
            print(f"Database already has {count} products — skipping seed.")
            return
        print("Empty database detected — running initial product sync...")

    # Import and run sync (it creates its own app context)
    from sync import sync_products
    sync_products(limit_per_query=10, clean=False)


if __name__ == "__main__":
    seed_if_empty()
