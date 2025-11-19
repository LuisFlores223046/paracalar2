# CLAUDE.md - BeFit E-Commerce Platform

## Project Overview

**Project Name:** BeFit API (T1-MFDS 2025)
**Type:** E-commerce Fitness & Nutrition Platform
**Framework:** FastAPI (Python)
**Database:** PostgreSQL with SQLAlchemy ORM
**Server:** Uvicorn ASGI Server
**Primary Language:** Python 3.x

This is a comprehensive e-commerce backend for a fitness and nutrition platform that includes user authentication, product catalog management, shopping cart, order processing, payment integration (Stripe & PayPal), loyalty/rewards system, subscriptions, and admin dashboard functionality.

---

## Table of Contents

1. [Repository Structure](#repository-structure)
2. [Development Setup](#development-setup)
3. [Architecture Patterns](#architecture-patterns)
4. [Code Organization](#code-organization)
5. [Database Models](#database-models)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Authorization](#authentication--authorization)
8. [Configuration Management](#configuration-management)
9. [Testing Guidelines](#testing-guidelines)
10. [Common Tasks](#common-tasks)
11. [Code Conventions](#code-conventions)
12. [Security Considerations](#security-considerations)
13. [External Services](#external-services)
14. [Troubleshooting](#troubleshooting)

---

## Repository Structure

```
/
├── Backend/                          # Main application directory
│   ├── alembic/                      # Database migrations
│   │   ├── env.py                    # Migration environment config
│   │   └── versions/                 # Migration version files
│   │
│   ├── app/                          # Core application package
│   │   ├── main.py                   # Application entry point
│   │   ├── config.py                 # Configuration management
│   │   │
│   │   ├── core/                     # Core infrastructure
│   │   │   ├── database.py           # SQLAlchemy setup
│   │   │   └── security.py           # Password hashing utilities
│   │   │
│   │   ├── models/                   # SQLAlchemy ORM models (19 files)
│   │   │   ├── user.py               # User model
│   │   │   ├── product.py            # Product catalog
│   │   │   ├── order.py              # Order management
│   │   │   ├── shopping_cart.py      # Shopping cart
│   │   │   ├── subscription.py       # Subscription model
│   │   │   ├── address.py            # Delivery addresses
│   │   │   ├── payment_method.py     # Payment methods
│   │   │   ├── loyalty_tier.py       # Loyalty tiers
│   │   │   ├── user_loyalty.py       # User loyalty tracking
│   │   │   ├── point_history.py      # Points history
│   │   │   ├── coupon.py             # Discount coupons
│   │   │   ├── user_coupon.py        # User-coupon assignments
│   │   │   ├── cart_item.py          # Cart items
│   │   │   ├── order_item.py         # Order items
│   │   │   ├── review.py             # Product reviews
│   │   │   ├── fitness_profile.py    # User fitness profile
│   │   │   ├── product_image.py      # Product images
│   │   │   └── enum.py               # Enum definitions
│   │   │
│   │   ├── services/                 # External service integrations
│   │   │   ├── stripe_service.py     # Stripe payment processing
│   │   │   ├── paypal_service.py     # PayPal integration
│   │   │   ├── s3_service.py         # AWS S3 file uploads
│   │   │   └── scheduler.py          # APScheduler job scheduling
│   │   │
│   │   └── api/                      # API routes & logic
│   │       ├── deps.py               # Dependency injection functions
│   │       └── v1/                   # API version 1
│   │           ├── router.py         # Main router (aggregates all routes)
│   │           ├── auth/             # Authentication
│   │           ├── products/         # Product catalog
│   │           ├── cart/             # Shopping cart
│   │           ├── orders/           # Order management
│   │           ├── payments/         # Payment processing
│   │           ├── admin/            # Admin operations
│   │           ├── payment_method/   # Payment method management
│   │           ├── address/          # Address management
│   │           ├── user_profile/     # User profile
│   │           ├── shipping/         # Shipping & tracking
│   │           ├── loyalty/          # Loyalty program
│   │           ├── subscriptions/    # Subscription management
│   │           ├── search/           # Product search
│   │           ├── analytics/        # Analytics & reports
│   │           └── placement_test/   # Fitness assessment
│   │
│   ├── tests/                        # Test suite (14 test files)
│   │   ├── conftest.py               # Pytest fixtures
│   │   ├── test_auth.py
│   │   ├── test_products.py
│   │   ├── test_cart.py
│   │   ├── test_orders.py
│   │   ├── test_payments.py
│   │   └── ...
│   │
│   ├── alembic.ini                   # Alembic configuration
│   └── pytest.ini                    # Pytest configuration
│
├── requirements.txt                  # Python dependencies
├── README.md                         # Project documentation
├── .gitignore                        # Git ignore rules
└── CLAUDE.md                         # This file
```

---

## Development Setup

### Prerequisites

- Python 3.8+
- PostgreSQL database
- AWS Account (for Cognito, S3)
- Stripe Account (for payments)
- PayPal Developer Account (optional)

### Initial Setup

1. **Create Virtual Environment:**
   ```bash
   python -m venv venv
   ```

2. **Activate Virtual Environment:**
   ```bash
   # Windows
   ./venv/Scripts/activate

   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Application
   APP_NAME=BeFit API
   APP_VERSION=1.0.0
   DEBUG=false
   DEV_MODE=false

   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/befit_db

   # AWS
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key

   # AWS Cognito
   COGNITO_REGION=us-east-1
   COGNITO_USER_POOL_ID=your_pool_id
   COGNITO_CLIENT_ID=your_client_id

   # AWS S3
   S3_BUCKET_NAME=your-bucket-name

   # JWT
   JWT_SECRET_KEY=your_jwt_secret
   JWT_ALGORITHM=RS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

   # Stripe
   STRIPE_API_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # PayPal
   PAYPAL_CLIENT_ID=your_client_id
   PAYPAL_CLIENT_SECRET=your_secret
   PAYPAL_API_BASE_URL=https://api.sandbox.paypal.com

   # CORS
   BACKEND_CORS_ORIGINS=["http://localhost:3000"]
   APP_URL=http://localhost:3000
   ```

5. **Run Database Migrations:**
   ```bash
   cd Backend
   alembic upgrade head
   ```

6. **Start Development Server:**
   ```bash
   cd Backend
   uvicorn app.main:app --reload
   ```

7. **Access API Documentation:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc
   - OpenAPI JSON: http://localhost:8000/openapi.json

### Development Mode

Set `DEV_MODE=true` in `.env` to bypass:
- AWS S3 uploads (uses local paths)
- Admin permission checks (allows all users as admin with warning)
- Certain AWS service requirements

**IMPORTANT:** Never use DEV_MODE in production!

---

## Architecture Patterns

### 1. **MVC Pattern**

- **Models:** SQLAlchemy ORM models in `/Backend/app/models/`
- **Views:** FastAPI routes in `/Backend/app/api/v1/*/routes.py`
- **Controllers:** Service layer in `/Backend/app/api/v1/*/service.py`

### 2. **Service Layer Pattern**

All business logic is centralized in service classes:

```python
# Backend/app/api/v1/products/service.py
class ProductService:
    @staticmethod
    def get_product_by_id(db: Session, product_id: int) -> Product:
        """Fetch product by ID with eager loading"""
        product = db.query(Product).options(
            joinedload(Product.product_images),
            joinedload(Product.reviews)
        ).filter(Product.product_id == product_id).first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
```

### 3. **Dependency Injection**

FastAPI's `Depends()` mechanism for automatic resolution:

```python
# Backend/app/api/v1/products/routes.py
@router.get("/{product_id}")
def get_product(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return ProductService.get_product_by_id(db, product_id)
```

### 4. **Schema Validation**

Pydantic models for request/response validation:

```python
# Backend/app/api/v1/auth/schemas.py
class SignUpRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str = Field(..., min_length=2, max_length=50)

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        # Custom validation logic
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain uppercase letter')
        return v
```

### 5. **Repository Pattern**

Database session management via dependency injection:

```python
# Backend/app/core/database.py
def get_db():
    """Dependency for database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## Code Organization

### Module Structure

Every API module follows this consistent structure:

```
module_name/
├── __init__.py          # Package initialization
├── routes.py            # FastAPI endpoints
├── schemas.py           # Pydantic request/response models
└── service.py           # Business logic & database operations
```

### File Naming Conventions

- **Models:** Singular noun, snake_case (e.g., `user.py`, `product.py`)
- **Routes:** `routes.py` (standard)
- **Schemas:** `schemas.py` (standard)
- **Services:** `service.py` (standard)
- **Tests:** `test_<module>.py` (e.g., `test_auth.py`)

### Import Organization

```python
# Standard library imports
import os
from typing import List, Optional
from datetime import datetime

# Third-party imports
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

# Local application imports
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from .schemas import ProductResponse
from .service import ProductService
```

---

## Database Models

### Key Models Overview

| Model | File | Primary Key | Purpose |
|-------|------|-------------|---------|
| User | `user.py` | `user_id` | User accounts |
| FitnessProfile | `fitness_profile.py` | `profile_id` | User fitness data |
| Product | `product.py` | `product_id` | Product catalog |
| ProductImage | `product_image.py` | `image_id` | Product images |
| Review | `review.py` | `review_id` | Product reviews |
| ShoppingCart | `shopping_cart.py` | `cart_id` | Shopping carts |
| CartItem | `cart_item.py` | `cart_item_id` | Cart items |
| Order | `order.py` | `order_id` | Orders |
| OrderItem | `order_item.py` | `order_item_id` | Order items |
| PaymentMethod | `payment_method.py` | `payment_id` | Payment methods |
| Address | `address.py` | `address_id` | Delivery addresses |
| Subscription | `subscription.py` | `subscription_id` | Subscriptions |
| UserLoyalty | `user_loyalty.py` | `loyalty_id` | User loyalty points |
| LoyaltyTier | `loyalty_tier.py` | `tier_id` | Loyalty tiers |
| PointHistory | `point_history.py` | `history_id` | Points transactions |
| Coupon | `coupon.py` | `coupon_id` | Discount coupons |
| UserCoupon | `user_coupon.py` | Composite | User coupon usage |

### Common Model Patterns

#### Timestamps

```python
created_at = Column(DateTime(timezone=True), server_default=func.now())
updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

#### Relationships

```python
# One-to-Many
user = relationship("User", back_populates="orders")
orders = relationship("Order", back_populates="user")

# Many-to-Many (via association table)
user_coupons = relationship("UserCoupon", back_populates="user")
```

#### Eager Loading

Always use `joinedload()` for relationships to avoid N+1 queries:

```python
product = db.query(Product).options(
    joinedload(Product.product_images),
    joinedload(Product.reviews)
).filter(Product.product_id == product_id).first()
```

### Enums

Defined in `Backend/app/models/enum.py`:

```python
class UserRole(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"

class OrderStatus(str, Enum):
    PENDING = "PENDING"
    PAID = "PAID"
    SHIPPED = "SHIPPED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"
```

---

## API Endpoints

### Endpoint Organization

All API v1 endpoints are prefixed with `/api/v1` and organized by module:

| Module | Prefix | Purpose |
|--------|--------|---------|
| auth | `/api/v1/auth` | Registration, login, password recovery |
| products | `/api/v1/products` | Product catalog browsing |
| cart | `/api/v1/cart` | Shopping cart management |
| orders | `/api/v1/orders` | Order placement & tracking |
| payments | `/api/v1/checkout` | Payment processing |
| admin | `/api/v1/admin` | Admin operations |
| payment_method | `/api/v1/payment-methods` | Payment method CRUD |
| address | `/api/v1/addresses` | Address management |
| user_profile | `/api/v1/profile` | User profile updates |
| loyalty | `/api/v1/loyalty` | Points & rewards |
| subscriptions | `/api/v1/subscriptions` | Subscription management |
| shipping | `/api/v1/shipping` | Shipping info |
| search | `/api/v1/search` | Product search |
| analytics | `/api/v1/analytics` | Reports & insights |
| placement_test | `/api/v1/placement-test` | Fitness assessment |

### Route Declaration Pattern

```python
# Backend/app/api/v1/products/routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from .schemas import ProductResponse
from .service import ProductService

router = APIRouter()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get product by ID"""
    return ProductService.get_product_by_id(db, product_id)
```

### Response Models

Always specify `response_model` for type safety and documentation:

```python
@router.get("/products", response_model=List[ProductResponse])
def list_products(...):
    pass
```

---

## Authentication & Authorization

### Authentication Flow

1. **User Registration:**
   - POST `/api/v1/auth/signup`
   - Creates user in AWS Cognito
   - Stores user metadata in local database
   - Returns user info (no auto-login)

2. **User Login:**
   - POST `/api/v1/auth/login`
   - Authenticates with AWS Cognito
   - Returns JWT access token
   - Token expires after `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`

3. **Token Verification:**
   - Bearer token in `Authorization` header
   - Verified against AWS Cognito JWKS
   - User fetched from database via `cognito_sub`

### Dependency Injection Chain

```python
# Backend/app/api/deps.py

# 1. Extract token from header
get_token_from_header(credentials: HTTPAuthorizationCredentials)
    ↓
# 2. Verify token and get user
get_current_user(token: str, db: Session) → User
    ↓
# 3. Ensure admin role
require_admin(current_user: User) → User
```

### Usage in Routes

```python
# Public endpoint (no auth)
@router.get("/products/public")
def public_products():
    pass

# Authenticated endpoint
@router.get("/cart")
def get_cart(current_user: User = Depends(get_current_user)):
    pass

# Admin-only endpoint
@router.post("/admin/products")
def create_product(current_user: User = Depends(require_admin)):
    pass

# Optional authentication
@router.get("/products")
def list_products(current_user: Optional[User] = Depends(get_optional_user)):
    # current_user is None if not authenticated
    pass
```

### Role-Based Access Control

Two roles defined in `UserRole` enum:
- `ADMIN`: Full access to all endpoints
- `USER`: Standard user access

Admin checks:
```python
if current_user.role != UserRole.ADMIN:
    raise HTTPException(status_code=403, detail="Admin access required")
```

### Account Status

User accounts can be active or inactive:
```python
if current_user.account_status != "active":
    raise HTTPException(status_code=403, detail="Account is not active")
```

---

## Configuration Management

### Configuration File

`Backend/app/config.py` uses Pydantic Settings for environment-based configuration:

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "BeFit API"
    DATABASE_URL: str
    COGNITO_USER_POOL_ID: str
    # ... more settings

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### Accessing Configuration

```python
from app.config import settings

# Use settings throughout the application
database_url = settings.DATABASE_URL
stripe_key = settings.STRIPE_SECRET_KEY
```

### Environment Variables

All sensitive data should be in `.env` file (never commit to git):

```env
DATABASE_URL=postgresql://...
AWS_ACCESS_KEY_ID=...
STRIPE_SECRET_KEY=...
```

### Debug Mode

```python
if settings.DEBUG:
    settings.print_debug_info()  # Prints all config (excluding secrets)
```

---

## Testing Guidelines

### Test Structure

Tests are located in `Backend/tests/` and organized by module:

```
tests/
├── conftest.py              # Shared fixtures
├── test_auth.py             # Authentication tests
├── test_products.py         # Product tests
├── test_cart.py             # Cart tests
└── ...
```

### Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v

# Run with coverage
pytest --cov=app tests/
```

### Test Fixtures

Common fixtures defined in `conftest.py`:

```python
# Database fixtures
@pytest.fixture
def db():
    """Database session for testing"""
    # Uses in-memory SQLite

# HTTP client fixtures
@pytest.fixture
def client():
    """Unauthenticated test client"""

@pytest.fixture
def user_client():
    """Authenticated as regular user"""

@pytest.fixture
def admin_client():
    """Authenticated as admin"""

# Data fixtures
@pytest.fixture
def test_user(db):
    """Sample user"""

@pytest.fixture
def test_product(db):
    """Sample product"""
```

### Writing Tests

#### Unit Tests (with mocks)

```python
from unittest.mock import patch, MagicMock

class TestProductService:
    @patch('app.services.s3_service.S3Service.upload_file')
    def test_create_product(self, mock_s3_upload, db):
        # Arrange
        mock_s3_upload.return_value = "https://s3.../image.jpg"

        # Act
        product = ProductService.create_product(db, product_data)

        # Assert
        assert product.name == "Test Product"
        mock_s3_upload.assert_called_once()
```

#### Integration Tests (with fixtures)

```python
def test_get_product(client, test_product):
    # Act
    response = client.get(f"/api/v1/products/{test_product.product_id}")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == test_product.name
```

#### Testing Authentication

```python
def test_protected_endpoint(client, test_user):
    # Without auth
    response = client.get("/api/v1/cart")
    assert response.status_code == 401

    # With auth
    token = generate_test_token(test_user)
    response = client.get(
        "/api/v1/cart",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
```

### Test Markers

```python
@pytest.mark.asyncio
async def test_async_function():
    pass

@pytest.mark.unit
def test_unit():
    pass

@pytest.mark.integration
def test_integration():
    pass
```

---

## Common Tasks

### Adding a New API Module

1. **Create module directory:**
   ```bash
   mkdir Backend/app/api/v1/new_module
   cd Backend/app/api/v1/new_module
   touch __init__.py routes.py schemas.py service.py
   ```

2. **Define schemas** in `schemas.py`:
   ```python
   from pydantic import BaseModel

   class CreateRequest(BaseModel):
       name: str

   class Response(BaseModel):
       id: int
       name: str

       class Config:
           from_attributes = True
   ```

3. **Implement service** in `service.py`:
   ```python
   from sqlalchemy.orm import Session
   from app.models.your_model import YourModel

   class YourService:
       @staticmethod
       def create(db: Session, data: CreateRequest):
           # Business logic
           pass
   ```

4. **Create routes** in `routes.py`:
   ```python
   from fastapi import APIRouter, Depends
   from sqlalchemy.orm import Session
   from app.core.database import get_db
   from .schemas import CreateRequest, Response
   from .service import YourService

   router = APIRouter()

   @router.post("/", response_model=Response)
   def create(data: CreateRequest, db: Session = Depends(get_db)):
       return YourService.create(db, data)
   ```

5. **Register in main router** (`Backend/app/api/v1/router.py`):
   ```python
   from app.api.v1.new_module.routes import router as new_module_router

   api_router.include_router(
       new_module_router,
       prefix="/new-module",
       tags=["new_module"]
   )
   ```

### Adding a New Database Model

1. **Create model file** in `Backend/app/models/`:
   ```python
   from sqlalchemy import Column, Integer, String, ForeignKey
   from sqlalchemy.orm import relationship
   from app.core.database import Base

   class YourModel(Base):
       __tablename__ = "your_table"

       id = Column(Integer, primary_key=True, index=True)
       name = Column(String, nullable=False)
       user_id = Column(Integer, ForeignKey("users.user_id"))

       user = relationship("User", back_populates="your_items")
   ```

2. **Create migration:**
   ```bash
   cd Backend
   alembic revision --autogenerate -m "Add your_table"
   ```

3. **Review and apply migration:**
   ```bash
   # Review the generated migration file
   # Then apply it
   alembic upgrade head
   ```

### Handling File Uploads

For endpoints that accept file uploads:

```python
from fastapi import File, UploadFile, Form
from app.services.s3_service import S3Service

@router.post("/upload")
async def upload_file(
    name: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Upload to S3
    file_url = S3Service.upload_file(file, folder="uploads")

    # Save to database
    # ...

    return {"file_url": file_url}
```

### Working with Payments

#### Stripe Payment Flow

```python
from app.services.stripe_service import StripeService

# Create payment intent
payment_intent = StripeService.create_payment(
    amount=total_amount,
    customer_id=user.stripe_customer_id
)

# Confirm payment
result = StripeService.confirm_payment(payment_intent.id)
```

#### PayPal Payment Flow

```python
from app.services.paypal_service import PayPalService

# Create order
order = PayPalService.create_order(amount=total_amount)

# Capture payment
result = PayPalService.capture_payment(order_id)
```

### Scheduling Background Jobs

```python
from app.services.scheduler import scheduler

# Add a job
def my_job():
    # Job logic
    pass

# Schedule to run daily at 2 AM
scheduler.add_job(
    my_job,
    'cron',
    hour=2,
    minute=0,
    id='my_daily_job'
)
```

---

## Code Conventions

### Naming Conventions

- **Classes:** PascalCase (e.g., `ProductService`, `UserModel`)
- **Functions/Methods:** snake_case (e.g., `get_product`, `create_order`)
- **Variables:** snake_case (e.g., `user_id`, `total_amount`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_ITEMS`, `DEFAULT_PAGE_SIZE`)
- **Private methods:** Prefix with underscore (e.g., `_validate_data`)

### Function Documentation

Use docstrings for all public functions:

```python
def get_product_by_id(db: Session, product_id: int) -> Product:
    """
    Retrieve a product by its ID.

    Args:
        db: Database session
        product_id: Product ID to retrieve

    Returns:
        Product object

    Raises:
        HTTPException: If product not found (404)
    """
    pass
```

### Error Handling

Always use HTTPException for API errors:

```python
from fastapi import HTTPException, status

# Not found
raise HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Product not found"
)

# Unauthorized
raise HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid credentials"
)

# Forbidden
raise HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Admin access required"
)

# Bad request
raise HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Invalid input data"
)
```

### Type Hints

Always use type hints:

```python
from typing import List, Optional, Dict, Any

def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[Product]:
    pass
```

### Logging

Use Python's logging module:

```python
import logging

logger = logging.getLogger(__name__)

logger.info("Processing order %s", order_id)
logger.warning("Low stock for product %s", product_id)
logger.error("Failed to process payment: %s", error)
```

---

## Security Considerations

### 1. **Never Commit Secrets**

- Keep `.env` file in `.gitignore`
- Never hardcode API keys, passwords, or tokens
- Use environment variables for all sensitive data

### 2. **Password Security**

- Passwords are hashed using bcrypt
- Never store plain-text passwords
- Use `app.core.security.get_password_hash()` and `verify_password()`

### 3. **JWT Token Security**

- Tokens expire after configured time
- Use RS256 algorithm (asymmetric)
- Verify tokens against AWS Cognito JWKS
- Always validate token signature and expiration

### 4. **Input Validation**

- Use Pydantic models for all request validation
- Validate all user input
- Use field validators for complex validation

### 5. **SQL Injection Prevention**

- Always use SQLAlchemy ORM (parameterized queries)
- Never construct raw SQL with user input
- Use `filter()` with bound parameters

### 6. **CORS Configuration**

- Configure allowed origins in `BACKEND_CORS_ORIGINS`
- Never use `origins=["*"]` in production
- Specify exact domains

### 7. **File Upload Security**

- Validate file types
- Limit file sizes
- Scan for malware (if applicable)
- Use unique file names (avoid overwrites)

### 8. **Rate Limiting**

Consider implementing rate limiting for:
- Login endpoints
- Payment processing
- Public APIs

### 9. **Database Security**

- Use least-privilege database user
- Enable SSL for database connections
- Regular backups
- Use connection pooling

---

## External Services

### AWS Cognito (Authentication)

**Configuration:**
- `COGNITO_REGION`
- `COGNITO_USER_POOL_ID`
- `COGNITO_CLIENT_ID`

**Usage:**
```python
from app.api.v1.auth.service import CognitoService

cognito = CognitoService()
result = cognito.sign_up(user_data)
```

### AWS S3 (File Storage)

**Configuration:**
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME`

**Usage:**
```python
from app.services.s3_service import S3Service

file_url = S3Service.upload_file(file, folder="products")
```

### Stripe (Payments)

**Configuration:**
- `STRIPE_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

**Usage:**
```python
from app.services.stripe_service import StripeService

payment = StripeService.create_payment(amount, customer_id)
```

### PayPal (Alternative Payments)

**Configuration:**
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_API_BASE_URL`

**Usage:**
```python
from app.services.paypal_service import PayPalService

order = PayPalService.create_order(amount)
```

---

## Troubleshooting

### Common Issues

#### 1. **Database Connection Errors**

```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Solution:**
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check database credentials

#### 2. **Migration Errors**

```
alembic.util.exc.CommandError: Can't locate revision identified by 'xyz'
```

**Solution:**
- Check migration history: `alembic history`
- Reset migrations if needed
- Ensure database is in sync

#### 3. **AWS Cognito Errors**

```
botocore.exceptions.ClientError: An error occurred (UserNotFoundException)
```

**Solution:**
- Verify Cognito pool ID and region
- Check user exists in Cognito
- Verify AWS credentials

#### 4. **Import Errors**

```
ModuleNotFoundError: No module named 'app'
```

**Solution:**
- Ensure you're in the `Backend` directory
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

#### 5. **CORS Errors**

```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solution:**
- Add frontend URL to `BACKEND_CORS_ORIGINS`
- Ensure CORS middleware is configured in `main.py`

#### 6. **Test Failures**

**Solution:**
- Clear test database: `pytest --create-db`
- Check fixtures in `conftest.py`
- Ensure all dependencies are installed

### Debugging Tips

1. **Enable Debug Mode:**
   ```env
   DEBUG=true
   ```

2. **Use FastAPI's Interactive Docs:**
   - Visit http://localhost:8000/docs
   - Test endpoints interactively

3. **Check Server Logs:**
   - Uvicorn outputs detailed error traces
   - Look for stack traces and error messages

4. **Use DEV_MODE for Testing:**
   ```env
   DEV_MODE=true
   ```
   - Bypasses AWS services
   - Allows admin access for all users

5. **Database Queries:**
   ```python
   # Enable SQL echo in database.py
   engine = create_engine(DATABASE_URL, echo=True)
   ```

---

## AI Assistant Guidelines

### When Adding New Features

1. **Understand the module structure** - Follow the consistent pattern of routes, schemas, and services
2. **Check for similar implementations** - Look at existing modules for patterns
3. **Use dependency injection** - Leverage `get_db`, `get_current_user`, etc.
4. **Write tests** - Add corresponding test file in `tests/`
5. **Update documentation** - Add endpoint to API documentation
6. **Follow naming conventions** - Be consistent with existing code

### When Fixing Bugs

1. **Locate the issue** - Identify which module/service is affected
2. **Check dependencies** - Look at related models and services
3. **Write a failing test** - Reproduce the bug in a test
4. **Fix the code** - Implement the solution
5. **Verify the fix** - Ensure test passes
6. **Check side effects** - Run full test suite

### When Refactoring

1. **Maintain consistency** - Keep the same patterns across modules
2. **Update all affected files** - Routes, schemas, services, tests
3. **Run tests** - Ensure nothing breaks
4. **Update documentation** - Keep CLAUDE.md and API docs in sync

### Best Practices for AI Assistants

1. **Always read relevant files first** - Don't assume structure
2. **Follow existing patterns** - Don't introduce new patterns without discussion
3. **Use type hints** - Maintain type safety throughout
4. **Write descriptive commit messages** - Explain what and why
5. **Test before committing** - Run test suite
6. **Ask for clarification** - When requirements are unclear
7. **Consider security** - Always validate input, check permissions
8. **Think about performance** - Use eager loading, avoid N+1 queries
9. **Handle errors gracefully** - Provide meaningful error messages
10. **Document complex logic** - Add comments and docstrings

---

## Quick Reference

### Start Server
```bash
cd Backend
uvicorn app.main:app --reload
```

### Run Tests
```bash
pytest
pytest tests/test_auth.py -v
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Activate Virtual Environment
```bash
# Windows
./venv/Scripts/activate

# Linux/Mac
source venv/bin/activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Additional Resources

- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **SQLAlchemy Documentation:** https://docs.sqlalchemy.org/
- **Pydantic Documentation:** https://docs.pydantic.dev/
- **Alembic Documentation:** https://alembic.sqlalchemy.org/
- **AWS Cognito Documentation:** https://docs.aws.amazon.com/cognito/
- **Stripe API Documentation:** https://stripe.com/docs/api

---

**Last Updated:** 2025-11-19
**Version:** 1.0.0
