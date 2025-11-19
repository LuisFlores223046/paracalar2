# CLAUDE.md - AI Assistant Guide for BeFit API

## Project Overview

**BeFit API** is a comprehensive e-commerce backend built with FastAPI for a fitness and wellness platform. The API provides features for product management, user authentication, shopping cart, orders, payments, loyalty programs, subscriptions, and fitness placement tests.

**Tech Stack:**
- **Framework:** FastAPI 0.121.0
- **Python Version:** 3.9+
- **Database:** PostgreSQL (via SQLAlchemy)
- **ORM:** SQLAlchemy 2.0.44
- **Migrations:** Alembic 1.17.1
- **Authentication:** AWS Cognito (JWT tokens)
- **Storage:** AWS S3
- **Payments:** Stripe & PayPal
- **Testing:** pytest with pytest-asyncio
- **Server:** Uvicorn (ASGI)

## Repository Structure

```
paracalar2/
├── Backend/                    # Main backend application
│   ├── alembic/               # Database migrations
│   │   └── versions/          # Migration scripts
│   ├── app/
│   │   ├── api/               # API layer
│   │   │   ├── deps.py        # FastAPI dependencies (auth, db)
│   │   │   └── v1/            # API version 1
│   │   │       ├── router.py  # Main API router
│   │   │       ├── auth/      # Authentication module
│   │   │       ├── products/  # Products module
│   │   │       ├── cart/      # Shopping cart module
│   │   │       ├── orders/    # Orders module
│   │   │       ├── payments/  # Payment processing
│   │   │       ├── admin/     # Admin operations
│   │   │       ├── analytics/ # Analytics & reports
│   │   │       ├── loyalty/   # Loyalty program
│   │   │       ├── subscriptions/ # Subscription management
│   │   │       ├── shipping/  # Shipping & tracking
│   │   │       ├── placement_test/ # Fitness placement tests
│   │   │       ├── user_profile/   # User profiles
│   │   │       ├── address/   # Address management
│   │   │       ├── payment_method/ # Payment methods
│   │   │       └── search/    # Search & filters
│   │   ├── core/              # Core functionality
│   │   │   ├── database.py    # DB connection & session
│   │   │   └── security.py    # Password hashing (bcrypt)
│   │   ├── models/            # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   ├── cart_item.py
│   │   │   ├── address.py
│   │   │   ├── payment_method.py
│   │   │   ├── subscription.py
│   │   │   ├── loyalty_tier.py
│   │   │   ├── enum.py        # Enumerations
│   │   │   └── ...
│   │   ├── services/          # External services
│   │   │   ├── s3_service.py      # AWS S3 operations
│   │   │   ├── stripe_service.py  # Stripe integration
│   │   │   ├── paypal_service.py  # PayPal integration
│   │   │   └── scheduler.py       # APScheduler tasks
│   │   ├── config.py          # Settings management (Pydantic)
│   │   └── main.py            # FastAPI app entry point
│   ├── tests/                 # Test suite
│   │   ├── conftest.py        # Pytest fixtures
│   │   ├── test_auth.py
│   │   ├── test_products.py
│   │   ├── test_cart.py
│   │   └── ...
│   ├── alembic.ini            # Alembic configuration
│   └── pytest.ini             # Pytest configuration
├── requirements.txt           # Python dependencies
├── README.md                  # Basic setup instructions
└── .gitignore                 # Git ignore rules
```

## Architecture & Design Patterns

### Layered Architecture

Each API module follows a consistent 3-layer pattern:

```
module_name/
├── __init__.py
├── routes.py      # FastAPI endpoints (HTTP layer)
├── schemas.py     # Pydantic models (validation & serialization)
└── service.py     # Business logic & external service calls
```

**Example Flow:**
1. **routes.py** - Receives HTTP request, validates with Pydantic schemas
2. **service.py** - Processes business logic, interacts with DB/external APIs
3. **schemas.py** - Defines request/response models

### Key Conventions

#### File Organization
- **routes.py**: Contains `router = APIRouter()` and endpoint definitions
- **schemas.py**: Pydantic models for request/response validation
- **service.py**: Business logic, database queries, external API calls
- **models/**: SQLAlchemy ORM models (database tables)

#### Naming Conventions
- **Endpoints**: Use descriptive REST conventions (`/api/v1/products`, `/api/v1/cart`)
- **Functions**: Snake_case (`get_current_user`, `create_order`)
- **Classes**: PascalCase (`User`, `Product`, `OrderService`)
- **Constants**: UPPER_SNAKE_CASE (`JWT_ALGORITHM`, `DATABASE_URL`)

#### Documentation Standards
All files include Spanish-language docstrings with:
- **Autor**: Developer name
- **Fecha**: Creation date
- **Descripción**: File/function purpose

```python
"""
Autor: Gabriel Vilchis
Fecha: 09/11/2025
Descripción: Este archivo define...
"""
```

## Development Workflow

### Initial Setup

```bash
# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
# On Windows:
./venv/Scripts/activate
# On Linux/Mac:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
# Create .env file in Backend/ directory with required variables (see Configuration section)
```

### Running the Application

```bash
# Navigate to Backend directory
cd Backend

# Run with auto-reload (development)
uvicorn app.main:app --reload

# Server will start at http://localhost:8000
# API docs available at http://localhost:8000/docs
# API v1 endpoints at http://localhost:8000/api/v1
```

### Database Migrations

```bash
# Navigate to Backend directory
cd Backend

# Create a new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1

# View migration history
alembic history
```

### Running Tests

```bash
# Navigate to Backend directory
cd Backend

# Run all tests
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v

# Run tests with coverage
pytest --cov=app tests/
```

## Configuration

### Environment Variables (.env)

Required environment variables in `Backend/.env`:

```bash
# Application
APP_NAME=BeFit API
APP_VERSION=1.0.0
DEBUG=False
DEV_MODE=False  # Set to true to bypass admin checks, skip S3, etc.

# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# AWS Cognito
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=your_pool_id
COGNITO_CLIENT_ID=your_client_id

# AWS S3
S3_BUCKET_NAME=your_bucket_name

# JWT
JWT_SECRET_KEY=your_jwt_secret
JWT_ALGORITHM=RS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Stripe
STRIPE_API_KEY=your_stripe_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_API_BASE_URL=https://api-m.sandbox.paypal.com  # or production URL

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
APP_URL=http://localhost:8000  # Frontend URL for redirects
```

### Settings Management

Configuration is managed through `app/config.py` using Pydantic Settings:

```python
from app.config import settings

# Access settings anywhere in the app
print(settings.DATABASE_URL)
print(settings.STRIPE_API_KEY)
```

## Authentication & Authorization

### AWS Cognito Integration

The application uses AWS Cognito for user authentication:

1. **Sign Up**: Creates user in Cognito + local DB
2. **Confirmation**: Email verification via Cognito
3. **Login**: Returns JWT access token from Cognito
4. **Token Verification**: All protected endpoints verify JWT

### FastAPI Dependencies

Located in `app/api/deps.py`:

```python
from app.api.deps import get_current_user, require_admin, get_optional_user

# Protected endpoint (requires authentication)
@router.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"user": current_user.email}

# Admin-only endpoint
@router.get("/admin")
def admin_route(current_user: User = Depends(require_admin)):
    return {"admin": current_user.email}

# Optional authentication
@router.get("/public")
def public_route(user: Optional[User] = Depends(get_optional_user)):
    if user:
        return {"logged_in": True, "user": user.email}
    return {"logged_in": False}
```

### User Roles

Defined in `app/models/enum.py`:

- `UserRole.ADMIN` - Full access to admin endpoints
- `UserRole.CUSTOMER` - Regular user access

## Database Models

### Key Models

All models inherit from `Base` defined in `app/core/database.py`:

- **User** (`models/user.py`): User accounts, linked to Cognito
- **Product** (`models/product.py`): Product catalog
- **Order** (`models/order.py`): Customer orders
- **ShoppingCart** (`models/shopping_cart.py`): Shopping carts
- **CartItem** (`models/cart_item.py`): Items in cart
- **Address** (`models/address.py`): Shipping addresses
- **PaymentMethod** (`models/payment_method.py`): Saved payment methods
- **Subscription** (`models/subscription.py`): Premium subscriptions
- **LoyaltyTier** (`models/loyalty_tier.py`): Loyalty program tiers
- **UserLoyalty** (`models/user_loyalty.py`): User loyalty status
- **Review** (`models/review.py`): Product reviews

### Database Session

```python
from app.core.database import get_db

@router.get("/example")
def example(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users
```

## API Modules

### Available Endpoints

All endpoints are prefixed with `/api/v1`:

| Module | Prefix | Description |
|--------|--------|-------------|
| Authentication | `/auth` | Sign up, login, password recovery |
| Products | `/products` | Product catalog management |
| Search | `/search` | Product search & filtering |
| Cart | `/cart` | Shopping cart operations |
| Orders | `/orders` | Order management |
| Payments | `/checkout` | Payment processing (Stripe/PayPal) |
| Admin | `/admin` | Admin operations |
| Analytics | `/analytics` | Reports & analytics |
| User Profile | `/profile` | User profile management |
| Addresses | `/addresses` | Address management |
| Payment Methods | `/payment-methods` | Saved payment methods |
| Loyalty | `/loyalty` | Loyalty program |
| Shipping | `/shipping` | Shipping & tracking |
| Placement Test | `/placement-test` | Fitness assessment |
| Subscriptions | `/subscriptions` | Subscription management |

### API Documentation

Interactive API documentation available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

## External Services

### AWS S3 (`services/s3_service.py`)

Used for file uploads (images, documents):

```python
from app.services.s3_service import S3Service

s3 = S3Service()
url = s3.upload_file(file, "path/to/file.jpg")
```

### Stripe (`services/stripe_service.py`)

Payment processing integration:
- Create payment intents
- Manage subscriptions
- Handle webhooks

### PayPal (`services/paypal_service.py`)

Alternative payment method:
- Create orders
- Capture payments

### Scheduler (`services/scheduler.py`)

APScheduler for background tasks:
- Subscription renewals
- Order status updates
- Cleanup tasks

## Testing

### Test Structure

Located in `Backend/tests/`:

- **conftest.py**: Shared fixtures (test DB, test client, mock users)
- **test_*.py**: Module-specific tests

### Test Configuration (`pytest.ini`)

```ini
asyncio_mode = auto
testpaths = tests

markers =
    asyncio: async/await tests
    unit: unit tests
    integration: integration tests
    functional: end-to-end tests
```

### Writing Tests

```python
import pytest
from fastapi.testclient import TestClient

def test_login(client: TestClient):
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
```

## Git Workflow

### Branch Strategy

- **Main branch**: Production-ready code
- **Feature branches**: Start with `claude/` prefix for Claude Code sessions
- Branch naming: `claude/feature-description-sessionid`

### Commit Messages

Use clear, descriptive commit messages in English or Spanish:

```bash
# Good examples
git commit -m "Add user profile endpoints"
git commit -m "Fix authentication token validation"
git commit -m "Implementar endpoints de suscripciones"
```

### Pushing Changes

```bash
# Always push to the designated feature branch
git push -u origin claude/your-branch-name
```

## Development Best Practices

### When Adding New Features

1. **Create a new module** in `app/api/v1/feature_name/`
   - `__init__.py`
   - `routes.py` (endpoints)
   - `schemas.py` (Pydantic models)
   - `service.py` (business logic)

2. **Register the router** in `app/api/v1/router.py`:
   ```python
   from app.api.v1.feature_name.routes import router as feature_router

   api_router.include_router(
       feature_router,
       prefix="/feature-name",
       tags=["Feature Name"]
   )
   ```

3. **Create database model** in `app/models/feature_name.py` if needed

4. **Generate migration**:
   ```bash
   alembic revision --autogenerate -m "Add feature_name table"
   alembic upgrade head
   ```

5. **Write tests** in `tests/test_feature_name.py`

6. **Update documentation** if public-facing API changes

### Security Considerations

- **Never commit `.env` files** (already in .gitignore)
- **Use `DEV_MODE=true`** only in local development
- **Hash passwords** using bcrypt (see `core/security.py`)
- **Validate all inputs** with Pydantic schemas
- **Use prepared statements** (SQLAlchemy ORM handles this)
- **Sanitize file uploads** before sending to S3
- **Verify JWT tokens** on all protected endpoints

### Error Handling

Use FastAPI's `HTTPException` for consistent error responses:

```python
from fastapi import HTTPException, status

if not user:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Usuario no encontrado"
    )
```

### Logging

Use Python's logging module (configured in `main.py`):

```python
import logging

logger = logging.getLogger(__name__)
logger.info("Operation completed successfully")
logger.error(f"Error processing request: {error}")
```

## Common Tasks for AI Assistants

### Adding a New Endpoint

1. Identify the appropriate module in `app/api/v1/`
2. Add endpoint to `routes.py`
3. Define request/response schemas in `schemas.py`
4. Implement business logic in `service.py`
5. Add tests in `tests/`

### Modifying Database Schema

1. Update the model in `app/models/`
2. Generate migration: `alembic revision --autogenerate -m "description"`
3. Review the generated migration in `alembic/versions/`
4. Apply migration: `alembic upgrade head`
5. Update affected endpoints and tests

### Debugging Issues

1. Check logs in console (configured with logging.basicConfig)
2. Verify `.env` configuration
3. Test endpoints via Swagger UI at `/docs`
4. Run tests: `pytest tests/test_module.py -v`
5. Check database state with Alembic: `alembic current`

### Adding External Service Integration

1. Create service class in `app/services/service_name.py`
2. Add configuration to `app/config.py` (Settings class)
3. Add credentials to `.env`
4. Import and use in relevant service/route files
5. Add error handling and logging

## Troubleshooting

### Common Issues

**Database connection errors:**
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Check database credentials

**Import errors:**
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

**Authentication failures:**
- Verify Cognito configuration
- Check token expiration
- Ensure user exists in both Cognito and local DB

**S3 upload failures:**
- Verify AWS credentials
- Check S3 bucket permissions
- In development, set `DEV_MODE=true` to bypass S3

**Migration conflicts:**
- Check `alembic history`
- Resolve conflicts manually in migration files
- Use `alembic downgrade` to rollback if needed

## Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **SQLAlchemy Documentation**: https://docs.sqlalchemy.org/
- **Alembic Documentation**: https://alembic.sqlalchemy.org/
- **Pydantic Documentation**: https://docs.pydantic.dev/
- **AWS Cognito**: https://docs.aws.amazon.com/cognito/
- **Stripe API**: https://stripe.com/docs/api
- **PayPal API**: https://developer.paypal.com/docs/api/

## Project Health Checklist

Before making changes, verify:
- [ ] Virtual environment is activated
- [ ] All dependencies are installed
- [ ] `.env` file is configured
- [ ] Database is running and migrations are up to date
- [ ] Tests pass: `pytest`
- [ ] Code follows existing patterns and conventions
- [ ] Authentication is properly implemented on protected routes
- [ ] Error handling is consistent
- [ ] Logging is added for important operations

## Contact & Context

This is a university project (T1-MFDS 2025) for building a comprehensive e-commerce backend. The codebase emphasizes:

- Clean architecture with separation of concerns
- RESTful API design
- Comprehensive testing
- Security best practices
- Scalable integration with cloud services (AWS, Stripe, PayPal)

When contributing, maintain consistency with existing code style, documentation practices, and architectural patterns.
