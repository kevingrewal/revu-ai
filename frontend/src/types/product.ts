export interface Review {
  id: string;
  product_id: string;
  source: 'amazon' | 'ebay' | 'tiktok' | 'etsy';
  text: string;
  sentiment_score: number;
  pros: string[];
  cons: string[];
  scraped_at: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  rating: number; // 0-10
  review_count: number;
  image_url: string | null;
  source_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProductDetail extends Product {
  reviews: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  product_count: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CategoryProductsResponse {
  category: Category;
  products: Product[];
  total: number;
}
