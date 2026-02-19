from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__, url_prefix="/api")


@health_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "revu-ai backend is running"})


@health_bp.route("/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from revu-ai!"})


@health_bp.route("/api-usage", methods=["GET"])
def api_usage():
    """Get SerpApi usage statistics for the current month"""
    try:
        from services.serpapi_client import SerpApiClient
        client = SerpApiClient()
        stats = client.get_usage_stats()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
