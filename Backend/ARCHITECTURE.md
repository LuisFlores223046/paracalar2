# Arquitectura del Backend - BeFit API

## Tabla de Contenidos
1. [Visión General](#visión-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Patrones de Diseño](#patrones-de-diseño)
5. [Capas de la Aplicación](#capas-de-la-aplicación)
6. [Módulos Principales](#módulos-principales)
7. [Flujo de Datos](#flujo-de-datos)
8. [Seguridad](#seguridad)
9. [Base de Datos](#base-de-datos)
10. [Servicios Externos](#servicios-externos)

---

## Visión General

BeFit API es un backend de e-commerce desarrollado con FastAPI que proporciona funcionalidades completas para:
- Gestión de usuarios y autenticación
- Catálogo de productos y búsqueda
- Sistema de carrito y órdenes
- Procesamiento de pagos múltiples (Stripe, PayPal)
- Sistema de suscripciones
- Programa de lealtad con puntos
- Gestión de envíos
- Analytics y reportes
- Sistema de administración

---

## Stack Tecnológico

### Framework Principal
- **FastAPI 0.121.0**: Framework web moderno y de alto rendimiento
- **Uvicorn 0.38.0**: Servidor ASGI para aplicaciones async
- **Python 3.x**: Lenguaje de programación

### Base de Datos
- **PostgreSQL**: Base de datos relacional principal
- **SQLAlchemy 2.0.44**: ORM para interacción con la base de datos
- **Alembic 1.17.1**: Migraciones de base de datos
- **psycopg2-binary 2.9.11**: Adaptador PostgreSQL

### Autenticación y Seguridad
- **AWS Cognito**: Autenticación y gestión de usuarios
- **python-jose 3.5.0**: JWT (JSON Web Tokens)
- **passlib 1.7.4**: Hashing de contraseñas
- **bcrypt 4.1.3**: Encriptación
- **cryptography 46.0.3**: Operaciones criptográficas

### Pagos
- **Stripe 13.1.2**: Procesamiento de pagos con tarjeta
- **PayPal SDK**: Integración con PayPal (API REST)

### Almacenamiento y Servicios AWS
- **boto3 1.40.66**: SDK de AWS para Python
- **S3**: Almacenamiento de imágenes y archivos

### Tareas Programadas
- **APScheduler 3.11.1**: Programación de tareas en segundo plano

### Validación y Schemas
- **Pydantic 2.12.3**: Validación de datos y schemas
- **pydantic-settings 2.11.0**: Gestión de configuración

### Email
- **fastapi-mail 1.5.8**: Envío de emails
- **aiosmtplib 4.0.2**: Cliente SMTP asíncrono

### Testing
- **pytest 8.4.2**: Framework de testing
- **pytest-asyncio 0.24.0**: Testing de código asíncrono
- **httpx 0.28.1**: Cliente HTTP para testing

### Utilidades
- **pandas 2.3.3**: Análisis de datos
- **numpy 2.3.4**: Operaciones numéricas
- **Pillow 12.0.0**: Procesamiento de imágenes
- **reportlab 4.4.4**: Generación de PDFs
- **Jinja2 3.1.6**: Motor de plantillas

---

## Estructura de Carpetas

```
Backend/
├── alembic/                    # Migraciones de base de datos
│   ├── versions/               # Scripts de migración
│   │   ├── ab46214e3156_migracion_a_postgres.py
│   │   └── a50601c0dba9_esta_es_una_migracion_de_bd.py
│   └── env.py                  # Configuración de Alembic
│
├── app/                        # Aplicación principal
│   ├── __init__.py
│   ├── main.py                 # Punto de entrada de la aplicación
│   ├── config.py               # Configuración centralizada
│   │
│   ├── api/                    # Capa de API
│   │   ├── __init__.py
│   │   ├── deps.py             # Dependencias compartidas (auth, db)
│   │   └── v1/                 # Versión 1 de la API
│   │       ├── __init__.py
│   │       ├── router.py       # Router principal que agrupa todos los módulos
│   │       │
│   │       ├── address/        # Módulo de direcciones
│   │       │   ├── __init__.py
│   │       │   ├── routes.py   # Endpoints
│   │       │   ├── schemas.py  # Pydantic schemas
│   │       │   └── service.py  # Lógica de negocio
│   │       │
│   │       ├── admin/          # Módulo de administración
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── analytics/      # Módulo de analytics
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── auth/           # Módulo de autenticación
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── cart/           # Módulo de carrito de compras
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── loyalty/        # Módulo de programa de lealtad
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── orders/         # Módulo de órdenes
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── payment_method/ # Módulo de métodos de pago
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── payments/       # Módulo de procesamiento de pagos
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── placement_test/ # Módulo de pruebas de ubicación
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── products/       # Módulo de productos
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── search/         # Módulo de búsqueda
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── shipping/       # Módulo de envíos
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       ├── subscriptions/  # Módulo de suscripciones
│   │       │   ├── __init__.py
│   │       │   ├── routes.py
│   │       │   ├── schemas.py
│   │       │   └── service.py
│   │       │
│   │       └── user_profile/   # Módulo de perfil de usuario
│   │           ├── __init__.py
│   │           ├── routes.py
│   │           ├── schemas.py
│   │           └── service.py
│   │
│   ├── core/                   # Funcionalidades core
│   │   ├── __init__.py
│   │   ├── database.py         # Configuración de base de datos
│   │   └── security.py         # Utilidades de seguridad
│   │
│   ├── models/                 # Modelos de SQLAlchemy (ORM)
│   │   ├── __init__.py
│   │   ├── address.py
│   │   ├── cart_item.py
│   │   ├── coupon.py
│   │   ├── enum.py
│   │   ├── fitness_profile.py
│   │   ├── loyalty_tier.py
│   │   ├── order.py
│   │   ├── order_item.py
│   │   ├── payment_method.py
│   │   ├── point_history.py
│   │   ├── product.py
│   │   ├── product_image.py
│   │   ├── review.py
│   │   ├── shopping_cart.py
│   │   ├── subscription.py
│   │   ├── user.py
│   │   ├── user_coupon.py
│   │   └── user_loyalty.py
│   │
│   └── services/               # Servicios externos e integraciones
│       ├── __init__.py
│       ├── paypal_service.py   # Integración con PayPal
│       ├── s3_service.py       # Integración con AWS S3
│       ├── scheduler.py        # Tareas programadas
│       └── stripe_service.py   # Integración con Stripe
│
├── tests/                      # Tests de la aplicación
│   ├── __init__.py
│   ├── conftest.py             # Configuración de pytest
│   ├── README_TESTS.md         # Documentación de tests
│   ├── test_address.py
│   ├── test_admin.py
│   ├── test_auth.py
│   ├── test_cart.py
│   ├── test_loyalty.py
│   ├── test_orders.py
│   ├── test_payment_method.py
│   ├── test_payments.py
│   ├── test_placement_test.py
│   ├── test_products.py
│   ├── test_search.py
│   ├── test_shipping.py
│   ├── test_subscriptions.py
│   └── test_user_profile.py
│
├── alembic.ini                 # Configuración de Alembic
├── pytest.ini                  # Configuración de pytest
├── create_database.py          # Script para crear base de datos
├── seed_data.py                # Script para poblar datos de prueba
└── requirements.txt            # Dependencias del proyecto
```

---

## Patrones de Diseño

### 1. **Arquitectura en Capas (Layered Architecture)**

La aplicación sigue una arquitectura en capas bien definida:

```
┌─────────────────────────────────────┐
│   API Layer (Routes)                │  ← Endpoints HTTP
├─────────────────────────────────────┤
│   Service Layer (Business Logic)    │  ← Lógica de negocio
├─────────────────────────────────────┤
│   Data Access Layer (Models)        │  ← Acceso a datos
├─────────────────────────────────────┤
│   Database (PostgreSQL)             │  ← Persistencia
└─────────────────────────────────────┘
```

**Ventajas:**
- Separación de responsabilidades
- Fácil mantenimiento
- Testeable
- Escalable

### 2. **Repository Pattern**

Cada módulo encapsula el acceso a datos a través de servicios que actúan como repositorios:

```python
# service.py actúa como Repository
class ProductService:
    def get_product(self, db: Session, product_id: int):
        return db.query(Product).filter(Product.id == product_id).first()
```

### 3. **Dependency Injection**

FastAPI utiliza inyección de dependencias para proveer recursos compartidos:

```python
# deps.py
def get_db():
    """Provee sesión de base de datos"""

def get_current_user():
    """Provee usuario autenticado"""
```

### 4. **Schema Pattern (DTO - Data Transfer Objects)**

Uso de Pydantic schemas para validación y serialización:

```python
# schemas.py
class ProductCreate(BaseModel):
    """Schema para crear producto"""

class ProductResponse(BaseModel):
    """Schema para respuesta de producto"""
```

### 5. **Service Layer Pattern**

La lógica de negocio está centralizada en la capa de servicios:

```python
# service.py
class OrderService:
    def create_order(self, db, user_id, cart_items):
        # Lógica compleja de creación de orden
        # Validaciones
        # Cálculos
        # Transacciones
```

### 6. **Facade Pattern**

Los servicios externos (Stripe, PayPal, S3) están encapsulados en facades:

```python
# stripe_service.py
class StripeService:
    """Facade para operaciones de Stripe"""

# paypal_service.py
class PayPalService:
    """Facade para operaciones de PayPal"""
```

---

## Capas de la Aplicación

### 1. **Capa de Presentación (API Layer)**

**Ubicación:** `app/api/v1/*/routes.py`

**Responsabilidades:**
- Definir endpoints HTTP
- Validar entrada (request)
- Serializar salida (response)
- Manejar errores HTTP
- Documentación de API (OpenAPI)

**Ejemplo:**
```python
@router.post("/products", response_model=ProductResponse)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user)
):
    """Crear nuevo producto (solo admin)"""
    return await product_service.create_product(db, product, current_user)
```

### 2. **Capa de Lógica de Negocio (Service Layer)**

**Ubicación:** `app/api/v1/*/service.py`

**Responsabilidades:**
- Implementar reglas de negocio
- Coordinar operaciones complejas
- Validaciones de negocio
- Cálculos y transformaciones
- Orquestación de múltiples operaciones

**Ejemplo:**
```python
class OrderService:
    def create_order(self, db: Session, user_id: int, cart_items: list):
        # 1. Validar stock
        # 2. Calcular totales
        # 3. Aplicar descuentos
        # 4. Crear orden
        # 5. Actualizar inventario
        # 6. Generar puntos de lealtad
        # 7. Enviar notificación
```

### 3. **Capa de Acceso a Datos (Data Access Layer)**

**Ubicación:** `app/models/*.py`

**Responsabilidades:**
- Definir modelos de base de datos
- Relaciones entre entidades
- Constraints y validaciones a nivel DB

**Ejemplo:**
```python
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)

    # Relaciones
    images = relationship("ProductImage", back_populates="product")
    reviews = relationship("Review", back_populates="product")
```

### 4. **Capa de Schemas (Validation Layer)**

**Ubicación:** `app/api/v1/*/schemas.py`

**Responsabilidades:**
- Validación de entrada
- Serialización de salida
- Transformación de datos
- Documentación de estructuras

**Ejemplo:**
```python
class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    price: Decimal = Field(..., gt=0)
    category: str

    @validator('price')
    def validate_price(cls, v):
        if v <= 0:
            raise ValueError('El precio debe ser positivo')
        return v
```

### 5. **Capa de Servicios Externos**

**Ubicación:** `app/services/*.py`

**Responsabilidades:**
- Integración con APIs externas
- Manejo de credenciales
- Retry logic
- Error handling específico

---

## Módulos Principales

### 1. **Autenticación (auth)**

**Funcionalidades:**
- Registro de usuarios
- Login con AWS Cognito
- Verificación de email
- Recuperación de contraseña
- Gestión de tokens JWT
- Refresh tokens

**Endpoints principales:**
- `POST /auth/register` - Registro
- `POST /auth/login` - Login
- `POST /auth/verify-email` - Verificar email
- `POST /auth/forgot-password` - Recuperar contraseña
- `POST /auth/refresh` - Refrescar token

### 2. **Productos (products)**

**Funcionalidades:**
- CRUD de productos
- Gestión de categorías
- Carga de imágenes a S3
- Gestión de inventario
- Filtrado y búsqueda

**Endpoints principales:**
- `GET /products` - Listar productos
- `POST /products` - Crear producto (admin)
- `GET /products/{id}` - Obtener producto
- `PUT /products/{id}` - Actualizar producto (admin)
- `DELETE /products/{id}` - Eliminar producto (admin)
- `POST /products/{id}/images` - Subir imagen

### 3. **Carrito (cart)**

**Funcionalidades:**
- Agregar items al carrito
- Actualizar cantidades
- Eliminar items
- Calcular totales
- Aplicar cupones

**Endpoints principales:**
- `GET /cart` - Ver carrito
- `POST /cart/items` - Agregar item
- `PUT /cart/items/{id}` - Actualizar cantidad
- `DELETE /cart/items/{id}` - Eliminar item
- `DELETE /cart` - Vaciar carrito

### 4. **Órdenes (orders)**

**Funcionalidades:**
- Crear órdenes desde carrito
- Historial de órdenes
- Seguimiento de estado
- Cancelación de órdenes
- Generación de facturas PDF

**Endpoints principales:**
- `POST /orders` - Crear orden
- `GET /orders` - Listar órdenes del usuario
- `GET /orders/{id}` - Detalle de orden
- `PUT /orders/{id}/cancel` - Cancelar orden
- `GET /orders/{id}/invoice` - Descargar factura

### 5. **Pagos (payments)**

**Funcionalidades:**
- Procesamiento con Stripe
- Procesamiento con PayPal
- Webhooks de confirmación
- Reembolsos
- Historial de pagos

**Endpoints principales:**
- `POST /payments/stripe/create-payment-intent` - Crear intento de pago Stripe
- `POST /payments/paypal/create-order` - Crear orden PayPal
- `POST /payments/stripe/webhook` - Webhook Stripe
- `POST /payments/paypal/webhook` - Webhook PayPal

### 6. **Suscripciones (subscriptions)**

**Funcionalidades:**
- Planes de suscripción
- Suscripción de usuarios
- Pagos recurrentes
- Cancelación de suscripciones
- Gestión de renovaciones

**Endpoints principales:**
- `GET /subscriptions/plans` - Listar planes
- `POST /subscriptions/subscribe` - Suscribirse
- `PUT /subscriptions/cancel` - Cancelar suscripción
- `GET /subscriptions/my-subscription` - Ver mi suscripción

### 7. **Programa de Lealtad (loyalty)**

**Funcionalidades:**
- Acumulación de puntos
- Canje de puntos
- Niveles de lealtad (tiers)
- Historial de puntos
- Recompensas

**Endpoints principales:**
- `GET /loyalty/points` - Ver puntos
- `POST /loyalty/redeem` - Canjear puntos
- `GET /loyalty/history` - Historial
- `GET /loyalty/tier` - Ver nivel

### 8. **Envíos (shipping)**

**Funcionalidades:**
- Cálculo de costos de envío
- Métodos de envío
- Seguimiento de envíos
- Zonas de envío

**Endpoints principales:**
- `POST /shipping/calculate` - Calcular costo
- `GET /shipping/methods` - Métodos disponibles
- `GET /shipping/track/{id}` - Rastrear envío

### 9. **Analytics (analytics)**

**Funcionalidades:**
- Reportes de ventas
- Productos más vendidos
- Estadísticas de usuarios
- Métricas de conversión
- Dashboards para admin

**Endpoints principales:**
- `GET /analytics/sales` - Reporte de ventas
- `GET /analytics/top-products` - Productos top
- `GET /analytics/users` - Estadísticas de usuarios

### 10. **Administración (admin)**

**Funcionalidades:**
- Gestión de usuarios
- Gestión de productos
- Gestión de órdenes
- Reportes administrativos
- Configuración del sistema

**Endpoints principales:**
- `GET /admin/users` - Listar usuarios
- `PUT /admin/users/{id}/role` - Cambiar rol
- `GET /admin/orders` - Todas las órdenes
- `GET /admin/reports` - Reportes

---

## Flujo de Datos

### Flujo de una Request Típica

```
1. Cliente HTTP Request
   ↓
2. FastAPI Router (routes.py)
   │
   ├─→ Validación de Schema (Pydantic)
   │
   ├─→ Dependency Injection
   │   ├─→ get_db() → Sesión de DB
   │   └─→ get_current_user() → Usuario autenticado
   │
   ↓
3. Service Layer (service.py)
   │
   ├─→ Validaciones de negocio
   ├─→ Queries a la base de datos
   ├─→ Llamadas a servicios externos
   │   ├─→ Stripe/PayPal
   │   ├─→ AWS S3
   │   └─→ Email
   │
   ↓
4. Data Access Layer (models.py)
   │
   ├─→ SQLAlchemy ORM
   │
   ↓
5. PostgreSQL Database
   ↓
6. Response
   │
   ├─→ Serialización (Pydantic Schema)
   │
   ↓
7. HTTP Response al Cliente
```

### Ejemplo: Flujo de Creación de Orden

```
1. Cliente → POST /api/v1/orders
   Body: { cart_id: 123, payment_method: "stripe" }

2. routes.py → create_order()
   ├─→ Valida OrderCreate schema
   ├─→ Obtiene usuario autenticado
   └─→ Obtiene sesión de DB

3. service.py → OrderService.create_order()
   ├─→ Obtiene items del carrito
   ├─→ Valida stock disponible
   ├─→ Calcula totales
   ├─→ Aplica descuentos/cupones
   ├─→ Crea orden en DB
   ├─→ Crea payment intent (Stripe)
   ├─→ Actualiza inventario
   ├─→ Genera puntos de lealtad
   ├─→ Envía email de confirmación
   └─→ Vacía carrito

4. models.py → Order, OrderItem
   └─→ Persiste en PostgreSQL

5. Response → OrderResponse
   {
     "id": 456,
     "status": "pending",
     "total": 99.99,
     "payment_intent": "pi_xyz"
   }
```

---

## Seguridad

### 1. **Autenticación**

**AWS Cognito:**
- Gestión centralizada de usuarios
- MFA (Multi-Factor Authentication)
- Social login
- Recuperación de contraseña

**JWT (JSON Web Tokens):**
- Access tokens con expiración corta (30 min)
- Refresh tokens para renovación
- Algoritmo RS256 (criptografía asimétrica)

### 2. **Autorización**

**Role-Based Access Control (RBAC):**
```python
# deps.py
def get_admin_user(current_user: User = Depends(get_current_user)):
    """Requiere rol de administrador"""
    if not current_user.is_admin:
        raise HTTPException(403, "Acceso denegado")
    return current_user
```

### 3. **Validación de Datos**

**Pydantic:**
- Validación automática de tipos
- Validadores personalizados
- Sanitización de entrada

### 4. **Protección de Datos Sensibles**

**Variables de entorno:**
- Credenciales en archivo `.env`
- No versionadas en git
- Cargadas mediante `pydantic-settings`

**Hashing de contraseñas:**
```python
# security.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"])
```

### 5. **CORS**

```python
# main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 6. **HTTPS**

- Comunicación encriptada con TLS/SSL
- Certificados SSL en producción

---

## Base de Datos

### Diagrama de Relaciones Principales

```
Users (Cognito + local data)
  ↓ 1:N
ShoppingCart
  ↓ 1:N
CartItems → Products

Users
  ↓ 1:N
Orders
  ↓ 1:N
OrderItems → Products

Users
  ↓ 1:N
Reviews → Products

Users
  ↓ 1:1
UserLoyalty → LoyaltyTier
  ↓ 1:N
PointHistory

Users
  ↓ 1:N
Subscriptions

Users
  ↓ 1:N
Addresses

Users
  ↓ 1:N
PaymentMethods

Products
  ↓ 1:N
ProductImages

Users
  ↓ N:M (through UserCoupon)
Coupons
```

### Modelos Principales

#### **User**
```python
- id: int (PK)
- cognito_sub: str (unique)
- email: str (unique)
- name: str
- is_admin: bool
- created_at: datetime
```

#### **Product**
```python
- id: int (PK)
- name: str
- description: text
- price: decimal
- stock: int
- category: str
- is_active: bool
- created_at: datetime
```

#### **Order**
```python
- id: int (PK)
- user_id: int (FK)
- status: OrderStatus (enum)
- total: decimal
- subtotal: decimal
- tax: decimal
- shipping_cost: decimal
- payment_method: str
- payment_status: str
- created_at: datetime
```

#### **Subscription**
```python
- id: int (PK)
- user_id: int (FK)
- plan_type: str
- status: str
- start_date: datetime
- end_date: datetime
- stripe_subscription_id: str
```

### Migraciones con Alembic

```bash
# Crear nueva migración
alembic revision --autogenerate -m "descripción"

# Aplicar migraciones
alembic upgrade head

# Revertir migración
alembic downgrade -1
```

---

## Servicios Externos

### 1. **AWS Cognito**

**Funcionalidades:**
- Registro de usuarios
- Autenticación
- Gestión de tokens
- Verificación de email
- Recuperación de contraseña

**Configuración:**
```python
# config.py
COGNITO_REGION: str
COGNITO_USER_POOL_ID: str
COGNITO_CLIENT_ID: str
```

### 2. **AWS S3**

**Funcionalidades:**
- Almacenamiento de imágenes de productos
- Almacenamiento de archivos de usuarios
- URLs públicas para acceso

**Operaciones principales:**
```python
# s3_service.py
- upload_file()
- delete_file()
- get_file_url()
```

### 3. **Stripe**

**Funcionalidades:**
- Procesamiento de pagos con tarjeta
- Suscripciones recurrentes
- Webhooks para eventos
- Reembolsos

**Flujo de pago:**
1. Cliente solicita Payment Intent
2. Frontend completa pago con Stripe.js
3. Stripe envía webhook de confirmación
4. Backend actualiza estado de orden

### 4. **PayPal**

**Funcionalidades:**
- Procesamiento de pagos con PayPal
- Webhooks para eventos
- Reembolsos

**Flujo de pago:**
1. Cliente crea orden en PayPal
2. Cliente completa pago en PayPal
3. Frontend captura la orden
4. Backend verifica y actualiza estado

### 5. **Email (SMTP)**

**Funcionalidades:**
- Emails de bienvenida
- Confirmación de órdenes
- Notificaciones de envío
- Newsletters

**Configuración:**
```python
# Usando fastapi-mail
from fastapi_mail import FastMail
```

---

## Configuración del Entorno

### Variables de Entorno Requeridas

```env
# Aplicación
APP_NAME=BeFit API
APP_VERSION=1.0.0
DEBUG=False
DEV_MODE=False
APP_URL=https://tu-dominio.com

# Base de Datos
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# AWS Cognito
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=your_pool_id
COGNITO_CLIENT_ID=your_client_id

# AWS S3
S3_BUCKET_NAME=your_bucket

# JWT
JWT_SECRET_KEY=your_jwt_secret
JWT_ALGORITHM=RS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Stripe
STRIPE_API_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# PayPal
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
PAYPAL_API_BASE_URL=https://api-m.sandbox.paypal.com

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

---

## Ejecución del Proyecto

### 1. Instalación de Dependencias

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
./venv/Scripts/activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Configuración de Base de Datos

```bash
# Crear base de datos (si no existe)
python create_database.py

# Ejecutar migraciones
cd Backend
alembic upgrade head

# Poblar datos de prueba (opcional)
python seed_data.py
```

### 3. Ejecutar el Servidor

```bash
cd Backend
uvicorn app.main:app --reload
```

La API estará disponible en:
- **Servidor:** http://localhost:8000
- **Documentación:** http://localhost:8000/docs
- **Health check:** http://localhost:8000/health

### 4. Ejecutar Tests

```bash
cd Backend
pytest
```

---

## Best Practices Implementadas

### 1. **Código Limpio**
- Nombres descriptivos
- Funciones pequeñas y específicas
- Comentarios donde es necesario
- Docstrings en funciones públicas

### 2. **DRY (Don't Repeat Yourself)**
- Código reutilizable en servicios
- Dependencias compartidas en `deps.py`
- Utilidades comunes en `core/`

### 3. **SOLID Principles**
- **S**ingle Responsibility: Cada clase/función tiene una responsabilidad
- **O**pen/Closed: Extensible sin modificar código existente
- **L**iskov Substitution: Interfaces bien definidas
- **I**nterface Segregation: Dependencias específicas
- **D**ependency Inversion: Inyección de dependencias

### 4. **Manejo de Errores**
- Excepciones específicas de HTTP
- Logging estructurado
- Mensajes de error claros

### 5. **Testing**
- Tests unitarios para cada módulo
- Tests de integración
- Fixtures reutilizables en `conftest.py`

### 6. **Documentación**
- OpenAPI automática con FastAPI
- Comentarios en código
- README y documentación de arquitectura

### 7. **Seguridad**
- Validación de entrada
- Sanitización de datos
- Protección contra SQL injection (ORM)
- HTTPS en producción
- Secrets en variables de entorno

---

## Escalabilidad

### Estrategias Implementadas

1. **Async/Await**
   - FastAPI es asíncrono por naturaleza
   - Mejor manejo de I/O
   - Mayor concurrencia

2. **Connection Pooling**
   - SQLAlchemy maneja pool de conexiones
   - Reutilización eficiente de conexiones

3. **Caching**
   - Potencial para Redis (no implementado aún)
   - Cacheo de queries frecuentes

4. **Tareas en Background**
   - APScheduler para tareas programadas
   - Procesamiento asíncrono de emails

### Próximos Pasos para Escalabilidad

1. **Redis** para caching y sessions
2. **Celery** para tareas en background más pesadas
3. **Load Balancing** con múltiples instancias
4. **CDN** para archivos estáticos
5. **Database Replication** para lectura/escritura

---

## Monitoreo y Logging

### Logging Actual

```python
import logging

logger = logging.getLogger(__name__)
logger.info("Operación exitosa")
logger.error("Error en operación", exc_info=True)
```

### Recomendaciones

1. **Structured Logging** con JSON
2. **Centralized Logging** (ELK Stack, CloudWatch)
3. **APM** (Application Performance Monitoring)
4. **Error Tracking** (Sentry)

---

## Conclusión

Esta arquitectura proporciona:

✅ **Mantenibilidad** - Código organizado y modular
✅ **Escalabilidad** - Diseño preparado para crecer
✅ **Testabilidad** - Fácil de probar cada componente
✅ **Seguridad** - Múltiples capas de protección
✅ **Performance** - Asíncrono y optimizado
✅ **Developer Experience** - Fácil de entender y extender

---

## Recursos Adicionales

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **SQLAlchemy:** https://www.sqlalchemy.org/
- **Pydantic:** https://docs.pydantic.dev/
- **Alembic:** https://alembic.sqlalchemy.org/
- **AWS Cognito:** https://aws.amazon.com/cognito/
- **Stripe API:** https://stripe.com/docs/api
- **PayPal API:** https://developer.paypal.com/

---

**Última actualización:** 2025-11-19
**Versión:** 1.0.0
**Mantenido por:** Equipo de Desarrollo BeFit
