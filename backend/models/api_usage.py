import uuid
from datetime import datetime
from utils.database import db


class ApiUsage(db.Model):
    """Track external API usage for rate limiting"""

    __tablename__ = "api_usage"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    api_name = db.Column(db.String(50), nullable=False, index=True)
    endpoint = db.Column(db.String(200))
    product_id = db.Column(db.String(36), nullable=True)
    called_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
