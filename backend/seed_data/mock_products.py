"""
Mock data seed script for Revu AI
Creates 80 products across 8 categories with reviews
"""

import random
from datetime import datetime, timedelta
from app import create_app
from models.category import Category
from models.product import Product
from models.review import Review
from utils.database import db


# Category data
CATEGORIES = [
    {"name": "Electronics", "slug": "electronics"},
    {"name": "Home & Kitchen", "slug": "home-kitchen"},
    {"name": "Beauty & Personal Care", "slug": "beauty-personal-care"},
    {"name": "Sports & Outdoors", "slug": "sports-outdoors"},
    {"name": "Toys & Games", "slug": "toys-games"},
    {"name": "Health & Wellness", "slug": "health-wellness"},
    {"name": "Fashion & Accessories", "slug": "fashion-accessories"},
    {"name": "Office Supplies", "slug": "office-supplies"},
]

# Product templates by category
PRODUCTS = {
    "electronics": [
        {"name": "UltraSound Pro Wireless Headphones", "price": 129.99, "description": "Premium noise-cancelling wireless headphones with 40-hour battery life"},
        {"name": "SmartView 4K Action Camera", "price": 89.99, "description": "Waterproof 4K action camera with image stabilization"},
        {"name": "PowerHub USB-C Charging Station", "price": 45.99, "description": "6-port USB-C charging hub with fast charging"},
        {"name": "EchoBeam Bluetooth Speaker", "price": 79.99, "description": "Portable waterproof speaker with 360-degree sound"},
        {"name": "TechPad Pro Tablet 10-inch", "price": 299.99, "description": "High-performance tablet with stylus support"},
        {"name": "SmartBand Fitness Tracker", "price": 59.99, "description": "Water-resistant fitness tracker with heart rate monitor"},
        {"name": "NightVision Webcam HD", "price": 69.99, "description": "1080p webcam with low-light correction"},
        {"name": "WaveSound Earbuds Pro", "price": 149.99, "description": "True wireless earbuds with active noise cancellation"},
        {"name": "ChargeMate Wireless Pad", "price": 24.99, "description": "Fast wireless charging pad for all Qi devices"},
        {"name": "GameStream Controller Pro", "price": 54.99, "description": "Ergonomic wireless gaming controller"},
    ],
    "home-kitchen": [
        {"name": "ChefMaster Air Fryer XL", "price": 119.99, "description": "7-quart digital air fryer with 8 cooking presets"},
        {"name": "BrewPerfect Coffee Maker", "price": 89.99, "description": "Programmable 12-cup coffee maker with thermal carafe"},
        {"name": "BlendForce Pro Blender", "price": 69.99, "description": "1200W professional blender with pulse function"},
        {"name": "SmartVac Robot Vacuum", "price": 249.99, "description": "Self-charging robot vacuum with app control"},
        {"name": "PureAir HEPA Air Purifier", "price": 159.99, "description": "True HEPA air purifier for large rooms"},
        {"name": "InstantHeat Electric Kettle", "price": 34.99, "description": "1.7L stainless steel kettle with auto shut-off"},
        {"name": "ProChop Food Processor", "price": 79.99, "description": "12-cup food processor with multiple blades"},
        {"name": "SliceMaster Knife Set", "price": 99.99, "description": "Professional 15-piece knife set with block"},
        {"name": "FreshSeal Vacuum Sealer", "price": 64.99, "description": "Automatic vacuum sealer with 10 bags included"},
        {"name": "SpaceSaver Storage Containers", "price": 29.99, "description": "20-piece airtight food storage set"},
    ],
    "beauty-personal-care": [
        {"name": "GlowSkin LED Face Mask", "price": 199.99, "description": "LED light therapy mask for skin rejuvenation"},
        {"name": "SilkDry Ionic Hair Dryer", "price": 89.99, "description": "Professional ionic hair dryer with diffuser"},
        {"name": "SmoothGlide Electric Shaver", "price": 119.99, "description": "Wet and dry electric shaver with precision trimmer"},
        {"name": "RadiantSmile Electric Toothbrush", "price": 79.99, "description": "Sonic toothbrush with 5 brushing modes"},
        {"name": "PureGlow Facial Cleansing Brush", "price": 49.99, "description": "Waterproof rotating facial cleansing system"},
        {"name": "AromaTherapy Diffuser", "price": 34.99, "description": "Ultrasonic essential oil diffuser with LED lights"},
        {"name": "PerfectCurl Hair Straightener", "price": 59.99, "description": "Ceramic flat iron with adjustable temperature"},
        {"name": "ManiPro Electric Nail File", "price": 39.99, "description": "Professional electric nail drill and file kit"},
        {"name": "SpaTreat Foot Massager", "price": 89.99, "description": "Shiatsu foot massager with heat therapy"},
        {"name": "LuxeLash Heated Eyelash Curler", "price": 24.99, "description": "Battery-powered heated eyelash curler"},
    ],
    "sports-outdoors": [
        {"name": "TrailBlazer Hiking Backpack 50L", "price": 89.99, "description": "Waterproof hiking backpack with hydration system"},
        {"name": "FitCore Yoga Mat Premium", "price": 39.99, "description": "Extra-thick non-slip yoga mat with carrying strap"},
        {"name": "CampEasy 4-Person Tent", "price": 129.99, "description": "Weatherproof camping tent with easy setup"},
        {"name": "HydroFlow Water Bottle 32oz", "price": 24.99, "description": "Insulated stainless steel water bottle"},
        {"name": "PowerLift Adjustable Dumbbells", "price": 199.99, "description": "Adjustable dumbbell set 5-52.5 lbs"},
        {"name": "SpeedTrack Running Shoes", "price": 79.99, "description": "Lightweight cushioned running shoes"},
        {"name": "ProGrip Resistance Bands Set", "price": 29.99, "description": "5-piece resistance band set with handles"},
        {"name": "CyclePro Bike Computer", "price": 49.99, "description": "GPS bike computer with heart rate monitor"},
        {"name": "RapidDry Microfiber Towel", "price": 19.99, "description": "Quick-dry travel towel in 3 sizes"},
        {"name": "TrekLight LED Headlamp", "price": 34.99, "description": "Rechargeable LED headlamp 1000 lumens"},
    ],
    "toys-games": [
        {"name": "BuildMaster Robot Kit", "price": 79.99, "description": "STEM robotics kit with 500+ pieces"},
        {"name": "MindBender 3D Puzzle Set", "price": 34.99, "description": "Challenging 3D wooden puzzle collection"},
        {"name": "SpaceQuest Board Game", "price": 44.99, "description": "Strategy board game for 2-4 players"},
        {"name": "ArtStudio Drawing Tablet", "price": 59.99, "description": "Digital drawing tablet for kids"},
        {"name": "RaceTrack Remote Control Car", "price": 69.99, "description": "High-speed RC car with LED lights"},
        {"name": "EduBlocks STEM Building Set", "price": 49.99, "description": "300-piece magnetic building blocks"},
        {"name": "MagicShow Beginner Kit", "price": 29.99, "description": "Complete magic trick set for beginners"},
        {"name": "DreamDoll Interactive Robot", "price": 89.99, "description": "AI-powered interactive robot companion"},
        {"name": "SkyHigh Drone Mini", "price": 99.99, "description": "Beginner-friendly mini drone with camera"},
        {"name": "ChessMaster Electronic Board", "price": 119.99, "description": "Electronic chess set with AI opponent"},
    ],
    "health-wellness": [
        {"name": "ZenMind Meditation Cushion", "price": 39.99, "description": "Ergonomic meditation cushion with washable cover"},
        {"name": "PulseTrack Smart Scale", "price": 49.99, "description": "Smart scale with body composition analysis"},
        {"name": "SleepWell White Noise Machine", "price": 44.99, "description": "Sound machine with 20 soothing sounds"},
        {"name": "FlexiStretch Massage Gun", "price": 129.99, "description": "Deep tissue massage gun with 6 heads"},
        {"name": "VitaBoost Juicer Pro", "price": 79.99, "description": "Cold press juicer for maximum nutrients"},
        {"name": "BalanceBoard Fitness Trainer", "price": 59.99, "description": "Wobble board for core strength"},
        {"name": "AcuPress Acupressure Mat", "price": 34.99, "description": "Acupressure mat and pillow set"},
        {"name": "BreathEasy Humidifier", "price": 54.99, "description": "Ultrasonic humidifier with night light"},
        {"name": "PostureFix Back Support", "price": 29.99, "description": "Adjustable posture corrector brace"},
        {"name": "MindCalm Therapy Light", "price": 69.99, "description": "Light therapy lamp for mood and energy"},
    ],
    "fashion-accessories": [
        {"name": "LuxeLeather Crossbody Bag", "price": 89.99, "description": "Genuine leather crossbody bag with zipper"},
        {"name": "TimeMaster Automatic Watch", "price": 149.99, "description": "Stainless steel automatic watch"},
        {"name": "StyleShade Polarized Sunglasses", "price": 59.99, "description": "UV400 polarized sunglasses"},
        {"name": "WarmTouch Cashmere Scarf", "price": 79.99, "description": "100% cashmere winter scarf"},
        {"name": "TechWallet RFID Protection", "price": 34.99, "description": "Slim wallet with RFID blocking"},
        {"name": "GripSafe Phone Case", "price": 24.99, "description": "Shockproof phone case with card holder"},
        {"name": "ClassicBelt Italian Leather", "price": 49.99, "description": "Reversible genuine leather belt"},
        {"name": "ChillGuard Winter Gloves", "price": 29.99, "description": "Touchscreen-compatible winter gloves"},
        {"name": "TravelPack Toiletry Bag", "price": 39.99, "description": "Hanging toiletry bag with compartments"},
        {"name": "EcoTote Reusable Shopping Bags", "price": 19.99, "description": "Set of 5 washable shopping bags"},
    ],
    "office-supplies": [
        {"name": "ErgoDesk Adjustable Stand", "price": 199.99, "description": "Height-adjustable standing desk converter"},
        {"name": "ComfortChair Mesh Office Chair", "price": 249.99, "description": "Ergonomic office chair with lumbar support"},
        {"name": "ClearView Monitor Stand", "price": 49.99, "description": "Monitor riser with storage compartment"},
        {"name": "WriteFlow Fountain Pen Set", "price": 59.99, "description": "Premium fountain pen collection"},
        {"name": "OrganizePro Desk Organizer", "price": 34.99, "description": "Bamboo desk organizer with phone stand"},
        {"name": "SmartNote Digital Notebook", "price": 149.99, "description": "Reusable smart notebook with cloud sync"},
        {"name": "BindMaster Laminator", "price": 44.99, "description": "Thermal laminator with 50 pouches"},
        {"name": "PrecisionCut Paper Trimmer", "price": 29.99, "description": "12-inch paper trimmer with ruler"},
        {"name": "LabelPro Thermal Printer", "price": 89.99, "description": "Bluetooth label maker with app"},
        {"name": "QuietType Wireless Keyboard", "price": 79.99, "description": "Ergonomic wireless keyboard and mouse"},
    ],
}

# Review templates for sentiment
POSITIVE_REVIEWS = [
    {"text": "Absolutely love this product! It exceeded all my expectations and works perfectly.", "sentiment": 0.9, "pros": ["High quality", "Works as advertised", "Great value"]},
    {"text": "Best purchase I've made this year. The quality is outstanding and it's so easy to use.", "sentiment": 0.85, "pros": ["Excellent quality", "User friendly", "Durable"]},
    {"text": "This product is amazing! Highly recommend it to anyone looking for quality.", "sentiment": 0.9, "pros": ["Top-notch quality", "Reliable", "Worth the price"]},
    {"text": "Very impressed with the performance. It does exactly what it promises.", "sentiment": 0.8, "pros": ["Performs well", "Good build quality", "Reliable"]},
    {"text": "Great product for the price. I use it daily and it hasn't disappointed me yet.", "sentiment": 0.75, "pros": ["Affordable", "Daily use ready", "Consistent performance"]},
    {"text": "Fantastic! This has made my life so much easier. Worth every penny.", "sentiment": 0.9, "pros": ["Life changing", "Great value", "High quality"]},
    {"text": "Superior quality and design. This is exactly what I was looking for.", "sentiment": 0.85, "pros": ["Premium design", "High quality", "Meets expectations"]},
    {"text": "I'm very happy with this purchase. It works great and looks even better.", "sentiment": 0.8, "pros": ["Works great", "Attractive design", "Good quality"]},
]

MIXED_REVIEWS = [
    {"text": "Good product overall, but there are a few minor issues. Still happy with the purchase.", "sentiment": 0.6, "pros": ["Decent quality", "Mostly works well"], "cons": ["Minor issues", "Could be better"]},
    {"text": "It's okay for the price. Does the job but nothing spectacular.", "sentiment": 0.5, "pros": ["Affordable", "Functional"], "cons": ["Average quality", "Basic features"]},
    {"text": "Works well most of the time, but occasionally has some quirks.", "sentiment": 0.6, "pros": ["Usually works", "Decent build"], "cons": ["Occasional issues", "Not perfect"]},
    {"text": "Decent product but took some time to figure out. Once I got the hang of it, it's fine.", "sentiment": 0.55, "pros": ["Works once set up", "Acceptable quality"], "cons": ["Learning curve", "Instructions unclear"]},
    {"text": "Not bad, but not great either. It gets the job done.", "sentiment": 0.5, "pros": ["Functional", "Cheap"], "cons": ["Average performance", "Nothing special"]},
]

NEGATIVE_REVIEWS = [
    {"text": "Disappointed with this purchase. Quality is not as advertised.", "sentiment": 0.2, "pros": [], "cons": ["Poor quality", "Misleading description", "Not worth it"]},
    {"text": "This stopped working after two weeks. Very poor quality.", "sentiment": 0.1, "pros": [], "cons": ["Broke quickly", "Poor durability", "Waste of money"]},
    {"text": "Not happy with this at all. Expected much better for the price.", "sentiment": 0.25, "pros": [], "cons": ["Overpriced", "Low quality", "Disappointed"]},
    {"text": "Difficult to use and doesn't work as expected. Would not recommend.", "sentiment": 0.3, "pros": [], "cons": ["Hard to use", "Doesn't work well", "Not recommended"]},
]

SOURCES = ["amazon", "ebay", "tiktok", "etsy"]


def calculate_rating(reviews):
    """Calculate product rating based on review sentiments"""
    if not reviews:
        return 0.0

    # Average sentiment score
    avg_sentiment = sum(r["sentiment"] for r in reviews) / len(reviews)

    # Review count factor (more reviews = higher confidence)
    review_factor = min(len(reviews) / 15.0, 1.0)  # Max at 15 reviews

    # Calculate rating: sentiment contributes 70%, review count 30%
    rating = (avg_sentiment * 7) + (review_factor * 3)

    return round(rating, 1)


def create_mock_data():
    """Create mock categories, products, and reviews"""
    app = create_app()

    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()

        # Create categories
        print("Creating categories...")
        category_objects = {}
        for cat_data in CATEGORIES:
            category = Category(
                name=cat_data["name"],
                slug=cat_data["slug"],
                product_count=0
            )
            db.session.add(category)
            category_objects[cat_data["slug"]] = category

        db.session.commit()
        print(f"Created {len(CATEGORIES)} categories")

        # Create products and reviews
        print("Creating products and reviews...")
        total_products = 0

        for category_slug, products in PRODUCTS.items():
            for product_data in products:
                # Generate random number of reviews (7-12 per product)
                num_reviews = random.randint(7, 12)

                # Mix of positive (60%), mixed (30%), and negative (remainder)
                num_positive = int(num_reviews * 0.6)
                num_mixed = int(num_reviews * 0.3)
                num_negative = num_reviews - num_positive - num_mixed

                review_templates = []
                for _ in range(num_positive):
                    review_templates.append(random.choice(POSITIVE_REVIEWS))
                for _ in range(num_mixed):
                    review_templates.append(random.choice(MIXED_REVIEWS))
                for _ in range(num_negative):
                    review_templates.append(random.choice(NEGATIVE_REVIEWS))

                # Calculate rating
                rating = calculate_rating(review_templates)

                # Create product
                product = Product(
                    name=product_data["name"],
                    description=product_data["description"],
                    category=category_slug,
                    price=product_data["price"],
                    rating=rating,
                    review_count=len(review_templates),
                    image_url=f"https://placehold.co/400x400/png?text={product_data['name'][:20]}",
                    source_url=f"https://example.com/product/{category_slug}/{total_products}",
                    created_at=datetime.utcnow() - timedelta(days=random.randint(1, 90))
                )
                db.session.add(product)
                db.session.flush()  # Get product ID

                # Create reviews
                for review_template in review_templates:
                    review = Review(
                        product_id=product.id,
                        source=random.choice(SOURCES),
                        text=review_template["text"],
                        sentiment_score=review_template["sentiment"],
                        scraped_at=datetime.utcnow() - timedelta(days=random.randint(1, 60))
                    )
                    review.set_pros(review_template.get("pros", []))
                    review.set_cons(review_template.get("cons", []))
                    db.session.add(review)

                # Update category product count
                category_objects[category_slug].product_count += 1
                total_products += 1

        db.session.commit()
        print(f"Created {total_products} products with reviews")

        # Print summary
        print("\n=== Database Seeded Successfully ===")
        print(f"Categories: {len(CATEGORIES)}")
        print(f"Products: {total_products}")
        print(f"Average reviews per product: ~9")
        print("\nTop rated products:")
        top_products = Product.query.order_by(Product.rating.desc()).limit(5).all()
        for p in top_products:
            print(f"  - {p.name}: {p.rating}/10 ({p.review_count} reviews)")


if __name__ == "__main__":
    print("Starting database seed...")
    create_mock_data()
    print("\nDone! Run 'python app.py' to start the server.")
