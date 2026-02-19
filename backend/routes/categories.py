from flask import Blueprint, jsonify, request
from models.category import Category
from models.product import Product
from schemas.product_schema import CategoryResponse
import math

categories_bp = Blueprint("categories", __name__, url_prefix="/api/categories")


@categories_bp.route("", methods=["GET"])
def get_categories():
    """Get all categories"""
    try:
        categories = Category.query.order_by(Category.name).all()
        categories_data = [category.to_dict() for category in categories]

        return jsonify(categories_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@categories_bp.route("/<slug>/products", methods=["GET"])
def get_category_products(slug):
    """Get products in a specific category"""
    try:
        # Check if category exists
        category = Category.query.filter_by(slug=slug).first()
        if not category:
            return jsonify({"error": "Category not found"}), 404

        # Get products in this category
        products = Product.query.filter_by(category=slug).order_by(Product.rating.desc()).all()
        products_data = [product.to_dict() for product in products]

        return jsonify({
            "category": category.to_dict(),
            "products": products_data,
            "total": len(products_data),
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@categories_bp.route("/search", methods=["GET"])
def search_categories():
    """Search categories by name"""
    try:
        search = request.args.get("q", "").strip()
        if not search:
            return jsonify([]), 200

        search_pattern = f"%{search}%"
        categories = Category.query.filter(
            Category.name.like(search_pattern)
        ).order_by(Category.name).limit(5).all()

        return jsonify([cat.to_dict() for cat in categories]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
