# BeFit API - FastAPI Backend Documentation

**Project**: T1-MFDS 2025 Backend (BeFit - Fitness E-Commerce Platform)  
**Framework**: FastAPI with SQLAlchemy ORM  
**Database**: PostgreSQL (with SQLite support for local development)  
**Authentication**: AWS Cognito  
**Payment Processors**: Stripe & PayPal  
**Cloud Storage**: AWS S3  
**Last Updated**: 2025-11-17

---

## 1. DIRECTORY STRUCTURE & ORGANIZATION

```
Backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app entry point with lifespan management
│   ├── config.py                  # Settings & environment variables (Pydantic Settings)
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                # Dependency injection (auth, DB, security)
│   │   └── v1/                    # API v1 endpoints
│   │       ├── __init__.py
│   │       ├── router.py          # Main router aggregating all v1 endpoints
│   │       ├── auth/              # Authentication routes & service
│   │       ├── products/          # Product catalog routes & service
│   │       ├── cart/              # Shopping cart routes & service
│   │       ├── orders/            # Order management routes & service
│   │       ├── payments/          # Payment processing routes & service
│   │       ├── subscriptions/     # Subscription management routes & service
│   │       ├── address/           # User address management routes & service
│   │       ├── payment_method/    # Payment method management routes & service
│   │       ├── loyalty/           # Loyalty program & points routes & service
│   │       ├── user_profile/      # User profile routes & service
│   │       ├── analytics/         # Analytics & reporting routes & service
│   │       ├── search/            # Product search & filtering routes & service
│   │       ├── admin/             # Admin endpoints routes & service
│   │       ├── shipping/          # Shipping & tracking routes & service
│   │       └── placement_test/    # Placement test routes & service
│   ├── core/
│   │   ├── __init__.py
│   │   ├── database.py            # SQLAlchemy engine, session, Base class
│   │   ├── security.py            # Password hashing/verification (bcrypt)
│   │   └── aws_cognito.py         # (Empty - Cognito logic in auth service)
│   ├── models/                    # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py                # User model with relationships
│   │   ├── product.py             # Product catalog model
│   │   ├── product_image.py       # Product images with S3 paths
│   │   ├── shopping_cart.py       # Shopping cart container
│   │   ├── cart_item.py           # Cart item (product + quantity)
│   │   ├── order.py               # Order with status tracking
│   │   ├── order_item.py          # Order line items
│   │   ├── address.py             # User addresses (shipping/billing)
│   │   ├── payment_method.py      # Saved payment methods (Stripe/PayPal)
│   │   ├── subscription.py        # Recurring subscription model
│   │   ├── fitness_profile.py     # User fitness goals/profile
│   │   ├── review.py              # Product reviews/ratings
│   │   ├── coupon.py              # Discount coupons
│   │   ├── user_coupon.py         # User coupon redemptions
│   │   ├── loyalty_tier.py        # Loyalty program tiers
│   │   ├── user_loyalty.py        # User loyalty status
│   │   ├── point_history.py       # Loyalty points transaction log
│   │   └── enum.py                # Enums (UserRole, OrderStatus, etc.)
│   ├── schemas/                   # Pydantic schemas (shared/common)
│   │   ├── __init__.py
│   │   └── common.py              # (Empty - schemas in each endpoint module)
│   ├── services/                  # Core business services
│   │   ├── __init__.py
│   │   ├── stripe_service.py      # Stripe payment integration (checkout, customers, setup intents)
│   │   ├── paypal_service.py      # PayPal payment integration (OAuth2, orders, capture)
│   │   ├── s3_service.py          # AWS S3 file upload (profile images, resizing)
│   │   └── scheduler.py           # APScheduler for cron jobs (subscriptions, points expiry)
│   └── utils/
│       ├── __init__.py
│       └── helpers.py             # (Empty - utility functions)
├── alembic/                       # Database migrations (Alembic)
│   ├── versions/
│   │   └── ab46214e3156_migracion_a_postgres.py  # Initial PostgreSQL migration
│   ├── env.py                     # Alembic environment configuration
│   ├── script.py.mako             # Alembic migration template
│   └── README
├── tests/
│   ├── __init__.py
│   ├── conftest.py                # pytest fixtures (DB setup, test client, users)
│   ├── test_admin.py              # Admin endpoints tests
│   ├── test_cart.py               # Shopping cart tests
│   └── test_products.py           # Product catalog tests
├── alembic.ini                    # Alembic configuration
├── __init__.py
└── [project root above has README.md, requirements.txt, .gitignore]
```

---

## 2. API STRUCTURE - Routes & Endpoints

### API Entry Point: `/api/v1`
All endpoints are prefixed with `/api/v1` and organized by module:

#### **Authentication** (`/api/v1/auth`)
- `POST /signup` - Register new user with profile image upload
- `POST /confirm` - Confirm email with verification code
- `POST /resend-code` - Resend verification code
- `POST /login` - Authenticate user (returns JWT tokens)
- `POST /refresh` - Refresh access token using refresh token
- `POST /logout` - Invalidate access token
- `POST /forgot-password` - Request password reset code
- `POST /confirm-forgot-password` - Complete password reset
- `POST /change-password` - Change password (requires auth)

#### **Products** (`/api/v1/products`)
- `GET /{product_id}` - Get product details with images
- `GET /{product_id}/related` - Get related products (by category/fitness objectives)
- `GET /{product_id}/reviews` - Get product reviews (paginated)
- `POST /{product_id}/reviews` - Create product review (requires auth)

#### **Shopping Cart** (`/api/v1/cart`)
- `GET /` - Get user's shopping cart
- `POST /items` - Add product to cart
- `PATCH /items/{item_id}` - Update cart item quantity
- `DELETE /items/{item_id}` - Remove item from cart
- `DELETE /` - Clear entire cart

#### **Orders** (`/api/v1/orders`)
- `GET /` - List user's orders
- `GET /{order_id}` - Get order details
- `POST /` - Create order (from cart)
- `PATCH /{order_id}/status` - Update order status (admin only)

#### **Payments (Checkout)** (`/api/v1/checkout`)
- `POST /summary` - Calculate checkout totals (subtotal, shipping, discounts, points)
- `POST /stripe` - Create Stripe checkout session
- `POST /paypal` - Create PayPal order
- `POST /paypal/capture` - Capture PayPal payment
- `POST /webhook/stripe` - Stripe webhook handler

#### **Addresses** (`/api/v1/addresses`)
- `GET /` - List user addresses
- `POST /` - Create new address
- `PATCH /{address_id}` - Update address
- `DELETE /{address_id}` - Delete address

#### **Payment Methods** (`/api/v1/payment-methods`)
- `GET /` - List saved payment methods
- `POST /` - Save new payment method
- `DELETE /{method_id}` - Delete payment method

#### **Loyalty Program** (`/api/v1/loyalty`)
- `GET /points` - Get user loyalty points balance
- `GET /tier` - Get user loyalty tier
- `GET /history` - Get points transaction history
- `POST /redeem-coupon` - Redeem loyalty coupon
- `GET /tier-benefits` - Get benefits for loyalty tier

#### **Subscriptions** (`/api/v1/subscriptions`)
- `GET /` - Get user's subscriptions
- `POST /` - Create subscription
- `PATCH /{subscription_id}/status` - Pause/resume subscription
- `DELETE /{subscription_id}` - Cancel subscription

#### **User Profile** (`/api/v1/profile`)
- `GET /` - Get user profile details
- `PATCH /` - Update user profile
- `GET /fitness-profile` - Get fitness objectives/profile
- `POST /fitness-profile` - Create/update fitness profile

#### **Search & Filters** (`/api/v1/search`)
- `GET /` - Search products with filters
- Query params: `category`, `fitness_objectives`, `physical_activities`, `price_range`, etc.

#### **Shipping** (`/api/v1/shipping`)
- `GET /tracking/{order_id}` - Get shipment tracking
- `POST /calculate` - Calculate shipping cost

#### **Analytics** (`/api/v1/analytics`)
- `GET /sales` - Sales analytics (admin)
- `GET /user-behavior` - User behavior analytics (admin)
- `GET /revenue` - Revenue reports (admin)
- `GET /top-products` - Top performing products (admin)

#### **Admin** (`/api/v1/admin`)
- `GET /users` - List all users (paginated)
- `POST /users` - Create user (admin)
- `PATCH /users/{user_id}` - Update user (admin)
- `DELETE /users/{user_id}` - Delete user (admin)
- `GET /products` - List all products (admin)
- `POST /products` - Create product (admin)
- `PATCH /products/{product_id}` - Update product (admin)
- `DELETE /products/{product_id}` - Delete product (admin)

#### **Placement Test** (`/api/v1/placement-test`)
- Fitness assessment endpoints

---

## 3. DATABASE MODELS & RELATIONSHIPS

### Core Models (Key Entities)

#### **User** (Central Entity)
- **Fields**: user_id (PK), role, email, password_hash, cognito_sub, stripe_customer_id, first_name, last_name, gender, date_of_birth, profile_picture, account_status, created_at
- **Relationships**: 
  - `fitness_profile` (1:1) - User fitness goals
  - `addresses` (1:N) - Shipping/billing addresses
  - `payment_methods` (1:N) - Saved payment methods
  - `shopping_cart` (1:1) - Current shopping cart
  - `orders` (1:N) - Purchase orders
  - `reviews` (1:N) - Product reviews
  - `subscription` (1:1) - Active subscription
  - `user_loyalty` (1:1) - Loyalty program status
  - `user_coupons` (1:N) - Redeemed coupons

#### **Product**
- **Fields**: product_id (PK), name, description, brand, category, physical_activities (JSON), fitness_objectives (JSON), nutritional_value, price, stock, average_rating, is_active, created_at, updated_at
- **Relationships**:
  - `product_images` (1:N) - Product images in S3
  - `cart_items` (1:N) - Items in shopping carts
  - `order_items` (1:N) - Items in orders
  - `reviews` (1:N) - Product reviews

#### **Order**
- **Fields**: order_id (PK), user_id (FK), address_id (FK), payment_id (FK), coupon_id (FK), subscription_id (FK), is_subscription, order_date, order_status (PENDING/PAID/SHIPPED/DELIVERED/CANCELLED), tracking_number, subtotal, discount_amount, shipping_cost, total_amount, points_earned
- **Relationships**:
  - `user` (N:1) - Order owner
  - `address` (N:1) - Delivery address
  - `payment_method` (N:1) - Payment used
  - `coupon` (N:1, optional) - Applied coupon
  - `subscription` (N:1, optional) - If subscription order
  - `order_items` (1:N) - Products in order
  - `reviews` (1:N) - Order reviews
  - `point_history` (1:1, optional) - Points earned

#### **Subscription**
- **Fields**: subscription_id (PK), user_id (FK, unique), profile_id (FK), payment_method_id (FK), subscription_status, start_date, end_date, next_delivery_date, auto_renew, price, last_payment_date, failed_payment_attempts
- **Relationships**:
  - `user` (N:1)
  - `fitness_profile` (N:1)
  - `orders` (1:N) - Automatic orders created
  - `payment_method` (N:1)

#### **ShoppingCart & CartItem**
- **ShoppingCart**: cart_id (PK), user_id (FK, unique), created_at, updated_at
- **CartItem**: item_id (PK), cart_id (FK), product_id (FK), quantity

#### **PaymentMethod**
- **Fields**: payment_id (PK), user_id (FK), payment_type (PAYPAL/CREDIT_CARD/DEBIT_CARD), stripe_payment_method_id, paypal_email, is_default, created_at
- **Relationships**: 
  - `orders` (1:N)
  - `subscriptions` (1:N)

#### **Address**
- **Fields**: address_id (PK), user_id (FK), address_line_1, address_line_2, city, state, postal_code, country, is_default, is_billing
- **Relationships**: `orders` (1:N)

#### **Review**
- **Fields**: review_id (PK), product_id (FK), user_id (FK), order_id (FK), rating, comment, created_at
- **Relationships**: `product` (N:1), `user` (N:1), `order` (N:1)

#### **Loyalty Program Models**
- **LoyaltyTier**: tier_id, tier_level, min_points_required, points_multiplier, free_shipping_threshold, monthly_coupons_count, coupon_discount_percentage
- **UserLoyalty**: user_id (FK), tier_id (FK), current_points, lifetime_points, tier_upgrade_date
- **UserCoupon**: coupon_id (FK), user_id (FK), order_id (FK, optional), used_at
- **Coupon**: coupon_id, coupon_code (unique), discount_value, start_date, expiration_date, is_active
- **PointHistory**: history_id, user_id (FK), order_id (FK, optional), event_type (EARNED/EXPIRED), points_amount, created_at

#### **FitnessProfile**
- **Fields**: profile_id (PK), user_id (FK, unique), fitness_objectives (JSON), physical_activities (JSON), dietary_preferences (JSON), health_conditions (JSON), created_at, updated_at

#### **ProductImage**
- **Fields**: image_id (PK), product_id (FK), image_path (S3 URL), is_primary, uploaded_at

### Key Constraints
- `User.cognito_sub` is unique (required for AWS Cognito sync)
- `User.email` is unique (if using email authentication)
- `Subscription.user_id` is unique (one subscription per user)
- `ShoppingCart.user_id` is unique (one cart per user)
- **Order constraint**: If `is_subscription = true`, then `subscription_id` must NOT be NULL

---

## 4. CORE SERVICES & ARCHITECTURE

### Service Layer Pattern
Each API module (`/api/v1/{module}`) contains:
- `routes.py` - FastAPI route handlers
- `schemas.py` - Pydantic validation models (request/response)
- `service.py` - Business logic (database queries, external API calls)

This follows **Clean Architecture** with separation of concerns.

### Core Business Services

#### **Authentication Service** (`app/api/v1/auth/service.py`)
- **Class**: `CognitoService`
- **Methods**:
  - `sign_up()` - Register user in Cognito + local DB + S3 image upload
  - `confirm_sign_up()` - Verify email with code
  - `sign_in()` - Authenticate (returns JWT tokens)
  - `refresh_token()` - Get new access token
  - `sign_out()` - Invalidate access token
  - `forgot_password()` - Request password reset
  - `confirm_forgot_password()` - Complete password reset
  - `change_password()` - Change password for authenticated user
  - `verify_token()` - Validate JWT token and return payload
  - `_get_jwks()` - Cache JWKS public keys from Cognito (1-hour cache)

#### **Stripe Service** (`app/services/stripe_service.py`)
- **Class**: `StripeService`
- **Methods**:
  - `create_checkout_session()` - Create Stripe payment session (redirect-based)
  - `get_or_create_customer()` - Get/create Stripe customer by email
  - `create_setup_intent()` - Create intent for saving payment method
  - `charge_saved_card()` - Charge existing saved card
  - `create_payment_method()` - Save card to Stripe
  - `confirm_3d_secure()` - Handle 3D Secure authentication
  - `handle_webhook()` - Process Stripe webhooks

#### **PayPal Service** (`app/services/paypal_service.py`)
- **Class**: `PayPalService`
- **Methods**:
  - `get_access_token()` - OAuth2 token retrieval
  - `create_order()` - Create PayPal order (CAPTURE intent)
  - `capture_order()` - Capture approved payment
  - Uses `httpx.AsyncClient` for async HTTP requests

#### **S3 Service** (`app/services/s3_service.py`)
- **Class**: `S3Service`
- **Methods**:
  - `upload_profile_img()` - Upload profile picture with:
    - Size validation (max 5MB)
    - Format validation (JPEG/PNG/WEBP)
    - Auto-resize to max 1024x1024 px
    - Path structure: `profile_images/{user_id}/picture.{ext}`
  - `upload_product_image()` - Upload product images
  - `get_public_url()` - Generate public S3 URL

#### **Scheduler Service** (`app/services/scheduler.py`)
- **Framework**: APScheduler (background jobs)
- **Jobs**:
  1. **Point Expiry Job** (00:00 daily) - Expire old loyalty points
  2. **Subscription Processing Job** (00:30 daily) - Process subscription charges and create orders
- **Methods**:
  - `start_scheduler()` - Initialize and start background scheduler
  - `stop_scheduler()` - Gracefully shutdown scheduler
  - `get_scheduler_status()` - Get running jobs info
  - `run_expire_points_now()` - Manual testing trigger
  - `run_process_subscriptions_now()` - Manual testing trigger

#### **Module-Specific Services** (~5,873 lines total across all services)
- **CartService** (341 lines) - Add/remove items, calculate totals
- **OrderService** (467 lines) - Create orders, manage status, track shipments
- **ProductService** (393 lines) - Product CRUD, filtering, search, related products
- **PaymentService** (710 lines) - Payment processing, status tracking
- **LoyaltyService** (521 lines) - Points management, tier calculation, coupon generation
- **SubscriptionService** (632 lines) - Subscription CRUD, automatic charging
- **UserProfileService** (194 lines) - Profile updates, fitness goals
- **AddressService** (243 lines) - Address management
- **PaymentMethodService** (324 lines) - Saved payment method management
- **AnalyticsService** (885 lines) - Sales, revenue, user behavior reports
- **SearchService** (173 lines) - Product search with filters
- **ShippingService** (158 lines) - Shipping calculation, tracking
- **PlacementTestService** (268 lines) - Fitness assessment logic
- **AdminService** (69 lines) - Admin utilities

---

## 5. EXTERNAL INTEGRATIONS

### **AWS Cognito** (Identity Management)
- **Configuration**: User pool ID, client ID, region (from `.env`)
- **Features**:
  - User registration with password validation
  - Email verification via codes
  - JWT token management (access_token, id_token, refresh_token)
  - Password reset flow
  - JWKS public key caching (1-hour TTL)
- **Sync**: Cognito `sub` claim stored in User.cognito_sub for local DB lookup
- **JWT Verification**: Tokens verified using JWKS from Cognito endpoints

### **AWS S3** (Cloud Storage)
- **Purpose**: Profile images, product images, documents
- **Validation**:
  - Max file size: 5MB
  - Allowed formats: JPEG, PNG, WEBP
  - Auto-resize: Images scaled to max 1024x1024 px
- **Path Structure**:
  - User profiles: `profile_images/{user_id}/picture.{ext}`
  - Products: `product_images/{product_id}/{timestamp}.{ext}`
- **Public URLs**: Generated for client-side display

### **Stripe** (Payment Processing)
- **Configuration**: API key, secret key, webhook secret (from `.env`)
- **Workflows**:
  1. **Hosted Checkout**: Create session → Redirect to Stripe checkout → Webhook confirmation
  2. **Saved Cards**: Setup Intent → Save card → Charge with saved method
  3. **Subscriptions**: Create/manage recurring charges
- **Webhooks**: 
  - `payment_intent.succeeded` - Order fulfillment
  - `payment_intent.payment_failed` - Retry logic
  - `charge.dispute.created` - Chargeback handling
- **Metadata**: Order ID, user ID, cart items passed to Stripe

### **PayPal** (Alternative Payment)
- **Configuration**: Client ID, client secret, base URL (sandbox/live)
- **Flow**:
  1. Get OAuth2 access token
  2. Create order with amount and return URLs
  3. User approves on PayPal
  4. Backend captures payment
- **Currencies**: MXN (Mexican Peso) by default
- **Return URLs**: 
  - Success: `{APP_URL}/success`
  - Cancel: `{APP_URL}/checkout`

### **Email Service** (Optional)
- **Library**: fastapi-mail
- **Use Cases**: Verification codes, password reset, order confirmations
- **Config**: Loaded from `.env` (SMTP settings)

---

## 6. CONFIGURATION & ENVIRONMENT SETUP

### **Settings Class** (`app/config.py`)
Uses **Pydantic Settings** with `.env` file support:

```python
class Settings(BaseSettings):
    # Application
    APP_NAME: str = "BeFit API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str  # PostgreSQL connection string
    
    # AWS
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    
    # AWS Cognito
    COGNITO_REGION: str
    COGNITO_USER_POOL_ID: str
    COGNITO_CLIENT_ID: str
    
    # AWS S3
    S3_BUCKET_NAME: str
    
    # JWT
    JWT_SECRET_KEY: str | None = None
    JWT_ALGORITHM: str = "RS256"  # RS256 for Cognito
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Stripe
    STRIPE_API_KEY: str
    STRIPE_SECRET_KEY: str
    STRIPE_WEBHOOK_SECRET: str
    
    # PayPal
    PAYPAL_CLIENT_ID: str
    PAYPAL_CLIENT_SECRET: str
    PAYPAL_API_BASE_URL: str  # https://api.sandbox.paypal.com
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = []
    APP_URL: str  # Frontend URL for redirects
    
    class Config:
        env_file = ".env"
        case_sensitive = True
```

### **Key Environment Variables**
```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/befit_db

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx

# Cognito
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxx
COGNITO_CLIENT_ID=xxxxx

# S3
S3_BUCKET_NAME=befit-bucket

# JWT
JWT_SECRET_KEY=your_secret_key_here
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Stripe
STRIPE_API_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# PayPal
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_API_BASE_URL=https://api.sandbox.paypal.com

# CORS & URLs
BACKEND_CORS_ORIGINS=["http://localhost:3000", "https://yourdomain.com"]
APP_URL=https://yourdomain.com

# Optional
DEV_MODE=true  # Bypass admin check for development
DEBUG=true
```

### **Debug Method**
- `settings.print_debug_info()` - Prints configuration on startup (development only)
- Shows which configs are set, masks sensitive values

---

## 7. DATABASE MIGRATIONS (Alembic)

### **Setup**
- **Tool**: Alembic v1.17.1
- **Database Driver**: psycopg2-binary (PostgreSQL)
- **Config File**: `alembic.ini`

### **Migrations Location**
- `alembic/versions/` - Individual migration scripts
- Current migration: `ab46214e3156_migracion_a_postgres.py` (initial schema)

### **Commands**
```bash
# Generate new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Downgrade
alembic downgrade -1

# Show current revision
alembic current

# Show history
alembic history
```

### **Models Auto-Discovery**
- All models imported in `alembic/env.py`
- SQLAlchemy metadata used for auto-generation

### **Key Tables Created**
- user, product, order, order_item, shopping_cart, cart_item
- address, payment_method, subscription
- review, coupon, user_coupon, loyalty_tier, user_loyalty, point_history
- product_image, fitness_profile

---

## 8. TESTING STRUCTURE

### **Testing Framework**: pytest
- **Configuration**: `tests/conftest.py`
- **Database**: SQLite in-memory (`:memory:`) for test isolation
- **Client**: `TestClient` from FastAPI

### **Fixtures** (conftest.py)
```python
@pytest.fixture(scope="function")
def db():
    """In-memory SQLite database for each test"""
    # Creates tables, yields session, cleans up after test

@pytest.fixture
def client(db):
    """TestClient with dependency overrides for testing"""
    # Injects test DB instead of real DB

@pytest.fixture
def test_user(db):
    """Sample user for auth tests"""
    # Creates User, FitnessProfile, ShoppingCart

@pytest.fixture
def test_admin(db):
    """Sample admin user"""

@pytest.fixture
def test_product(db):
    """Sample product for product tests"""

@pytest.fixture
def test_client_with_auth(client, test_user):
    """TestClient with auth headers"""
```

### **Test Files**
- `test_products.py` - Product endpoints (GET, list, reviews, filters)
- `test_cart.py` - Shopping cart operations (add, update, delete, checkout)
- `test_admin.py` - Admin endpoints (CRUD users, products, analytics)

### **Testing Best Practices**
- Cognito region set to "test" to bypass AWS calls
- JWKS cache skipped in test environment
- Each test gets fresh database instance
- Tests rollback to avoid side effects

### **Pytest Commands**
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_products.py

# Run with coverage
pytest --cov=app

# Run with verbose output
pytest -v
```

---

## 9. KEY ARCHITECTURAL PATTERNS

### **Dependency Injection** (`app/api/deps.py`)
FastAPI uses function dependencies for:
- **get_db()** - Database session injection
- **get_current_user()** - Authenticated user extraction
  - Validates JWT with Cognito
  - Queries User from DB by cognito_sub
  - Checks account_status
- **require_admin()** - Role-based access control
  - Enforces ADMIN role (bypassed if DEV_MODE=true)
- **get_optional_user()** - Optional auth (doesn't fail if missing)

### **Service Layer**
- Business logic isolated in service classes
- Services handle database queries and external API calls
- Routes delegate to services (thin controller pattern)

### **Pydantic Schemas**
- **Request Schemas**: Validate incoming data (POST/PATCH bodies)
- **Response Schemas**: Serialize database models (with `from_orm=True`)
- **Separation**: Each module has its own `schemas.py`

### **Enums** (`app/models/enum.py`)
```python
UserRole: ADMIN, USER
AuthType: EMAIL, GOOGLE, FACEBOOK
Gender: M, F, PREFER_NOT_SAY
PaymentType: PAYPAL, CREDIT_CARD, DEBIT_CARD
SubscriptionStatus: ACTIVE, PAUSED, CANCELLED
OrderStatus: PENDING, PAID, SHIPPED, DELIVERED, CANCELLED
PointEventType: EARNED, EXPIRED
```

### **Error Handling**
- FastAPI HTTPException for API errors
- Proper HTTP status codes (400, 401, 403, 404, 422)
- Detailed error messages in response

### **Async/Await**
- PayPal service uses `httpx.AsyncClient` for async HTTP
- Scheduler uses APScheduler for background jobs
- Most routes are sync, but endpoints can be async

### **Relationships & Cascades**
- SQLAlchemy relationship configurations with `cascade="all, delete-orphan"`
- FK constraints with `ondelete` policies (CASCADE, RESTRICT, SET NULL)

---

## 10. DEVELOPMENT SETUP & QUICK START

### **Prerequisites**
- Python 3.9+
- PostgreSQL 12+ (or SQLite for local dev)
- Git

### **Virtual Environment**
```bash
# Create venv
python -m venv venv

# Activate (Windows)
./venv/Scripts/activate

# Activate (macOS/Linux)
source venv/bin/activate
```

### **Installation**
```bash
# Install dependencies
pip install -r requirements.txt

# (Optional) Install development dependencies
pip install pytest pytest-cov black flake8
```

### **Environment Setup**
```bash
# Copy template
cp .env.example .env

# Edit .env with your credentials
# - DATABASE_URL: Your PostgreSQL connection
# - AWS credentials and region
# - Cognito user pool details
# - Stripe/PayPal API keys
# - CORS origins and frontend URL
```

### **Database Setup**
```bash
# Run migrations
cd Backend
alembic upgrade head

# (Or create tables from models if not using migrations)
python -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### **Run Development Server**
```bash
cd Backend

# With auto-reload
uvicorn app.main:app --reload

# Specify port
uvicorn app.main:app --reload --port 8001

# Access API
# - Swagger UI: http://localhost:8000/docs
# - ReDoc: http://localhost:8000/redoc
# - API: http://localhost:8000/api/v1
```

### **Running Tests**
```bash
cd Backend

# All tests
pytest

# With coverage
pytest --cov=app

# Specific test file
pytest tests/test_products.py -v
```

### **Important Notes**
- **Scheduler starts automatically** on app startup (lifespan context manager)
- **JWKS caching** reduces AWS calls (1-hour TTL)
- **DEV_MODE=true** bypasses admin role checks (development only)
- **COGNITO_REGION=test** skips AWS calls in tests
- **Logging** configured at INFO level by default

---

## 11. KEY DEPENDENCIES

### **Core Framework**
- `fastapi==0.121.0` - Web framework
- `uvicorn==0.38.0` - ASGI server
- `starlette==0.49.3` - Underlying HTTP toolkit

### **Database & ORM**
- `sqlalchemy==2.0.44` - ORM
- `alembic==1.17.1` - Migrations
- `psycopg2-binary==2.9.11` - PostgreSQL driver

### **Authentication & Security**
- `python-jose==3.5.0` - JWT token handling
- `bcrypt==4.1.3` - Password hashing
- `boto3==1.40.66` - AWS SDK (Cognito, S3)

### **Payment Processing**
- `stripe==13.1.2` - Stripe API
- `httpx==0.28.1` - Async HTTP client (PayPal)

### **Data Validation**
- `pydantic==2.12.3` - Schema validation
- `pydantic-settings==2.11.0` - Settings management
- `email-validator==2.3.0` - Email validation

### **Utilities**
- `aiosmtplib==4.0.2` - Email
- `APScheduler==3.11.1` - Cron jobs
- `pillow==12.0.0` - Image processing
- `python-dotenv==1.2.1` - Environment loading
- `python-dateutil==2.9.0.post0` - Date utilities
- `pytz==2025.2` - Timezone support

### **Testing**
- `pytest==8.4.2` - Test framework

---

## 12. IMPORTANT ARCHITECTURAL NOTES

### **Multi-Tenancy Considerations**
- Currently single-tenant (all data in one DB)
- User segregation via `user_id` foreign keys
- No tenant ID field (could add for future multi-tenancy)

### **Scalability**
- **Database**: PostgreSQL handles concurrent connections
- **Background Jobs**: APScheduler runs in same process (for scale, use Celery + Redis)
- **Session Management**: Per-request DB session (thread-safe)
- **S3 Uploads**: Async operations via boto3

### **Security**
- **Password Hashing**: bcrypt (industry standard)
- **JWT Tokens**: Cognito-issued, RS256 algorithm
- **CORS**: Configurable origins
- **HTTPS**: Enforced in production
- **Secrets**: Stored in environment variables (never committed)

### **Performance**
- **JWKS Caching**: 1-hour TTL reduces Cognito calls
- **Database Indexes**: On user_id, email, cognito_sub, product_id
- **Pagination**: Implemented in product reviews, orders, user lists
- **Query Optimization**: Relationships lazy-loaded (can be improved with eager loading)

### **Logging**
- **Level**: INFO by default
- **Format**: Timestamp, module name, level, message
- **Scheduler Logs**: Detailed job execution logs

### **Error Handling**
- **Validation Errors**: 422 UNPROCESSABLE_ENTITY (Pydantic)
- **Authentication**: 401 UNAUTHORIZED (invalid token)
- **Authorization**: 403 FORBIDDEN (missing role)
- **Not Found**: 404 NOT_FOUND (resource doesn't exist)
- **Server Errors**: 500 INTERNAL_SERVER_ERROR (with logging)

---

## 13. COMMON DEVELOPMENT TASKS

### **Adding a New Endpoint**
1. Create `routes.py` in `app/api/v1/{module}/`
2. Define route with dependencies (db, current_user, etc.)
3. Create request/response schemas in `schemas.py`
4. Create business logic in `service.py`
5. Add router to `app/api/v1/router.py`
6. Test with pytest

### **Integrating New External API**
1. Create service class in `app/services/`
2. Add configuration to `app/config.py`
3. Add error handling and logging
4. Create tests in `tests/`
5. Document in CLAUDE.md

### **Creating Database Migration**
```bash
# Auto-generate from models
alembic revision --autogenerate -m "Add new_table"

# Review generated migration file
# Apply
alembic upgrade head
```

### **Modifying Models**
1. Update model file in `app/models/`
2. Update relationships if needed
3. Create Alembic migration
4. Update related schemas
5. Test with pytest

---

## 14. MONITORING & DEBUGGING

### **Debug Configuration**
- `DEBUG=true` in `.env` triggers `settings.print_debug_info()`
- Shows all configuration values (masks secrets)

### **Logging**
```python
import logging
logger = logging.getLogger(__name__)
logger.info("Info message")
logger.error("Error message", exc_info=True)  # Include stack trace
```

### **Scheduler Monitoring**
```python
from app.services.scheduler import get_scheduler_status
status = get_scheduler_status()
# Returns: {"running": bool, "jobs": [{"id", "name", "next_run_time", "trigger"}]}
```

### **Testing Background Jobs**
```python
from app.services.scheduler import run_expire_points_now, run_process_subscriptions_now
run_expire_points_now()  # Execute immediately
run_process_subscriptions_now()  # Execute immediately
```

### **API Documentation**
- **Swagger UI**: `/docs` - Interactive API exploration
- **ReDoc**: `/redoc` - Alternative documentation
- **JSON Schema**: `/openapi.json`

---

## 15. DEPLOYMENT CONSIDERATIONS

### **Environment-Specific Config**
- **Development**: SQLite, DEBUG=true, test S3 bucket, Stripe test keys
- **Staging**: PostgreSQL, DEBUG=false, staging S3 bucket, Stripe test keys
- **Production**: PostgreSQL, DEBUG=false, prod S3 bucket, Stripe live keys

### **Database Backups**
- Regular PostgreSQL backups recommended
- Alembic migrations ensure schema versioning

### **Monitoring**
- Consider Sentry for error tracking (SDK included: `sentry-sdk==2.43.0`)
- CloudWatch for AWS resource monitoring
- Application-level metrics via logging

### **Scaling Strategies**
1. **Vertical Scaling**: Increase server resources
2. **Horizontal Scaling**: 
   - Load balancer in front of multiple API instances
   - Replace APScheduler with Celery + Redis for jobs
   - RDS Multi-AZ for database redundancy
3. **Caching**: Redis for session/data caching
4. **CDN**: CloudFront for S3 content delivery

---

## 16. FILE MANIFEST

| File | Purpose | Key Classes/Functions |
|------|---------|----------------------|
| `app/main.py` | App entry point | FastAPI app, CORS setup, lifespan management |
| `app/config.py` | Environment config | Settings class with all env variables |
| `app/core/database.py` | DB connection | engine, SessionLocal, Base, get_db() |
| `app/core/security.py` | Password hashing | hash_password(), verify_password() |
| `app/api/deps.py` | DI functions | get_db(), get_current_user(), require_admin(), get_optional_user() |
| `app/api/v1/router.py` | API aggregation | Includes all v1 sub-routers with prefixes |
| Service files (15 total) | Business logic | ~5,873 lines of services |
| Model files (18 total) | Data schema | SQLAlchemy ORM models with relationships |
| Schema files (15 total) | Validation | Pydantic request/response models |
| Route files (15 total) | HTTP endpoints | FastAPI route handlers |
| `app/models/enum.py` | Enums | UserRole, AuthType, Gender, etc. |
| `app/services/stripe_service.py` | Stripe integration | StripeService class with checkout/payments |
| `app/services/paypal_service.py` | PayPal integration | PayPalService class with OAuth2 flow |
| `app/services/s3_service.py` | S3 upload | S3Service for images with validation |
| `app/services/scheduler.py` | Background jobs | APScheduler setup with 2 daily jobs |
| `alembic/versions/ab46214e3156_*.py` | DB migration | Initial schema creation |
| `tests/conftest.py` | Test setup | Fixtures for db, client, users |
| `tests/test_*.py` | Unit/integration tests | Product, cart, admin tests |
| `requirements.txt` | Dependencies | 83 packages listed |

---

## CONCLUSION

This is a **production-grade FastAPI backend** for a fitness e-commerce platform with:
- ✅ Complete user authentication (AWS Cognito)
- ✅ Payment integration (Stripe + PayPal)
- ✅ Cloud storage (AWS S3)
- ✅ Database migrations (Alembic)
- ✅ Background job scheduling (APScheduler)
- ✅ Comprehensive testing framework (pytest)
- ✅ Clean architecture (service layer pattern)
- ✅ Full API documentation (Swagger/ReDoc)
- ✅ Role-based access control (Admin/User)
- ✅ Loyalty program with points and tiers

The codebase is well-organized, follows FastAPI best practices, and is ready for both development and production deployment.

---

**Last Updated**: 2025-11-17 | **Version**: 1.0.0
