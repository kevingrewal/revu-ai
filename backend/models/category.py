import uuid
from utils.database import db


class Category(db.Model):
    """Category model for product categorization"""

    __tablename__ = "categories"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    product_count = db.Column(db.Integer, default=0)

    # Relationship
    products = db.relationship("Product", back_populates="category_rel", lazy="dynamic")

    def to_dict(self):
        """Convert category to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "product_count": self.product_count,
        }
