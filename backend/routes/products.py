from flask import Blueprint, jsonify, request
from models.product import Product
from models.category import Category
from schemas.product_schema import ProductResponse, ProductListResponse, ProductDetailResponse
import math

products_bp = Blueprint("products", __name__, url_prefix="/api/products")


@products_bp.route("", methods=["GET"])
def get_products():
    """Get paginated list of products with optional filtering and sorting"""
    try:
        # Get and validate query parameters
        try:
            page = int(request.args.get("page", 1))
            limit = min(int(request.args.get("limit", 20)), 100)  # Max 100 per page
        except ValueError:
            return jsonify({"error": "Invalid page or limit parameter"}), 400

        limit = max(limit, 1)  # Ensure limit is at least 1
        category = request.args.get("category")
        sort = request.args.get("sort", "rating_desc")

        # Build query
        query = Product.query

        # Filter by category
        if category:
            query = query.filter(Product.category == category)

        # Apply sorting
        if sort == "rating_desc":
            query = query.order_by(Product.rating.desc())
        elif sort == "rating_asc":
            query = query.order_by(Product.rating.asc())
        elif sort == "price_asc":
            query = query.order_by(Product.price.asc())
        elif sort == "price_desc":
            query = query.order_by(Product.price.desc())
        elif sort == "newest":
            query = query.order_by(Product.created_at.desc())
        else:
            query = query.order_by(Product.rating.desc())  # Default

        # Get total count
        total = query.count()

        # Paginate
        products = query.paginate(page=page, per_page=limit, error_out=False)

        # Convert to dict
        products_data = [product.to_dict() for product in products.items]

        # Calculate total pages
        pages = math.ceil(total / limit) if limit > 0 else 0

        return jsonify({
            "products": products_data,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages,
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@products_bp.route("/<product_id>", methods=["GET"])
def get_product(product_id):
    """Get product detail with reviews (fetches from SerpApi on-demand)"""
    try:
        product = Product.query.get(product_id)

        if not product:
            return jsonify({"error": "Product not found"}), 404

        # Fetch fresh reviews on-demand for products with Amazon ASINs
        if product.amazon_asin:
            try:
                from services.review_service import fetch_reviews_for_product
                fetch_reviews_for_product(product)
            except Exception as e:
                # Log but don't fail — serve cached data
                print(f"Review fetch warning for {product_id}: {e}")

        # Get product with reviews
        product_data = product.to_dict(include_reviews=True)

        return jsonify(product_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
