import uuid
from datetime import datetime
from utils.database import db


class Product(db.Model):
    """Product model for storing product information"""

    __tablename__ = "products"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False, index=True)
    description = db.Column(db.Text)
    category = db.Column(db.String(100), db.ForeignKey("categories.slug"), index=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    rating = db.Column(db.Float, default=0.0, index=True)  # 0-10 scale
    review_count = db.Column(db.Integer, default=0)
    image_url = db.Column(db.String(500))
    source_url = db.Column(db.String(500))
    bestbuy_sku = db.Column(db.String(50), unique=True, nullable=True, index=True)
    amazon_asin = db.Column(db.String(20), unique=True, nullable=True, index=True)
    reviews_fetched_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    category_rel = db.relationship("Category", back_populates="products")
    reviews = db.relationship("Review", back_populates="product", lazy="dynamic", cascade="all, delete-orphan")

    def to_dict(self, include_reviews=False):
        """Convert product to dictionary"""
        data = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "price": float(self.price) if self.price else 0.0,
            "rating": round(self.rating, 1) if self.rating else 0.0,
            "review_count": self.review_count,
            "image_url": self.image_url,
            "source_url": self.source_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

        if include_reviews:
            data["reviews"] = [review.to_dict() for review in self.reviews.all()]

        return data
