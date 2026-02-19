"""AI-powered sentiment analysis and pros/cons extraction using Claude API."""
import logging
import anthropic
from flask import current_app

logger = logging.getLogger(__name__)

BATCH_SIZE = 10

SYSTEM_PROMPT = (
    "You are a product review analyst. Analyze each customer review and determine:\n"
    "1. A sentiment score from 0.0 (very negative) to 1.0 (very positive). "
    "Consider the full text, not just the star rating.\n"
    "2. Specific pros mentioned (concrete benefits, features, or positive experiences). "
    "1-3 items, each under 10 words.\n"
    "3. Specific cons mentioned (concrete problems, missing features, or negative experiences). "
    "1-3 items, each under 10 words.\n\n"
    "If a review is entirely positive, cons can be an empty list (and vice versa). "
    "Focus on extracting actionable, specific insights rather than generic statements."
)

ANALYSIS_TOOL = {
    "name": "submit_review_analysis",
    "description": "Submit the sentiment analysis results for a batch of product reviews.",
    "input_schema": {
        "type": "object",
        "properties": {
            "reviews": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "integer",
                            "description": "The review index from the input",
                        },
                        "sentiment_score": {
                            "type": "number",
                            "description": "Sentiment score from 0.0 (very negative) to 1.0 (very positive)",
                        },
                        "pros": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "1-3 short specific pros mentioned in the review (each under 10 words)",
                        },
                        "cons": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "1-3 short specific cons mentioned in the review (each under 10 words)",
                        },
                    },
                    "required": ["id", "sentiment_score", "pros", "cons"],
                },
            }
        },
        "required": ["reviews"],
    },
}


class SentimentAnalysisError(Exception):
    """Raised when AI sentiment analysis fails."""
    pass


def _build_prompt(reviews):
    """Build the user message for a batch of reviews."""
    lines = ["Analyze the following product reviews:\n"]
    for r in reviews:
        lines.append(f"[Review {r['id']}] (Star rating: {r['star_rating']}/5)")
        lines.append(r["text"])
        lines.append("")
    return "\n".join(lines)


def _parse_response(reviews_data):
    """Validate and normalize structured output from Claude."""
    results = []
    for item in reviews_data:
        result = {
            "id": item.get("id"),
            "sentiment_score": max(0.0, min(1.0, float(item.get("sentiment_score", 0.5)))),
            "pros": [],
            "cons": [],
        }
        for pro in item.get("pros", [])[:3]:
            if isinstance(pro, str) and pro.strip():
                result["pros"].append(pro.strip()[:100])
        for con in item.get("cons", [])[:3]:
            if isinstance(con, str) and con.strip():
                result["cons"].append(con.strip()[:100])
        results.append(result)
    return results


def analyze_reviews_batch(review_texts):
    """
    Analyze a batch of reviews (up to BATCH_SIZE) using Claude Haiku.

    Args:
        review_texts: List of dicts with "id", "text", "star_rating" keys.

    Returns:
        List of dicts with "id", "sentiment_score", "pros", "cons" keys.

    Raises:
        SentimentAnalysisError on any failure.
    """
    api_key = current_app.config.get("ANTHROPIC_API_KEY", "")
    if not api_key:
        raise SentimentAnalysisError("ANTHROPIC_API_KEY not configured")

    client = anthropic.Anthropic(api_key=api_key)
    user_prompt = _build_prompt(review_texts)

    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=2048,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
            tools=[ANALYSIS_TOOL],
            tool_choice={"type": "tool", "name": "submit_review_analysis"},
        )
    except anthropic.APIConnectionError as e:
        raise SentimentAnalysisError(f"Could not connect to Claude API: {e}")
    except anthropic.RateLimitError as e:
        raise SentimentAnalysisError(f"Claude API rate limit reached: {e}")
    except anthropic.AuthenticationError as e:
        raise SentimentAnalysisError(f"Invalid Anthropic API key: {e}")
    except Exception as e:
        raise SentimentAnalysisError(f"Claude API call failed: {e}")

    for block in response.content:
        if block.type == "tool_use" and block.name == "submit_review_analysis":
            return _parse_response(block.input.get("reviews", []))

    raise SentimentAnalysisError("No tool_use block found in Claude response")


def analyze_reviews(review_texts):
    """
    Public entry point. Splits reviews into batches, analyzes each.

    Returns:
        Combined results list on success, or None if any batch fails
        (signaling caller to use fallback for ALL reviews).
    """
    if not review_texts:
        return []

    all_results = []
    for i in range(0, len(review_texts), BATCH_SIZE):
        batch = review_texts[i:i + BATCH_SIZE]
        try:
            batch_results = analyze_reviews_batch(batch)
            all_results.extend(batch_results)
        except SentimentAnalysisError as e:
            logger.warning(
                "AI sentiment batch %d-%d failed, falling back: %s",
                i, i + len(batch), e,
            )
            return None

    return all_results
