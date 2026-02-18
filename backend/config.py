import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration"""

    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:///revu.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

    # API
    API_PAGE_SIZE = 20
    API_MAX_PAGE_SIZE = 100
