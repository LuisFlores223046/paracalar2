# 🏗️ Arquitectura del Backend BeFit

**Proyecto**: T1-MFDS 2025 Backend (BeFit - Fitness E-Commerce Platform)
**Framework**: FastAPI
**Fecha**: 2025-11-19
**Versión**: 1.0.0

---

## 📑 Tabla de Contenidos

1. [Visión General](#-visión-general)
2. [Arquitectura en Capas](#-arquitectura-en-capas)
3. [Arquitectura de Componentes](#-arquitectura-de-componentes)
4. [Módulos de la API](#-módulos-de-la-api)
5. [Flujos de Procesos Principales](#-flujos-de-procesos-principales)
6. [Modelo de Base de Datos](#-modelo-de-base-de-datos)
7. [Integraciones Externas](#-integraciones-externas)
8. [Patrones y Principios](#-patrones-y-principios)

---

## 🎯 Visión General

BeFit Backend es una aplicación FastAPI que implementa una plataforma de e-commerce especializada en fitness y nutrición. La arquitectura sigue principios de **Clean Architecture** y **SOLID**, con clara separación de responsabilidades en capas.

### Características Principales

- ✅ Autenticación con AWS Cognito
- ✅ Procesamiento de pagos (Stripe & PayPal)
- ✅ Almacenamiento en S3 (AWS)
- ✅ Sistema de suscripciones automáticas
- ✅ Programa de lealtad y puntos
- ✅ Gestión completa de órdenes y envíos
- ✅ Analytics y reportes para administradores
- ✅ Migraciones de base de datos con Alembic

---

## 📚 Arquitectura en Capas

La aplicación está organizada en una arquitectura de **4 capas principales**:

```mermaid
graph TB
    subgraph "Capa de Presentación"
        API[FastAPI Endpoints]
        MW[Middleware CORS]
        DOCS[Swagger/ReDoc]
    end

    subgraph "Capa de Aplicación"
        ROUTES[Routes]
        SCHEMAS[Pydantic Schemas]
        DEPS[Dependencies]
    end

    subgraph "Capa de Dominio/Negocio"
        SERVICES[Services]
        AUTH[Auth Service]
        PAYMENT[Payment Services]
        LOYALTY[Loyalty Service]
        SCHEDULER[Background Scheduler]
    end

    subgraph "Capa de Infraestructura"
        MODELS[SQLAlchemy Models]
        DB[(PostgreSQL)]
        COGNITO[AWS Cognito]
        S3[AWS S3]
        STRIPE[Stripe API]
        PAYPAL[PayPal API]
    end

    API --> ROUTES
    ROUTES --> SCHEMAS
    ROUTES --> DEPS
    DEPS --> SERVICES
    SERVICES --> MODELS
    MODELS --> DB
    SERVICES --> COGNITO
    SERVICES --> S3
    SERVICES --> STRIPE
    SERVICES --> PAYPAL

    style API fill:#4A90E2
    style SERVICES fill:#50C878
    style DB fill:#F39C12
```

### Descripción de Capas

#### 1️⃣ **Capa de Presentación** (`app/main.py`, `/api`)
- **Responsabilidad**: Exponer endpoints HTTP y manejar requests/responses
- **Componentes**:
  - FastAPI application instance
  - CORS Middleware
  - Health check endpoints
  - Documentación automática (Swagger/ReDoc)

#### 2️⃣ **Capa de Aplicación** (`app/api/v1/*/routes.py`)
- **Responsabilidad**: Orquestar flujos de negocio y validación de datos
- **Componentes**:
  - Route handlers (controllers)
  - Pydantic schemas (validación)
  - Dependency injection (auth, db session)

#### 3️⃣ **Capa de Dominio/Negocio** (`app/api/v1/*/service.py`, `app/services/`)
- **Responsabilidad**: Lógica de negocio y reglas de dominio
- **Componentes**:
  - Services (business logic)
  - Integration services (Stripe, PayPal, S3, Cognito)
  - Background job scheduler
  - Business rules y calculations

#### 4️⃣ **Capa de Infraestructura** (`app/models/`, `app/core/`)
- **Responsabilidad**: Persistencia y acceso a servicios externos
- **Componentes**:
  - SQLAlchemy ORM models
  - Database engine y sessions
  - External API clients
  - File storage

---

## 🧩 Arquitectura de Componentes

```mermaid
graph LR
    subgraph "Cliente"
        WEB[Web App]
        MOBILE[Mobile App]
    end

    subgraph "FastAPI Application"
        MAIN[main.py]
        ROUTER[API Router v1]

        subgraph "Módulos de API"
            AUTH_M[Auth]
            PROD[Products]
            CART[Cart]
            ORDER[Orders]
            PAY[Payments]
            SUBS[Subscriptions]
            LOYAL[Loyalty]
            ADMIN[Admin]
            ANALYTICS[Analytics]
            PROFILE[User Profile]
            ADDR[Addresses]
            PM[Payment Methods]
            SHIP[Shipping]
            SEARCH[Search]
            PT[Placement Test]
        end

        subgraph "Core Services"
            DB_CORE[Database Core]
            SEC[Security]
            DEPS_CORE[Dependencies]
        end

        subgraph "External Services"
            COGNITO_S[Cognito Service]
            STRIPE_S[Stripe Service]
            PAYPAL_S[PayPal Service]
            S3_S[S3 Service]
            SCHED[Scheduler Service]
        end

        subgraph "Data Layer"
            MODELS_L[Models]
            MIGRATIONS[Alembic Migrations]
        end
    end

    subgraph "External Systems"
        COGNITO_EXT[AWS Cognito]
        S3_EXT[AWS S3]
        STRIPE_EXT[Stripe API]
        PAYPAL_EXT[PayPal API]
        DB_EXT[(PostgreSQL)]
    end

    WEB --> MAIN
    MOBILE --> MAIN
    MAIN --> ROUTER
    ROUTER --> AUTH_M
    ROUTER --> PROD
    ROUTER --> CART
    ROUTER --> ORDER
    ROUTER --> PAY
    ROUTER --> SUBS
    ROUTER --> LOYAL
    ROUTER --> ADMIN
    ROUTER --> ANALYTICS
    ROUTER --> PROFILE
    ROUTER --> ADDR
    ROUTER --> PM
    ROUTER --> SHIP
    ROUTER --> SEARCH
    ROUTER --> PT

    AUTH_M --> COGNITO_S
    PAY --> STRIPE_S
    PAY --> PAYPAL_S
    AUTH_M --> S3_S
    PROFILE --> S3_S
    SUBS --> SCHED

    COGNITO_S --> COGNITO_EXT
    S3_S --> S3_EXT
    STRIPE_S --> STRIPE_EXT
    PAYPAL_S --> PAYPAL_EXT

    MODELS_L --> DB_EXT
    MIGRATIONS --> DB_EXT

    style MAIN fill:#4A90E2
    style ROUTER fill:#9B59B6
    style COGNITO_S fill:#FF6B6B
    style STRIPE_S fill:#4ECDC4
    style PAYPAL_S fill:#FFE66D
    style DB_EXT fill:#F39C12
```

---

## 🔌 Módulos de la API

Todos los módulos siguen el patrón **Routes → Service → Models**:

```mermaid
graph TB
    subgraph "Estructura de Módulo Típico"
        R[routes.py]
        SC[schemas.py]
        SV[service.py]

        R -->|usa| SC
        R -->|llama| SV
        SV -->|retorna| SC
    end

    subgraph "15 Módulos de API"
        direction LR
        M1[🔐 Authentication]
        M2[📦 Products]
        M3[🛒 Cart]
        M4[📋 Orders]
        M5[💳 Payments]
        M6[🔄 Subscriptions]
        M7[⭐ Loyalty]
        M8[👤 User Profile]
        M9[📍 Addresses]
        M10[💰 Payment Methods]
        M11[🚚 Shipping]
        M12[🔍 Search]
        M13[👨‍💼 Admin]
        M14[📊 Analytics]
        M15[📝 Placement Test]
    end

    SV -->|consulta| M1
    SV -->|consulta| M2
    SV -->|consulta| M3
```

### Detalle de Endpoints por Módulo

| Módulo | Prefix | Endpoints | Descripción |
|--------|--------|-----------|-------------|
| **Authentication** | `/auth` | 9 endpoints | Registro, login, confirmación email, reset password |
| **Products** | `/products` | 4 endpoints | Catálogo, detalles, productos relacionados, reviews |
| **Cart** | `/cart` | 5 endpoints | Agregar, actualizar, eliminar items, checkout |
| **Orders** | `/orders` | 4 endpoints | Listar, crear, detalles, actualizar status |
| **Payments** | `/checkout` | 5 endpoints | Resumen, checkout Stripe/PayPal, webhooks |
| **Subscriptions** | `/subscriptions` | 4 endpoints | CRUD suscripciones, pausar/reanudar |
| **Loyalty** | `/loyalty` | 5 endpoints | Puntos, tier, historial, cupones, beneficios |
| **User Profile** | `/profile` | 4 endpoints | Ver/actualizar perfil, fitness profile |
| **Addresses** | `/addresses` | 4 endpoints | CRUD direcciones de envío/facturación |
| **Payment Methods** | `/payment-methods` | 3 endpoints | Listar, guardar, eliminar métodos de pago |
| **Shipping** | `/shipping` | 2 endpoints | Rastreo, calcular costo de envío |
| **Search** | `/search` | 1 endpoint | Búsqueda con filtros avanzados |
| **Admin** | `/admin` | 8+ endpoints | CRUD usuarios y productos (admin only) |
| **Analytics** | `/analytics` | 4 endpoints | Reportes de ventas, revenue, comportamiento |
| **Placement Test** | `/placement-test` | Variable | Test de evaluación fitness |

---

## 🔄 Flujos de Procesos Principales

### 1. Flujo de Autenticación

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant AuthService
    participant Cognito
    participant S3
    participant DB

    Client->>API: POST /auth/signup
    API->>AuthService: sign_up(user_data, image)
    AuthService->>S3: upload_profile_img()
    S3-->>AuthService: image_url
    AuthService->>Cognito: sign_up()
    Cognito-->>AuthService: user_sub
    AuthService->>DB: create User
    DB-->>AuthService: user_created
    AuthService-->>API: SignUpResponse
    API-->>Client: 201 Created

    Client->>API: POST /auth/confirm
    API->>AuthService: confirm_sign_up(email, code)
    AuthService->>Cognito: confirm_sign_up()
    Cognito-->>AuthService: confirmed
    AuthService-->>API: ConfirmResponse
    API-->>Client: 200 OK

    Client->>API: POST /auth/login
    API->>AuthService: sign_in(email, password)
    AuthService->>Cognito: initiate_auth()
    Cognito-->>AuthService: JWT tokens
    AuthService->>DB: find User by cognito_sub
    DB-->>AuthService: user
    AuthService-->>API: LoginResponse
    API-->>Client: 200 OK + tokens
```

### 2. Flujo de Checkout y Pago

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant PaymentService
    participant CartService
    participant Stripe
    participant PayPal
    participant DB

    Note over Client,DB: Opción 1: Stripe Checkout

    Client->>API: POST /checkout/stripe
    API->>PaymentService: create_stripe_checkout()
    PaymentService->>CartService: get_cart_with_items()
    CartService->>DB: query cart
    DB-->>CartService: cart_data
    CartService-->>PaymentService: cart_items
    PaymentService->>Stripe: create_checkout_session()
    Stripe-->>PaymentService: session_url
    PaymentService-->>API: CheckoutResponse
    API-->>Client: 200 OK + redirect_url

    Client->>Stripe: Complete payment
    Stripe->>API: POST /checkout/webhook/stripe
    API->>PaymentService: handle_stripe_webhook()
    PaymentService->>DB: create Order
    PaymentService->>DB: update loyalty points
    PaymentService->>DB: clear cart

    Note over Client,DB: Opción 2: PayPal Checkout

    Client->>API: POST /checkout/paypal
    API->>PaymentService: create_paypal_order()
    PaymentService->>PayPal: create_order()
    PayPal-->>PaymentService: order_id + approve_url
    PaymentService-->>API: PayPalResponse
    API-->>Client: 200 OK + approve_url

    Client->>PayPal: Approve payment
    Client->>API: POST /checkout/paypal/capture
    API->>PaymentService: capture_paypal_payment()
    PaymentService->>PayPal: capture_order()
    PayPal-->>PaymentService: capture_details
    PaymentService->>DB: create Order
    PaymentService->>DB: update loyalty points
    PaymentService->>DB: clear cart
```

### 3. Flujo de Suscripciones Automáticas

```mermaid
sequenceDiagram
    participant Scheduler
    participant SubscriptionService
    participant StripeService
    participant DB
    participant Email

    Note over Scheduler: Cron Job: 00:30 daily

    Scheduler->>SubscriptionService: process_subscriptions()
    SubscriptionService->>DB: query active subscriptions
    DB-->>SubscriptionService: subscriptions[]

    loop For each subscription
        SubscriptionService->>SubscriptionService: check if renewal_due

        alt Renewal Due
            SubscriptionService->>DB: get saved_payment_method
            DB-->>SubscriptionService: payment_method
            SubscriptionService->>StripeService: charge_saved_card()

            alt Payment Success
                StripeService-->>SubscriptionService: charge_confirmed
                SubscriptionService->>DB: create Order
                SubscriptionService->>DB: update next_delivery_date
                SubscriptionService->>DB: reset failed_attempts
                SubscriptionService->>Email: send_confirmation()
            else Payment Failed
                StripeService-->>SubscriptionService: payment_failed
                SubscriptionService->>DB: increment failed_attempts

                alt failed_attempts >= 3
                    SubscriptionService->>DB: pause subscription
                    SubscriptionService->>Email: send_suspension_notice()
                else retry available
                    SubscriptionService->>Email: send_retry_notice()
                end
            end
        end
    end

    SubscriptionService-->>Scheduler: processing_complete
```

### 4. Flujo de Programa de Lealtad

```mermaid
flowchart TD
    A[Usuario completa compra] --> B{Calcular puntos}
    B --> C[Base: 1 punto por $10 MXN]
    C --> D{Usuario tiene tier?}
    D -->|Bronce 1.5x| E[Multiplicar x1.5]
    D -->|Plata 2x| F[Multiplicar x2]
    D -->|Oro 2.5x| G[Multiplicar x2.5]
    D -->|Sin tier 1x| H[Sin multiplicador]

    E --> I[Guardar en PointHistory]
    F --> I
    G --> I
    H --> I

    I --> J[Actualizar UserLoyalty.current_points]
    J --> K[Actualizar UserLoyalty.lifetime_points]
    K --> L{Puntos suficientes para upgrade?}

    L -->|Sí| M[Upgrade tier]
    L -->|No| N[Mantener tier actual]

    M --> O[Generar cupones mensuales]
    N --> O

    O --> P{Usuario redime cupón?}
    P -->|Sí| Q[Aplicar descuento]
    P -->|No| R[Guardar para después]

    Q --> S[Marcar UserCoupon como usado]
    S --> T[Asociar a Order]

    style A fill:#4A90E2
    style I fill:#50C878
    style M fill:#F39C12
    style Q fill:#9B59B6
```

### 5. Flujo de Dependency Injection

```mermaid
flowchart LR
    A[HTTP Request] --> B{Security Header?}
    B -->|No token| C[HTTPException 401]
    B -->|Has token| D[get_token_from_header]

    D --> E[get_db]
    E --> F[DB Session]

    D --> G[get_current_user]
    G --> H[verify_token with Cognito]
    H --> I{Token valid?}

    I -->|No| J[HTTPException 401]
    I -->|Yes| K[Extract cognito_sub]

    K --> L[Query User from DB]
    L --> M{User exists?}
    M -->|No| N[HTTPException 404]
    M -->|Yes| O{Account active?}

    O -->|No| P[HTTPException 403]
    O -->|Yes| Q[Return User]

    Q --> R{Requires Admin?}
    R -->|Yes| S[require_admin]
    R -->|No| T[Execute endpoint]

    S --> U{User is ADMIN?}
    U -->|No| V[HTTPException 403]
    U -->|Yes| T

    T --> W[Business Logic]
    W --> X[Return Response]

    style A fill:#4A90E2
    style Q fill:#50C878
    style T fill:#9B59B6
    style X fill:#F39C12
```

---

## 🗄️ Modelo de Base de Datos

### Diagrama de Entidad-Relación

```mermaid
erDiagram
    User ||--o{ Order : places
    User ||--|| ShoppingCart : has
    User ||--o{ Address : has
    User ||--o{ PaymentMethod : has
    User ||--|| FitnessProfile : has
    User ||--|| UserLoyalty : has
    User ||--o{ Review : writes
    User ||--o| Subscription : has
    User ||--o{ UserCoupon : redeems

    Product ||--o{ ProductImage : has
    Product ||--o{ CartItem : in
    Product ||--o{ OrderItem : in
    Product ||--o{ Review : receives

    ShoppingCart ||--o{ CartItem : contains

    Order ||--o{ OrderItem : contains
    Order }o--|| Address : ships_to
    Order }o--o| PaymentMethod : paid_with
    Order }o--o| Coupon : applies
    Order }o--o| Subscription : from
    Order ||--o{ Review : has
    Order ||--o| PointHistory : earns

    Subscription }o--|| FitnessProfile : based_on
    Subscription }o--|| PaymentMethod : charges
    Subscription ||--o{ Order : generates

    UserLoyalty }o--|| LoyaltyTier : belongs_to
    UserLoyalty ||--o{ PointHistory : tracks

    LoyaltyTier ||--o{ UserLoyalty : has

    Coupon ||--o{ UserCoupon : redeemed_by

    UserCoupon }o--o| Order : used_in

    User {
        int user_id PK
        string role
        string email UK
        string password_hash
        string cognito_sub UK
        string stripe_customer_id
        string first_name
        string last_name
        string gender
        date date_of_birth
        string profile_picture
        boolean account_status
        datetime created_at
    }

    Product {
        int product_id PK
        string name
        text description
        string brand
        string category
        json physical_activities
        json fitness_objectives
        text nutritional_value
        decimal price
        int stock
        decimal average_rating
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    Order {
        int order_id PK
        int user_id FK
        int address_id FK
        int payment_id FK
        int coupon_id FK
        int subscription_id FK
        boolean is_subscription
        datetime order_date
        string order_status
        string tracking_number
        decimal subtotal
        decimal discount_amount
        decimal shipping_cost
        decimal total_amount
        int points_earned
    }

    Subscription {
        int subscription_id PK
        int user_id FK
        int profile_id FK
        int payment_method_id FK
        string subscription_status
        date start_date
        date end_date
        date next_delivery_date
        boolean auto_renew
        decimal price
        date last_payment_date
        int failed_payment_attempts
    }

    UserLoyalty {
        int user_id PK_FK
        int tier_id FK
        int current_points
        int lifetime_points
        date tier_upgrade_date
    }

    LoyaltyTier {
        int tier_id PK
        int tier_level UK
        int min_points_required
        decimal points_multiplier
        decimal free_shipping_threshold
        int monthly_coupons_count
        decimal coupon_discount_percentage
    }

    PointHistory {
        int history_id PK
        int user_id FK
        int order_id FK
        string event_type
        int points_amount
        datetime created_at
    }
```

### Relaciones Clave

| Relación | Tipo | Descripción |
|----------|------|-------------|
| User ↔ ShoppingCart | 1:1 | Cada usuario tiene un carrito activo |
| User ↔ Subscription | 1:0..1 | Usuario puede tener máximo una suscripción |
| User ↔ UserLoyalty | 1:1 | Sistema de lealtad obligatorio |
| Order ↔ Subscription | N:0..1 | Orden puede ser parte de suscripción |
| Subscription ↔ Order | 1:N | Suscripción genera múltiples órdenes |
| UserLoyalty ↔ LoyaltyTier | N:1 | Múltiples usuarios en cada tier |
| Order → PointHistory | 1:0..1 | Orden puede generar puntos |

---

## 🔗 Integraciones Externas

```mermaid
graph TB
    subgraph "BeFit Backend"
        APP[FastAPI App]
        AUTH_SVC[Auth Service]
        PAYMENT_SVC[Payment Service]
        STORAGE_SVC[Storage Service]
    end

    subgraph "AWS Services"
        COGNITO[AWS Cognito<br/>User Pools]
        S3[AWS S3<br/>Bucket]
    end

    subgraph "Payment Processors"
        STRIPE[Stripe API]
        PAYPAL[PayPal REST API]
    end

    APP --> AUTH_SVC
    APP --> PAYMENT_SVC
    APP --> STORAGE_SVC

    AUTH_SVC -->|JWT Tokens| COGNITO
    AUTH_SVC -->|Verify JWKS| COGNITO

    STORAGE_SVC -->|Upload Images| S3
    STORAGE_SVC -->|Get Public URLs| S3

    PAYMENT_SVC -->|Checkout Sessions| STRIPE
    PAYMENT_SVC -->|Webhooks| STRIPE
    PAYMENT_SVC -->|OAuth2 + Orders| PAYPAL

    style COGNITO fill:#FF9900
    style S3 fill:#FF9900
    style STRIPE fill:#635BFF
    style PAYPAL fill:#003087
```

### Detalles de Integración

#### AWS Cognito
- **Propósito**: Gestión de identidad y autenticación
- **Flujos**: Sign up, sign in, email confirmation, password reset
- **Tokens**: Access token (30 min), ID token, Refresh token
- **Verificación**: JWT con RS256 usando JWKS (caché 1 hora)

#### AWS S3
- **Propósito**: Almacenamiento de archivos
- **Contenido**: Imágenes de perfil, imágenes de productos
- **Validación**: Max 5MB, formatos JPEG/PNG/WEBP
- **Procesamiento**: Auto-resize a 1024x1024 px

#### Stripe
- **Propósito**: Procesamiento de pagos
- **Métodos**: Checkout hosted, Payment Intents, Setup Intents
- **Webhooks**: `payment_intent.succeeded`, `payment_failed`, `dispute.created`
- **Metadata**: Order ID, user ID, cart items

#### PayPal
- **Propósito**: Procesamiento de pagos alternativo
- **Flujo**: OAuth2 → Create Order → Capture
- **Moneda**: MXN (Pesos mexicanos)
- **Environment**: Sandbox/Live configurable

---

## 🎨 Patrones y Principios

### Patrones de Diseño Implementados

#### 1. **Service Layer Pattern**
```
Routes → Service → Models
```
- **Beneficio**: Separación de responsabilidades
- **Ubicación**: Cada módulo en `/api/v1/{module}/service.py`

#### 2. **Dependency Injection**
```python
def endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # business logic
```
- **Beneficio**: Testabilidad y bajo acoplamiento
- **Ubicación**: `app/api/deps.py`

#### 3. **Repository Pattern** (Implícito)
- **Implementación**: Services actúan como repositories
- **Beneficio**: Abstracción de acceso a datos

#### 4. **Factory Pattern**
- **Uso**: Creación de servicios (Stripe, PayPal, S3)
- **Beneficio**: Configuración centralizada

#### 5. **Strategy Pattern**
- **Uso**: Múltiples métodos de pago (Stripe, PayPal)
- **Beneficio**: Extensibilidad para nuevos procesadores

### Principios SOLID

| Principio | Implementación |
|-----------|----------------|
| **S**ingle Responsibility | Cada service tiene una responsabilidad única |
| **O**pen/Closed | Extensible con nuevos módulos sin modificar core |
| **L**iskov Substitution | Models heredan de SQLAlchemy Base correctamente |
| **I**nterface Segregation | Schemas específicos por endpoint |
| **D**ependency Inversion | Dependencias inyectadas, no hardcodeadas |

### Clean Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │  ← FastAPI Routes
├─────────────────────────────────────┤
│         Application Layer           │  ← Schemas, Dependencies
├─────────────────────────────────────┤
│           Domain Layer              │  ← Services, Business Logic
├─────────────────────────────────────┤
│       Infrastructure Layer          │  ← Models, External APIs
└─────────────────────────────────────┘
```

---

## 📦 Estructura de Archivos Detallada

```
Backend/
├── alembic/                          # Database migrations
│   ├── versions/
│   │   └── ab46214e3156_migracion_a_postgres.py
│   ├── env.py
│   └── script.py.mako
│
├── app/
│   ├── main.py                       # ⚡ FastAPI app entry
│   ├── config.py                     # ⚙️ Settings & env vars
│   │
│   ├── api/
│   │   ├── deps.py                   # 💉 DI: get_db, get_current_user, require_admin
│   │   └── v1/
│   │       ├── router.py             # 🔀 Main router (aggregates all modules)
│   │       │
│   │       ├── auth/                 # 🔐 Authentication
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py        # CognitoService
│   │       │
│   │       ├── products/             # 📦 Product catalog
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── cart/                 # 🛒 Shopping cart
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── orders/               # 📋 Order management
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── payments/             # 💳 Payment processing
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── subscriptions/        # 🔄 Subscriptions
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── loyalty/              # ⭐ Loyalty program
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── user_profile/         # 👤 User profile
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── address/              # 📍 Address management
│   │       ├── payment_method/       # 💰 Payment methods
│   │       ├── analytics/            # 📊 Analytics & reports
│   │       ├── search/               # 🔍 Product search
│   │       ├── admin/                # 👨‍💼 Admin endpoints
│   │       ├── shipping/             # 🚚 Shipping & tracking
│   │       └── placement_test/       # 📝 Placement test
│   │
│   ├── core/
│   │   ├── database.py               # 🗄️ SQLAlchemy engine & session
│   │   ├── security.py               # 🔒 Password hashing
│   │   └── aws_cognito.py            # (Empty - logic in auth service)
│   │
│   ├── models/                       # 📊 ORM Models (19 files)
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   ├── subscription.py
│   │   ├── loyalty_tier.py
│   │   ├── user_loyalty.py
│   │   ├── point_history.py
│   │   ├── shopping_cart.py
│   │   ├── cart_item.py
│   │   ├── order_item.py
│   │   ├── address.py
│   │   ├── payment_method.py
│   │   ├── coupon.py
│   │   ├── user_coupon.py
│   │   ├── review.py
│   │   ├── fitness_profile.py
│   │   ├── product_image.py
│   │   └── enum.py                   # Enums: UserRole, OrderStatus, etc.
│   │
│   ├── services/                     # 🔧 External integrations
│   │   ├── stripe_service.py         # Stripe API
│   │   ├── paypal_service.py         # PayPal API
│   │   ├── s3_service.py             # AWS S3
│   │   └── scheduler.py              # APScheduler (background jobs)
│   │
│   └── utils/
│       └── helpers.py                # (Empty - utility functions)
│
├── tests/
│   ├── conftest.py                   # pytest fixtures
│   ├── test_products.py
│   ├── test_cart.py
│   └── test_admin.py
│
├── alembic.ini                       # Alembic config
├── requirements.txt                  # Dependencies
├── pytest.ini                        # pytest config
├── seed_data.py                      # Database seeding
└── ARCHITECTURE.md                   # 📖 This file
```

---

## 🚀 Notas de Implementación

### Background Jobs (Scheduler)

El sistema utiliza **APScheduler** para ejecutar tareas programadas:

```python
# Jobs configurados:
1. expire_loyalty_points()  → 00:00 daily
2. process_subscriptions()  → 00:30 daily
```

**Funcionalidad**:
- ✅ Expiración automática de puntos antiguos
- ✅ Procesamiento de suscripciones y cobros automáticos
- ✅ Creación de órdenes recurrentes
- ✅ Manejo de fallos de pago (3 intentos → pausar)

### Seguridad

#### Autenticación
- JWT tokens validados con JWKS de Cognito
- Caché de 1 hora para reducir llamadas a AWS
- Access token expira en 30 minutos

#### Autorización
- Role-based access control (ADMIN, USER)
- Dependency injection para verificar permisos
- DEV_MODE bypass para desarrollo

#### Validación de Datos
- Pydantic schemas para request/response
- Validación automática de tipos
- Email validator para correos

#### Password Security
- bcrypt para hashing (10 rounds)
- No se almacenan passwords en texto plano
- Cognito maneja políticas de password

### Performance

#### Database
- Índices en: `user_id`, `email`, `cognito_sub`, `product_id`
- Relationships con lazy loading (optimizable con eager loading)
- Connection pooling de SQLAlchemy

#### Caching
- JWKS cache (1 hora TTL)
- Sin implementación de Redis (recomendado para producción)

#### Async Operations
- PayPal service usa `httpx.AsyncClient`
- S3 uploads son síncronos (mejorables con aioboto3)

---

## 📋 Checklist de Mejoras Futuras

### Escalabilidad
- [ ] Implementar Redis para caché
- [ ] Migrar de APScheduler a Celery + Redis
- [ ] Implementar rate limiting
- [ ] Agregar health checks detallados

### Seguridad
- [ ] Implementar refresh token rotation
- [ ] Agregar CSRF protection
- [ ] Implementar audit logs
- [ ] Agregar API key authentication para servicios

### Observabilidad
- [ ] Integrar Sentry para error tracking
- [ ] Agregar métricas con Prometheus
- [ ] Implementar distributed tracing (OpenTelemetry)
- [ ] Logs estructurados con JSON

### Testing
- [ ] Aumentar cobertura de tests (>80%)
- [ ] Agregar integration tests
- [ ] Implementar contract testing
- [ ] Agregar performance tests

### DevOps
- [ ] Dockerización completa
- [ ] CI/CD pipeline
- [ ] Infrastructure as Code (Terraform)
- [ ] Auto-scaling configuration

---

## 📚 Referencias

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [AWS Cognito Developer Guide](https://docs.aws.amazon.com/cognito/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [PayPal REST API](https://developer.paypal.com/api/rest/)

---

**Última actualización**: 2025-11-19
**Versión del documento**: 1.0.0
**Mantenido por**: Equipo BeFit Backend
