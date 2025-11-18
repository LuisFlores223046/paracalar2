# 🧪 Guía de Pruebas PayPal - BeFit API

## 📋 Tabla de Contenidos
1. [Configuración de PayPal Sandbox](#configuración-de-paypal-sandbox)
2. [Cuentas de Prueba](#cuentas-de-prueba)
3. [Prueba Manual (Swagger UI)](#prueba-manual-swagger-ui)
4. [Prueba Automatizada (Script)](#prueba-automatizada-script)
5. [Verificación de Resultados](#verificación-de-resultados)
6. [Solución de Problemas](#solución-de-problemas)

---

## 1. Configuración de PayPal Sandbox

### ✅ Paso 1: Acceder a PayPal Developer

1. Ve a: **https://developer.paypal.com/**
2. Inicia sesión con tu cuenta PayPal personal
3. Click en **"Dashboard"** en el menú superior

### ✅ Paso 2: Verificar Credenciales

Tu `.env` ya tiene las credenciales configuradas:
```bash
PAYPAL_CLIENT_ID=AZNSpqBpS5opgUo2J1MpYvVOD43wfPR138QcwarvLfWs4G0U5Q4Y9PT8bjdvnSLHQgLSBR9oqJMgGMmf
PAYPAL_CLIENT_SECRET=EBVJsij7K-bfHILyyjK_iozPW2mB0YpQyETNae_LW97ffUjhf3xrHLYJuxd2U5olU1FbYayNT3y8kgIJ
PAYPAL_API_BASE_URL=https://api.sandbox.paypal.com
```

✅ **Estás usando PayPal SANDBOX** (modo de prueba)

### ✅ Paso 3: Obtener Cuentas de Prueba

En PayPal Developer Dashboard:
1. Ve a **"Testing Tools"** → **"Sandbox Accounts"**
2. Verás 2 cuentas creadas automáticamente:
   - 📧 **Business Account** (vendedor - ya configurada en tu app)
   - 💳 **Personal Account** (comprador - la usarás para pagar)

**Copia las credenciales de la cuenta PERSONAL:**
- Email: `sb-xxxxx@personal.example.com`
- Password: (Click en "View/Edit" para ver la contraseña)

---

## 2. Cuentas de Prueba

### 🧑 Cuenta Personal (Comprador)

Esta es la cuenta que usarás para **APROBAR** los pagos en PayPal.

**Credenciales de ejemplo:**
```
Email: sb-47xyz@personal.example.com
Password: (la que veas en PayPal Dashboard)
```

**Datos de tarjeta de prueba:**
Las cuentas sandbox de PayPal ya tienen "dinero virtual". No necesitas tarjetas.

---

## 3. Prueba Manual (Swagger UI)

### 📝 Paso a Paso

#### Paso 1: Iniciar el Servidor
```powershell
uvicorn app.main:app --reload
```

#### Paso 2: Abrir Swagger UI
Abre tu navegador en: **http://localhost:8000/docs**

#### Paso 3: Registrarse
1. Expande **`POST /api/v1/auth/signup`**
2. Click en **"Try it out"**
3. Copia este JSON:
```json
{
  "email": "testpaypal@befit.com",
  "password": "TestPayPal123!",
  "first_name": "Test",
  "last_name": "PayPal",
  "gender": "M",
  "date_of_birth": "1990-01-01"
}
```
4. Click **"Execute"**
5. ⚠️ **IMPORTANTE**: Ve a **AWS Cognito Console** y confirma el usuario manualmente

#### Paso 4: Login
1. Expande **`POST /api/v1/auth/login`**
2. JSON:
```json
{
  "email": "testpaypal@befit.com",
  "password": "TestPayPal123!"
}
```
3. Copia el `access_token` del response

#### Paso 5: Autorizar en Swagger
1. Click en **"Authorize"** (botón verde arriba a la derecha)
2. Escribe: `Bearer TU_ACCESS_TOKEN_AQUI`
3. Click **"Authorize"**

#### Paso 6: Crear Dirección
1. Expande **`POST /api/v1/addresses`**
2. JSON:
```json
{
  "address_line_1": "Av. Reforma 123",
  "address_line_2": "Col. Centro",
  "city": "Ciudad de México",
  "state": "CDMX",
  "postal_code": "06000",
  "country": "México",
  "is_default": true,
  "is_billing": false
}
```
3. **Copia el `address_id`** del response

#### Paso 7: Agregar Productos al Carrito
1. Expande **`POST /api/v1/cart/items`**
2. Agrega varios productos:
```json
{
  "product_id": 1,
  "quantity": 2
}
```
Repite con product_id: 5, 9, etc.

#### Paso 8: Obtener Resumen de Checkout
1. Expande **`POST /api/v1/checkout/summary`**
2. JSON:
```json
{
  "address_id": 1,
  "coupon_code": "WELCOME10"
}
```
3. Verifica el `total_amount`

#### Paso 9: Inicializar Checkout de PayPal
1. Expande **`POST /api/v1/checkout/paypal/init`**
2. JSON:
```json
{
  "address_id": 1,
  "coupon_code": "WELCOME10"
}
```
3. **Copia:**
   - `paypal_order_id`
   - `paypal_approval_url`

#### Paso 10: Aprobar Pago en PayPal
1. Abre en una **nueva pestaña** la `paypal_approval_url`
2. Inicia sesión con tu **cuenta PERSONAL de sandbox**
   ```
   Email: sb-xxxxx@personal.example.com
   Password: (la de PayPal Dashboard)
   ```
3. Click en **"Continue"** o **"Pay Now"**
4. Verás confirmación de pago

#### Paso 11: Capturar el Pago
1. Vuelve a Swagger UI
2. Expande **`POST /api/v1/checkout/paypal/capture`**
3. JSON:
```json
{
  "paypal_order_id": "EL_ID_QUE_COPIASTE",
  "address_id": 1,
  "coupon_code": "WELCOME10"
}
```
4. Si todo va bien, verás:
```json
{
  "success": true,
  "order_id": 1,
  "total_amount": "2556.00",
  "points_earned": 128
}
```

✅ **¡Listo! Pago completado**

---

## 4. Prueba Automatizada (Script)

### 🚀 Opción Rápida

```powershell
# Ejecuta el script de prueba automatizado
python test_paypal_flow.py
```

El script hará TODO automáticamente:
- ✅ Crear usuario
- ✅ Login
- ✅ Crear dirección
- ✅ Agregar productos al carrito
- ✅ Inicializar PayPal
- ⏸️ **Pausará** para que apruebes el pago manualmente
- ✅ Capturará el pago

---

## 5. Verificación de Resultados

### ✅ En pgAdmin4

Ejecuta estas queries para verificar:

```sql
-- Ver la orden creada
SELECT
    order_id,
    user_id,
    order_status,
    total_amount,
    points_earned,
    order_date
FROM "order"
ORDER BY order_id DESC
LIMIT 1;

-- Ver items de la orden
SELECT
    oi.order_item_id,
    p.name AS product_name,
    oi.quantity,
    oi.unit_price,
    oi.subtotal
FROM order_item oi
JOIN product p ON oi.product_id = p.product_id
ORDER BY oi.order_item_id DESC;

-- Ver método de pago usado
SELECT
    payment_id,
    payment_type,
    paypal_email,
    is_default,
    created_at
FROM payment_method
ORDER BY payment_id DESC
LIMIT 1;

-- Ver puntos ganados
SELECT
    history_id,
    user_id,
    event_type,
    points_amount,
    created_at
FROM point_history
ORDER BY history_id DESC
LIMIT 1;
```

### ✅ En PayPal Sandbox Dashboard

1. Ve a: **https://developer.paypal.com/dashboard/**
2. Click en **"Sandbox"** → **"Accounts"**
3. Click en tu **Business Account** (vendedor)
4. Verás el pago recibido en el balance

### ✅ En el API (Swagger UI)

```
GET /api/v1/orders
```
Deberías ver tu orden con status "PAID"

---

## 6. Solución de Problemas

### ❌ Error: "No se pudo obtener access token"

**Causa:** Credenciales PayPal incorrectas

**Solución:**
1. Ve a PayPal Developer Dashboard
2. Click en tu app → Credentials
3. Copia nuevamente `Client ID` y `Secret`
4. Actualiza `.env`

---

### ❌ Error: "Order already captured"

**Causa:** Intentaste capturar la misma orden 2 veces

**Solución:**
- Crea una nueva orden desde el paso 9

---

### ❌ Error: "Invalid approval URL"

**Causa:** La URL de aprobación expiró

**Solución:**
- Las órdenes PayPal expiran en 3 horas
- Crea una nueva orden

---

### ❌ Error: "Cannot login to PayPal"

**Causa:** Estás usando credenciales de producción en sandbox

**Solución:**
- Asegúrate de usar la cuenta **PERSONAL** de sandbox
- Email debe terminar en `@personal.example.com`

---

### ❌ Error: "CORS error"

**Causa:** Frontend en dominio diferente

**Solución:**
Verifica que `APP_URL` en `.env` apunte al frontend correcto:
```bash
APP_URL=https://frontend.d34s9corpodswj.amplifyapp.com
```

---

## 🎯 URLs Importantes

| Recurso | URL |
|---------|-----|
| PayPal Developer | https://developer.paypal.com/ |
| Sandbox Accounts | https://developer.paypal.com/dashboard/accounts |
| Sandbox Login | https://www.sandbox.paypal.com/ |
| API Swagger UI | http://localhost:8000/docs |
| pgAdmin4 | http://localhost:5050 (si instalado) |

---

## 📊 Flujo Completo PayPal

```
1. Usuario agrega productos al carrito
      ↓
2. POST /checkout/paypal/init
   → Backend crea orden en PayPal
   → Devuelve approval_url
      ↓
3. Usuario abre approval_url en navegador
   → Inicia sesión en PayPal Sandbox
   → Aprueba el pago
   → Redirigido a APP_URL/success
      ↓
4. POST /checkout/paypal/capture
   → Backend captura el pago
   → Crea orden en BD
   → Asigna puntos de lealtad
   → Guarda método de pago
      ↓
5. ✅ Orden completada
```

---

## 💡 Tips

1. **Siempre usa cuentas SANDBOX** para pruebas
2. **No uses dinero real** en sandbox
3. **Las órdenes expiran** en 3 horas
4. **Puedes crear múltiples órdenes** con la misma cuenta
5. **Los puntos de lealtad** se calculan automáticamente
6. **Los cupones** se aplican antes del cálculo de puntos

---

## ✅ Checklist de Prueba

- [ ] Servidor corriendo (`uvicorn app.main:app --reload`)
- [ ] Base de datos poblada (`python seed_data.py`)
- [ ] Usuario creado y confirmado en Cognito
- [ ] Dirección de envío creada
- [ ] Productos agregados al carrito
- [ ] Orden PayPal creada
- [ ] Pago aprobado en PayPal Sandbox
- [ ] Pago capturado exitosamente
- [ ] Orden visible en pgAdmin4
- [ ] Puntos de lealtad asignados

---

¡Listo para probar! 🚀
