# Documentación de Módulos de la API

## Índice de Módulos

1. [Autenticación (auth)](#autenticación-auth)
2. [Productos (products)](#productos-products)
3. [Carrito (cart)](#carrito-cart)
4. [Órdenes (orders)](#órdenes-orders)
5. [Pagos (payments)](#pagos-payments)
6. [Métodos de Pago (payment_method)](#métodos-de-pago-payment_method)
7. [Suscripciones (subscriptions)](#suscripciones-subscriptions)
8. [Programa de Lealtad (loyalty)](#programa-de-lealtad-loyalty)
9. [Direcciones (address)](#direcciones-address)
10. [Perfil de Usuario (user_profile)](#perfil-de-usuario-user_profile)
11. [Búsqueda (search)](#búsqueda-search)
12. [Envíos (shipping)](#envíos-shipping)
13. [Analytics](#analytics)
14. [Administración (admin)](#administración-admin)
15. [Prueba de Ubicación (placement_test)](#prueba-de-ubicación-placement_test)

---

## Autenticación (auth)

### Descripción
Gestión de autenticación de usuarios mediante AWS Cognito.

### Endpoints

#### Registro
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "phone_number": "+1234567890"
}
```

**Response (200):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user_sub": "cognito-user-sub-id",
  "email": "user@example.com"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "id_token": "eyJhbGciOiJSUzI1NiIs...",
  "refresh_token": "eyJjdHkiOiJKV1QiLCJl...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

#### Verificar Email
```http
POST /api/v1/auth/verify-email
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

#### Recuperar Contraseña
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Confirmar Nueva Contraseña
```http
POST /api/v1/auth/confirm-forgot-password
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456",
  "new_password": "NewSecurePass123!"
}
```

#### Refrescar Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJjdHkiOiJKV1QiLCJl..."
}
```

### Schemas Principales
- `RegisterRequest`
- `LoginRequest`
- `VerifyEmailRequest`
- `ForgotPasswordRequest`
- `ConfirmForgotPasswordRequest`
- `RefreshTokenRequest`
- `TokenResponse`

---

## Productos (products)

### Descripción
CRUD completo de productos, categorías, imágenes e inventario.

### Endpoints

#### Listar Productos
```http
GET /api/v1/products?skip=0&limit=20&category=fitness&is_active=true
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Protein Powder",
    "description": "Premium whey protein",
    "price": 49.99,
    "stock": 100,
    "category": "supplements",
    "is_active": true,
    "images": [
      {
        "id": 1,
        "url": "https://s3.amazonaws.com/...",
        "is_primary": true
      }
    ],
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Obtener Producto
```http
GET /api/v1/products/{product_id}
```

#### Crear Producto (Admin)
```http
POST /api/v1/products
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Yoga Mat",
  "description": "Premium yoga mat",
  "price": 29.99,
  "stock": 50,
  "category": "equipment",
  "is_active": true
}
```

#### Actualizar Producto (Admin)
```http
PUT /api/v1/products/{product_id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "price": 39.99,
  "stock": 75
}
```

#### Eliminar Producto (Admin)
```http
DELETE /api/v1/products/{product_id}
Authorization: Bearer {admin_token}
```

#### Subir Imagen
```http
POST /api/v1/products/{product_id}/images
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

file: [binary data]
is_primary: true
```

#### Eliminar Imagen
```http
DELETE /api/v1/products/images/{image_id}
Authorization: Bearer {admin_token}
```

### Schemas Principales
- `ProductCreate`
- `ProductUpdate`
- `ProductResponse`
- `ProductImageResponse`

---

## Carrito (cart)

### Descripción
Gestión del carrito de compras del usuario.

### Endpoints

#### Ver Carrito
```http
GET /api/v1/cart
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": 123,
  "items": [
    {
      "id": 1,
      "product_id": 5,
      "product": {
        "id": 5,
        "name": "Protein Powder",
        "price": 49.99,
        "image_url": "https://..."
      },
      "quantity": 2,
      "price_at_addition": 49.99,
      "subtotal": 99.98
    }
  ],
  "total": 99.98,
  "items_count": 1
}
```

#### Agregar Item
```http
POST /api/v1/cart/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "product_id": 5,
  "quantity": 2
}
```

#### Actualizar Cantidad
```http
PUT /api/v1/cart/items/{item_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 3
}
```

#### Eliminar Item
```http
DELETE /api/v1/cart/items/{item_id}
Authorization: Bearer {token}
```

#### Vaciar Carrito
```http
DELETE /api/v1/cart
Authorization: Bearer {token}
```

### Schemas Principales
- `CartItemCreate`
- `CartItemUpdate`
- `CartItemResponse`
- `CartResponse`

---

## Órdenes (orders)

### Descripción
Gestión de órdenes de compra y su ciclo de vida.

### Endpoints

#### Crear Orden
```http
POST /api/v1/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "address_id": 1,
  "payment_method": "stripe",
  "use_loyalty_points": false
}
```

**Response (200):**
```json
{
  "id": 123,
  "order_number": "ORD-2024-00123",
  "status": "pending",
  "subtotal": 99.98,
  "tax": 8.00,
  "shipping_cost": 5.00,
  "total": 112.98,
  "items": [...],
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Listar Mis Órdenes
```http
GET /api/v1/orders?skip=0&limit=20
Authorization: Bearer {token}
```

#### Obtener Orden
```http
GET /api/v1/orders/{order_id}
Authorization: Bearer {token}
```

#### Cancelar Orden
```http
PUT /api/v1/orders/{order_id}/cancel
Authorization: Bearer {token}
```

#### Descargar Factura (PDF)
```http
GET /api/v1/orders/{order_id}/invoice
Authorization: Bearer {token}
```

**Response:** PDF file

### Estados de Orden
- `pending` - Pendiente de pago
- `paid` - Pagada
- `processing` - En procesamiento
- `shipped` - Enviada
- `delivered` - Entregada
- `cancelled` - Cancelada
- `refunded` - Reembolsada

### Schemas Principales
- `OrderCreate`
- `OrderResponse`
- `OrderItemResponse`

---

## Pagos (payments)

### Descripción
Procesamiento de pagos mediante Stripe y PayPal.

### Endpoints Stripe

#### Crear Payment Intent
```http
POST /api/v1/payments/stripe/create-payment-intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_id": 123
}
```

**Response (200):**
```json
{
  "client_secret": "pi_xxx_secret_xxx",
  "payment_intent_id": "pi_xxx"
}
```

#### Webhook Stripe
```http
POST /api/v1/payments/stripe/webhook
Stripe-Signature: t=xxx,v1=xxx

{
  "type": "payment_intent.succeeded",
  "data": {...}
}
```

### Endpoints PayPal

#### Crear Orden PayPal
```http
POST /api/v1/payments/paypal/create-order
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_id": 123
}
```

**Response (200):**
```json
{
  "paypal_order_id": "PAYPAL-ORDER-ID",
  "approval_url": "https://www.paypal.com/checkoutnow?token=xxx"
}
```

#### Capturar Pago PayPal
```http
POST /api/v1/payments/paypal/capture
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_id": 123,
  "paypal_order_id": "PAYPAL-ORDER-ID"
}
```

#### Webhook PayPal
```http
POST /api/v1/payments/paypal/webhook

{
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "resource": {...}
}
```

### Schemas Principales
- `CreatePaymentIntentRequest`
- `PayPalOrderRequest`
- `PaymentResponse`

---

## Métodos de Pago (payment_method)

### Descripción
Gestión de métodos de pago guardados del usuario.

### Endpoints

#### Listar Métodos de Pago
```http
GET /api/v1/payment-methods
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "type": "card",
    "provider": "stripe",
    "last4": "4242",
    "brand": "visa",
    "exp_month": 12,
    "exp_year": 2025,
    "is_default": true
  }
]
```

#### Agregar Método de Pago
```http
POST /api/v1/payment-methods
Authorization: Bearer {token}
Content-Type: application/json

{
  "provider": "stripe",
  "payment_method_id": "pm_xxx"
}
```

#### Eliminar Método de Pago
```http
DELETE /api/v1/payment-methods/{payment_method_id}
Authorization: Bearer {token}
```

#### Establecer como Predeterminado
```http
PUT /api/v1/payment-methods/{payment_method_id}/set-default
Authorization: Bearer {token}
```

### Schemas Principales
- `PaymentMethodCreate`
- `PaymentMethodResponse`

---

## Suscripciones (subscriptions)

### Descripción
Sistema de suscripciones recurrentes con Stripe.

### Endpoints

#### Listar Planes
```http
GET /api/v1/subscriptions/plans
```

**Response (200):**
```json
[
  {
    "id": "basic",
    "name": "Plan Básico",
    "description": "Acceso básico",
    "price": 9.99,
    "interval": "month",
    "features": ["Feature 1", "Feature 2"]
  },
  {
    "id": "premium",
    "name": "Plan Premium",
    "price": 19.99,
    "interval": "month",
    "features": ["Feature 1", "Feature 2", "Feature 3"]
  }
]
```

#### Suscribirse
```http
POST /api/v1/subscriptions/subscribe
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan_id": "premium",
  "payment_method_id": "pm_xxx"
}
```

#### Ver Mi Suscripción
```http
GET /api/v1/subscriptions/my-subscription
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "plan_type": "premium",
  "status": "active",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-02-01T00:00:00Z",
  "next_billing_date": "2024-02-01T00:00:00Z",
  "stripe_subscription_id": "sub_xxx"
}
```

#### Cancelar Suscripción
```http
PUT /api/v1/subscriptions/cancel
Authorization: Bearer {token}
```

#### Reactivar Suscripción
```http
PUT /api/v1/subscriptions/reactivate
Authorization: Bearer {token}
```

### Estados de Suscripción
- `active` - Activa
- `past_due` - Pago vencido
- `cancelled` - Cancelada
- `trialing` - En prueba

### Schemas Principales
- `SubscriptionPlanResponse`
- `SubscriptionCreate`
- `SubscriptionResponse`

---

## Programa de Lealtad (loyalty)

### Descripción
Sistema de puntos de lealtad y niveles.

### Endpoints

#### Ver Mis Puntos
```http
GET /api/v1/loyalty/points
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "user_id": 123,
  "total_points": 1500,
  "available_points": 1200,
  "lifetime_points": 5000,
  "tier": {
    "id": 2,
    "name": "Silver",
    "min_points": 1000,
    "benefits": "10% de descuento"
  }
}
```

#### Historial de Puntos
```http
GET /api/v1/loyalty/history?skip=0&limit=20
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "points": 100,
    "type": "earned",
    "reason": "Compra #123",
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "points": -50,
    "type": "redeemed",
    "reason": "Canje por descuento",
    "created_at": "2024-01-02T00:00:00Z"
  }
]
```

#### Canjear Puntos
```http
POST /api/v1/loyalty/redeem
Authorization: Bearer {token}
Content-Type: application/json

{
  "points": 100,
  "reward_type": "discount",
  "order_id": 123
}
```

#### Niveles de Lealtad
```http
GET /api/v1/loyalty/tiers
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Bronze",
    "min_points": 0,
    "benefits": "5% de descuento"
  },
  {
    "id": 2,
    "name": "Silver",
    "min_points": 1000,
    "benefits": "10% de descuento"
  },
  {
    "id": 3,
    "name": "Gold",
    "min_points": 5000,
    "benefits": "15% de descuento + envío gratis"
  }
]
```

### Schemas Principales
- `LoyaltyPointsResponse`
- `PointHistoryResponse`
- `RedeemPointsRequest`
- `LoyaltyTierResponse`

---

## Direcciones (address)

### Descripción
Gestión de direcciones de envío del usuario.

### Endpoints

#### Listar Mis Direcciones
```http
GET /api/v1/addresses
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA",
    "is_default": true
  }
]
```

#### Crear Dirección
```http
POST /api/v1/addresses
Authorization: Bearer {token}
Content-Type: application/json

{
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "is_default": true
}
```

#### Actualizar Dirección
```http
PUT /api/v1/addresses/{address_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "street": "456 Oak Ave"
}
```

#### Eliminar Dirección
```http
DELETE /api/v1/addresses/{address_id}
Authorization: Bearer {token}
```

### Schemas Principales
- `AddressCreate`
- `AddressUpdate`
- `AddressResponse`

---

## Perfil de Usuario (user_profile)

### Descripción
Gestión del perfil y preferencias del usuario.

### Endpoints

#### Ver Mi Perfil
```http
GET /api/v1/profile
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 123,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "fitness_profile": {
    "height": 180,
    "weight": 75,
    "fitness_level": "intermediate",
    "goals": ["weight_loss", "muscle_gain"]
  },
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Actualizar Perfil
```http
PUT /api/v1/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+9876543210"
}
```

#### Actualizar Perfil de Fitness
```http
PUT /api/v1/profile/fitness
Authorization: Bearer {token}
Content-Type: application/json

{
  "height": 180,
  "weight": 75,
  "fitness_level": "advanced",
  "goals": ["muscle_gain", "strength"]
}
```

### Schemas Principales
- `UserProfileResponse`
- `UserProfileUpdate`
- `FitnessProfileUpdate`

---

## Búsqueda (search)

### Descripción
Búsqueda avanzada de productos.

### Endpoints

#### Buscar Productos
```http
GET /api/v1/search?q=protein&category=supplements&min_price=20&max_price=50&sort=price_asc
```

**Query Parameters:**
- `q` - Término de búsqueda
- `category` - Filtrar por categoría
- `min_price` - Precio mínimo
- `max_price` - Precio máximo
- `in_stock` - Solo productos en stock (true/false)
- `sort` - Ordenamiento (price_asc, price_desc, name_asc, newest)
- `skip` - Paginación (offset)
- `limit` - Número de resultados

**Response (200):**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Whey Protein",
      "price": 49.99,
      "category": "supplements",
      "relevance_score": 0.95
    }
  ],
  "total": 15,
  "skip": 0,
  "limit": 20
}
```

### Schemas Principales
- `SearchRequest`
- `SearchResponse`
- `ProductSearchResult`

---

## Envíos (shipping)

### Descripción
Cálculo de costos y gestión de envíos.

### Endpoints

#### Calcular Costo de Envío
```http
POST /api/v1/shipping/calculate
Authorization: Bearer {token}
Content-Type: application/json

{
  "address_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

**Response (200):**
```json
{
  "shipping_cost": 5.99,
  "estimated_days": "3-5",
  "carrier": "USPS",
  "method": "standard"
}
```

#### Métodos de Envío Disponibles
```http
GET /api/v1/shipping/methods
```

**Response (200):**
```json
[
  {
    "id": "standard",
    "name": "Envío Estándar",
    "cost": 5.99,
    "estimated_days": "3-5"
  },
  {
    "id": "express",
    "name": "Envío Express",
    "cost": 15.99,
    "estimated_days": "1-2"
  }
]
```

#### Rastrear Envío
```http
GET /api/v1/shipping/track/{tracking_number}
```

**Response (200):**
```json
{
  "tracking_number": "1Z999AA10123456784",
  "status": "in_transit",
  "current_location": "Chicago, IL",
  "estimated_delivery": "2024-01-05",
  "history": [
    {
      "status": "picked_up",
      "location": "New York, NY",
      "timestamp": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### Schemas Principales
- `ShippingCalculateRequest`
- `ShippingCostResponse`
- `TrackingResponse`

---

## Analytics

### Descripción
Reportes y estadísticas (solo admin).

### Endpoints

#### Reporte de Ventas
```http
GET /api/v1/analytics/sales?start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "total_sales": 15000.00,
  "total_orders": 150,
  "average_order_value": 100.00,
  "sales_by_day": [
    {
      "date": "2024-01-01",
      "sales": 500.00,
      "orders": 5
    }
  ]
}
```

#### Productos Más Vendidos
```http
GET /api/v1/analytics/top-products?limit=10
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
[
  {
    "product_id": 1,
    "product_name": "Protein Powder",
    "total_sold": 250,
    "revenue": 12475.00
  }
]
```

#### Estadísticas de Usuarios
```http
GET /api/v1/analytics/users
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "total_users": 1000,
  "new_users_this_month": 50,
  "active_subscribers": 200,
  "users_by_tier": {
    "bronze": 700,
    "silver": 250,
    "gold": 50
  }
}
```

### Schemas Principales
- `SalesReportResponse`
- `TopProductsResponse`
- `UserStatsResponse`

---

## Administración (admin)

### Descripción
Funciones administrativas del sistema.

### Endpoints

#### Listar Todos los Usuarios
```http
GET /api/v1/admin/users?skip=0&limit=50
Authorization: Bearer {admin_token}
```

#### Cambiar Rol de Usuario
```http
PUT /api/v1/admin/users/{user_id}/role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "is_admin": true
}
```

#### Ver Todas las Órdenes
```http
GET /api/v1/admin/orders?status=pending&skip=0&limit=50
Authorization: Bearer {admin_token}
```

#### Actualizar Estado de Orden
```http
PUT /api/v1/admin/orders/{order_id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "shipped",
  "tracking_number": "1Z999AA10123456784"
}
```

#### Dashboard Stats
```http
GET /api/v1/admin/dashboard
Authorization: Bearer {admin_token}
```

**Response (200):**
```json
{
  "today_sales": 1500.00,
  "today_orders": 15,
  "pending_orders": 5,
  "low_stock_products": 3,
  "active_users": 850
}
```

### Schemas Principales
- `UserRoleUpdate`
- `OrderStatusUpdate`
- `DashboardStatsResponse`

---

## Prueba de Ubicación (placement_test)

### Descripción
Sistema de pruebas de nivel fitness.

### Endpoints

#### Obtener Prueba
```http
GET /api/v1/placement-test
Authorization: Bearer {token}
```

#### Enviar Respuestas
```http
POST /api/v1/placement-test/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": {
    "question_1": "advanced",
    "question_2": "5",
    "question_3": "yes"
  }
}
```

**Response (200):**
```json
{
  "level": "intermediate",
  "recommendations": [
    "Workout Plan A",
    "Nutrition Guide B"
  ]
}
```

### Schemas Principales
- `PlacementTestResponse`
- `TestAnswersRequest`
- `TestResultResponse`

---

## Códigos de Estado HTTP

### Éxito
- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `204 No Content` - Solicitud exitosa sin contenido

### Errores del Cliente
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin permisos
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto (ej: email ya existe)
- `422 Unprocessable Entity` - Error de validación

### Errores del Servidor
- `500 Internal Server Error` - Error interno del servidor
- `503 Service Unavailable` - Servicio no disponible

---

## Formato de Errores

Todos los errores siguen este formato:

```json
{
  "detail": "Mensaje de error descriptivo"
}
```

Para errores de validación:

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

---

## Autenticación

La mayoría de endpoints requieren autenticación mediante Bearer Token:

```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

Obtén el token mediante el endpoint `/api/v1/auth/login`.

---

## Paginación

Endpoints que retornan listas soportan paginación:

```http
GET /api/v1/products?skip=0&limit=20
```

- `skip` - Número de items a saltar (offset)
- `limit` - Máximo de items a retornar (default: 100, max: 100)

---

## Webhooks

### Stripe
```http
POST /api/v1/payments/stripe/webhook
Stripe-Signature: t=xxx,v1=xxx
```

### PayPal
```http
POST /api/v1/payments/paypal/webhook
PayPal-Transmission-Id: xxx
PayPal-Transmission-Sig: xxx
```

---

**Versión:** 1.0.0
**Última actualización:** 2025-11-19
