from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__, url_prefix="/api")


@health_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "revu-ai backend is running"})


@health_bp.route("/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from revu-ai!"})
