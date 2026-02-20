# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Revu AI is a product review aggregation app that ranks products by AI-driven sentiment analysis of reviews from public sources (Amazon, eBay, TikTok, Etsy, etc.). See `revu_app_prompt.md` for the full product vision.

## Architecture

**Monorepo with two independent services:**
- `frontend/` — React 19 + TypeScript, built with Vite 7
- `backend/` — Python Flask API with CORS enabled

The frontend runs on `localhost:5173`, the backend on `localhost:5001`. API routes are prefixed with `/api/`.

## Commands

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py              # runs dev server on :5001
python sync.py             # sync products from Amazon via SerpApi
python sync.py --clean     # clear DB and re-sync
python -c "from seed_data.mock_products import seed_database; from app import app; seed_database(app)"  # seed mock data
```

### Frontend
```bash
cd frontend
npm install
npm run dev                # Vite dev server on :5173
npm run build              # tsc -b && vite build
npm run lint               # eslint .
npm run preview            # preview production build
```

## Backend Details

### Configuration
- Copy `backend/.env.example` to `backend/.env` for environment variables
- Flask runs in debug mode by default (`FLASK_DEBUG=1`)
- Database: SQLite at `backend/instance/revu.db` (override with `DATABASE_URL` env var)
- Dependencies: Flask, Flask-CORS, Flask-SQLAlchemy, SQLAlchemy, Pydantic, Requests, python-dotenv

### Environment Variables
- `SERPAPI_API_KEY` — Required for product sync and review fetching (250 free searches/month)
- `SERPAPI_MONTHLY_LIMIT` — Monthly API call budget (default: 250)
- `REVIEW_CACHE_DAYS` — Days before re-fetching reviews (default: 7)

### Database Models (`backend/models/`)
- **Product** — id (UUID), name, description, category (FK→Category.slug), price, rating (0-10), review_count, image_url, source_url, bestbuy_sku, amazon_asin, reviews_fetched_at
- **Review** — id (UUID), product_id (FK→Product.id), source, text, sentiment_score (-1 to 1), source_rating (1-5 stars), pros/cons (JSON stored as text)
- **Category** — id (UUID), name, slug, product_count
- **ApiUsage** — id (UUID), api_name, endpoint, product_id, called_at (tracks external API calls for rate limiting)

### API Endpoints (`backend/routes/`)

**Products** (`/api/products`):
- `GET /api/products` — Paginated list. Params: `page`, `limit` (max 100), `category` (slug), `sort` (rating_desc|rating_asc|price_asc|price_desc|newest)
- `GET /api/products/<id>` — Product detail with reviews. Triggers on-demand review fetching from SerpApi if product has an amazon_asin

**Categories** (`/api/categories`):
- `GET /api/categories` — All categories sorted by name
- `GET /api/categories/<slug>/products` — Products in a category sorted by rating desc

**Health** (`/api/health`):
- `GET /api/health` — Health check
- `GET /api/hello` — Hello message
- `GET /api/api-usage` — SerpApi usage stats

### External API Integrations (`backend/services/`)
- **SerpApi** (`serpapi_client.py`) — Amazon product search, ASIN lookup, review fetching. Includes rate limiting with 10-call buffer before monthly limit
- **Best Buy** (`bestbuy_client.py`) — Product search by category/keyword. Integrated but not actively used in any routes yet
- **Review Service** (`review_service.py`) — Orchestrates review fetching with caching. Checks cache freshness, finds ASIN if missing, fetches/stores reviews, updates product counts

### Data Pipeline
- `sync.py` — CLI script that populates the DB with products from Amazon via SerpApi. Searches 8 categories with predefined queries, upserts by amazon_asin, converts Amazon 1-5 ratings to 0-10 scale
- `seed_data/mock_products.py` — Generates 80 mock products (10 per category) with ~700 reviews for development without API calls

### Backend Patterns
- App factory pattern (`create_app()` in `app.py`)
- Flask Blueprints for modular route organization
- Pydantic schemas for response validation (`backend/schemas/`)
- Service layer separates business logic from routes
- Review pros/cons stored as JSON text, accessed via `get_pros()`/`set_pros()` helpers

## Frontend Details

### Key Dependencies
- React 19, React Router 7, TanStack React Query 5, Axios, Framer Motion, Lucide React icons, Tailwind CSS 3.4

### Routing (`frontend/src/App.tsx`)
```
/ (Layout wrapper with header/footer)
├── /                    → Home (product grid sorted by rating)
├── /products/:id        → ProductDetailPage (full details + reviews)
├── /categories          → CategoriesPage (category grid)
├── /categories/:slug    → CategoryProductsPage (products in category)
└── /*                   → NotFound (404)
```

### Component Structure (`frontend/src/components/`)
- `layout/` — Layout, Header (with mobile menu), Footer
- `products/` — ProductCard, ProductGrid, ProductDetail, ProductCardSkeleton, ProductDetailSkeleton, RatingBadge
- `categories/` — CategoryCard, CategoryGrid, CategoryCardSkeleton
- `reviews/` — ReviewCard (expandable, sentiment-colored), ReviewList, ProConsList
- `ui/` — Badge, Button, Card, Skeleton, ThemeToggle (reusable primitives)

### Data Layer
- **API client** (`config/api.ts`) — Axios instance, base URL from `VITE_API_URL` env or `http://localhost:5001/api`, 10s timeout
- **Hooks** (`hooks/`) — `useProducts(page, limit, category, sort)`, `useProduct(id)`, `useCategories()`, `useTheme()`
- **Types** (`types/product.ts`) — Review, Product, ProductDetail, Category, ProductListResponse
- React Query: 5-min stale time, 1 retry, no refetch on window focus

### Styling & Theme
- Tailwind CSS with class-based dark mode
- Custom colors: `brand` (indigo), `surface` (light backgrounds), `dark` (dark backgrounds), `rating` (green/lime/amber/red)
- ThemeContext supports light/dark/system with localStorage persistence
- Framer Motion page transitions and staggered grid animations

### Frontend Patterns
- Skeleton loading for all data-fetching views
- Sentiment-colored review cards (green/amber/red borders)
- Rating badge with color coding: excellent (8+), good (6-8), mixed (4-6), poor (<4)
- ProConsList aggregates and deduplicates pros/cons from all reviews

## Not Yet Implemented
- Global search functionality
- User authentication
- Best Buy API integration into routes (client exists but unused)
- Price/rating range filtering on product list

## Git / Version Control

- **Use Graphite CLI (`gt`) instead of `git` for all branch, commit, and PR operations.**
- Use `gt create` to create stacked branches and PRs
- Use `gt commit` to commit changes
- Use `gt submit` to push and create/update PRs
- Use `gt log` to view the stack
- Only fall back to `git` for operations Graphite doesn't support (e.g., `git init`, `git remote`)
- **NEVER commit `.claude/commands/` or `.claude/settings.local.json`** — these are local-only files. Always keep them unstaged.

### Branching Strategy

- **`frontend-develop`** — Long-lived development branch for all frontend work. All frontend feature branches should be created off this branch.
- **`backend-develop`** — Long-lived development branch for all backend work. All backend feature branches should be created off this branch.
- **`master`** — Stable main branch. `frontend-develop` and `backend-develop` merge into `master` when ready.
- When creating a new feature branch, always branch off the correct develop branch:
  - Frontend changes → branch off `frontend-develop`
  - Backend changes → branch off `backend-develop`
  - Full-stack changes → coordinate across both develop branches
