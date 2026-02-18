from typing import List, Optional
from pydantic import BaseModel, Field


class ReviewResponse(BaseModel):
    """Review response schema"""

    id: str
    product_id: str
    source: str
    text: str
    sentiment_score: float
    pros: List[str] = []
    cons: List[str] = []
    scraped_at: Optional[str] = None

    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    """Product response schema for list views"""

    id: str
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    price: float
    rating: float = Field(ge=0, le=10)
    review_count: int = 0
    image_url: Optional[str] = None
    source_url: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class ProductDetailResponse(ProductResponse):
    """Product detail response with reviews"""

    reviews: List[ReviewResponse] = []

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    """Paginated product list response"""

    products: List[ProductResponse]
    total: int
    page: int
    limit: int
    pages: int


class CategoryResponse(BaseModel):
    """Category response schema"""

    id: str
    name: str
    slug: str
    product_count: int = 0

    class Config:
        from_attributes = True
