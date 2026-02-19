import json

from flask import Blueprint, jsonify, request, Response, stream_with_context
from models.product import Product
from models.category import Category
from schemas.product_schema import ProductResponse, ProductListResponse, ProductDetailResponse
from utils.database import db
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
        search = request.args.get("q", "").strip()

        # Build query
        query = Product.query

        # Filter by category
        if category:
            query = query.filter(Product.category == category)

        # Filter by search query
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                db.or_(
                    Product.name.like(search_pattern),
                    Product.description.like(search_pattern),
                    Product.category.like(search_pattern),
                )
            )

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


@products_bp.route("/<product_id>/chat", methods=["POST"])
def chat_with_product(product_id):
    """Stream a Claude AI response grounded in this product's data and reviews."""
    from flask import current_app

    api_key = current_app.config.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        return jsonify({
            "error": "AI chat is not configured. ANTHROPIC_API_KEY is missing."
        }), 503

    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    body = request.get_json(silent=True)
    if not body:
        return jsonify({"error": "Request body must be JSON"}), 400

    user_message = body.get("message", "").strip()
    if not user_message:
        return jsonify({"error": "message is required"}), 400

    if len(user_message) > 2000:
        return jsonify({"error": "Message too long (max 2000 characters)"}), 400

    raw_history = body.get("history", [])

    from services.chat_service import build_system_prompt, cap_history, validate_history

    history, validation_error = validate_history(raw_history)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    product_data = product.to_dict(include_reviews=True)
    system_prompt = build_system_prompt(product_data)
    capped_history = cap_history(history)
    messages = capped_history + [{"role": "user", "content": user_message}]

    def generate():
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=api_key)
            with client.messages.stream(
                model="claude-haiku-4-5-20251001",
                max_tokens=1024,
                system=system_prompt,
                messages=messages,
            ) as stream:
                for text in stream.text_stream:
                    yield f"data: {json.dumps({'text': text})}\n\n"
            yield "data: [DONE]\n\n"

        except Exception as e:
            error_msg = str(e)
            if "authentication" in error_msg.lower() or "api key" in error_msg.lower():
                error_msg = "Invalid API key. Please check ANTHROPIC_API_KEY."
            elif "rate" in error_msg.lower() and "limit" in error_msg.lower():
                error_msg = "Rate limit reached. Please try again in a moment."
            elif "connection" in error_msg.lower():
                error_msg = "Could not connect to the AI service. Check your network."
            else:
                error_msg = f"AI service error: {error_msg}"
            yield f"data: {json.dumps({'error': error_msg})}\n\n"
            yield "data: [DONE]\n\n"

    return Response(
        stream_with_context(generate()),
        content_type="text/event-stream",
        headers={
            "X-Accel-Buffering": "no",
            "Cache-Control": "no-cache",
        },
    )
