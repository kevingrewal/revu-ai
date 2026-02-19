import uuid
import json
from datetime import datetime
from utils.database import db


class Review(db.Model):
    """Review model for storing product reviews"""

    __tablename__ = "reviews"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = db.Column(db.String(36), db.ForeignKey("products.id"), nullable=False, index=True)
    source = db.Column(db.String(50), nullable=False)  # amazon, ebay, tiktok, etsy
    text = db.Column(db.Text, nullable=False)
    sentiment_score = db.Column(db.Float)  # -1 to 1
    pros = db.Column(db.Text)  # JSON array stored as text
    cons = db.Column(db.Text)  # JSON array stored as text
    scraped_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    product = db.relationship("Product", back_populates="reviews")

    def get_pros(self):
        """Parse pros from JSON text"""
        if self.pros:
            try:
                return json.loads(self.pros)
            except json.JSONDecodeError:
                return []
        return []

    def set_pros(self, pros_list):
        """Store pros as JSON text"""
        self.pros = json.dumps(pros_list) if pros_list else None

    def get_cons(self):
        """Parse cons from JSON text"""
        if self.cons:
            try:
                return json.loads(self.cons)
            except json.JSONDecodeError:
                return []
        return []

    def set_cons(self, cons_list):
        """Store cons as JSON text"""
        self.cons = json.dumps(cons_list) if cons_list else None

    def to_dict(self):
        """Convert review to dictionary"""
        return {
            "id": self.id,
            "product_id": self.product_id,
            "source": self.source,
            "text": self.text,
            "sentiment_score": round(self.sentiment_score, 2) if self.sentiment_score else 0.0,
            "pros": self.get_pros(),
            "cons": self.get_cons(),
            "scraped_at": self.scraped_at.isoformat() if self.scraped_at else None,
        }
