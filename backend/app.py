from flask import Flask
from flask_cors import CORS
from config import Config
from utils.database import init_db

# Import blueprints
from routes.health import health_bp
from routes.products import products_bp
from routes.categories import categories_bp


def create_app():
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS
    CORS(app)

    # Initialize database
    init_db(app)

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(categories_bp)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
