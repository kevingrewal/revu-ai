from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)

    with app.app_context():
        # Import models to register them
        from models import product, review, category  # noqa

        # Create all tables
        db.create_all()
