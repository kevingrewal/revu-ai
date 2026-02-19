"""Service for building AI chat context and managing conversation limits."""

MAX_REVIEW_CHARS = 500
MAX_REVIEWS_IN_CONTEXT = 20
MAX_HISTORY_MESSAGES = 10


def build_system_prompt(product_data: dict) -> str:
    """Build a system prompt from product.to_dict(include_reviews=True) output."""
    name = product_data.get("name", "Unknown Product")
    description = product_data.get("description") or "No description provided."
    category = product_data.get("category") or "Uncategorized"
    price = product_data.get("price", 0)
    rating = product_data.get("rating", 0)
    review_count = product_data.get("review_count", 0)
    reviews = product_data.get("reviews", [])

    product_block = (
        f"Product: {name}\n"
        f"Category: {category}\n"
        f"Price: ${price:.2f}\n"
        f"Rating: {rating}/10 (based on {review_count} reviews)\n"
        f"Description: {description}"
    )

    sorted_reviews = sorted(
        reviews,
        key=lambda r: r.get("sentiment_score", 0.5),
        reverse=True,
    )
    selected = sorted_reviews[:MAX_REVIEWS_IN_CONTEXT]

    review_lines = []
    for i, review in enumerate(selected, start=1):
        source = review.get("source", "unknown").upper()
        sentiment = review.get("sentiment_score", 0.5)
        text = (review.get("text") or "").strip()
        if len(text) > MAX_REVIEW_CHARS:
            text = text[:MAX_REVIEW_CHARS] + "..."

        pros = review.get("pros", [])
        cons = review.get("cons", [])

        line = f"[Review {i} | Source: {source} | Sentiment: {sentiment:.2f}]\n{text}"
        if pros:
            line += f"\nPros: {', '.join(pros)}"
        if cons:
            line += f"\nCons: {', '.join(cons)}"
        review_lines.append(line)

    reviews_block = "\n\n".join(review_lines) if review_lines else "No reviews available."

    return f"""You are a helpful product research assistant for Revu AI, an AI-powered product review aggregator.

You have been given detailed information about a specific product along with real customer reviews. Your job is to help the user understand this product — answer questions about its features, quality, value, common issues, and whether it's a good fit for their needs.

Be concise, honest, and grounded in the review data. If a question cannot be answered from the provided information, say so clearly.

=== PRODUCT INFORMATION ===
{product_block}

=== CUSTOMER REVIEWS ({len(selected)} of {review_count} total) ===
{reviews_block}"""


def cap_history(history: list) -> list:
    """Keep only the last MAX_HISTORY_MESSAGES messages."""
    if len(history) <= MAX_HISTORY_MESSAGES:
        return history
    return history[-MAX_HISTORY_MESSAGES:]


def validate_history(raw_history: list) -> tuple[list, str | None]:
    """Validate and sanitize conversation history from the request body."""
    if not isinstance(raw_history, list):
        return [], "history must be a list"

    sanitized = []
    for i, msg in enumerate(raw_history):
        if not isinstance(msg, dict):
            return [], f"history[{i}] must be an object"
        role = msg.get("role")
        content = msg.get("content")
        if role not in ("user", "assistant"):
            return [], f"history[{i}].role must be 'user' or 'assistant'"
        if not isinstance(content, str) or not content.strip():
            return [], f"history[{i}].content must be a non-empty string"
        sanitized.append({"role": role, "content": content})

    return sanitized, None
