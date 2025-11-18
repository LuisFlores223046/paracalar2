# 📋 Revisión Completa de tu archivo .env

## ✅ LO QUE ESTÁ BIEN

### 1. CORS Configurado ✅
```bash
BACKEND_CORS_ORIGINS=["https://frontend.d34s9corpodswj.amplifyapp.com","http://localhost:3000","http://localhost:8000","https://befitapi.store"]
```
- ✅ Incluye URL de Amplify
- ✅ Incluye localhost para desarrollo
- ✅ Formato JSON válido

### 2. APP_URL Configurado ✅
```bash
APP_URL=https://frontend.d34s9corpodswj.amplifyapp.com
```
- ✅ Apunta a Amplify (para redirecciones de Stripe/PayPal)

### 3. Base de Datos Configurada ✅
```bash
DATABASE_URL=postgresql://postgres:...@database-befit.cf4gmmewwimz.us-east-2.rds.amazonaws.com/befit
```
- ✅ PostgreSQL en RDS
- ✅ Región: us-east-2

### 4. AWS Configurado ✅
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=e97+...
S3_BUCKET_NAME=test-s3-metodos
```
- ✅ Credenciales presentes
- ⚠️ Región: us-east-1, pero RDS está en us-east-2 (puede ser intencional)

### 5. Cognito Configurado ✅
```bash
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_1ugKX5pDK
COGNITO_CLIENT_ID=2p7dqbgfdm35u054lp5dld9d9m
```
- ✅ Todo configurado correctamente

### 6. Stripe Configurado ✅
```bash
STRIPE_API_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
- ✅ Modo TEST (correcto para desarrollo)
- ✅ Webhook secret configurado

### 7. PayPal Configurado ✅
```bash
PAYPAL_CLIENT_ID=AZNSpq...
PAYPAL_CLIENT_SECRET=EBVJs...
PAYPAL_API_BASE_URL=https://api-m.sandbox.paypal.com
```
- ✅ Modo SANDBOX (correcto para desarrollo)

---

## ⚠️ CAMBIOS NECESARIOS

### 1. DEBUG Mode (Recomendación)
**Actual:**
```bash
DEBUG=true
```

**Recomendado para PRODUCCIÓN:**
```bash
DEBUG=false
```

**Razón:** DEBUG=true expone información sensible en logs.

---

### 2. JWT Algorithm (IMPORTANTE)

**Actual en .env:**
```bash
JWT_ALGORITHM=HS256
```

**Esperado en config.py:**
```python
JWT_ALGORITHM: str = "RS256"  # Línea 42 de config.py
```

**PROBLEMA:** Hay inconsistencia entre tu .env y el código.

**SOLUCIÓN:**

**Opción A - Usar HS256 (RECOMENDADO - más simple):**

1. Modificar `Backend/app/config.py` línea 42:
   ```python
   JWT_ALGORITHM: str = "HS256"  # Cambiar de RS256 a HS256
   ```

2. Mantener tu `.env` como está:
   ```bash
   JWT_ALGORITHM=HS256
   JWT_SECRET_KEY=QXc9pW3nnjB3SxT-lgz8ne-K_G_xn4sJqNBKN_rRS8k...
   ```

**Opción B - Usar RS256 (más seguro pero complejo):**

1. Generar par de claves RSA:
   ```bash
   # Generar clave privada
   openssl genrsa -out private.pem 2048

   # Generar clave pública
   openssl rsa -in private.pem -pubout -out public.pem
   ```

2. Actualizar `.env`:
   ```bash
   JWT_ALGORITHM=RS256
   JWT_SECRET_KEY=  # Dejar vacío, usar archivos de claves
   ```

**RECOMENDACIÓN:** Usar Opción A (HS256) a menos que tengas requisitos específicos de seguridad.

---

### 3. CORS - Agregar más variantes de Amplify (Opcional pero Recomendado)

**Actual:**
```bash
BACKEND_CORS_ORIGINS=["https://frontend.d34s9corpodswj.amplifyapp.com",...]
```

**Recomendado (incluir todas las URLs posibles de Amplify):**
```bash
BACKEND_CORS_ORIGINS=["https://frontend.d34s9corpodswj.amplifyapp.com","https://main.d34s9corpodswj.amplifyapp.com","https://dev.d34s9corpodswj.amplifyapp.com","http://localhost:3000","http://localhost:5173","http://localhost:8000","https://befitapi.store"]
```

**Razón:** Amplify puede usar diferentes subdominios por branch (main, dev, etc.)

---

## 🔧 ARCHIVO .env FINAL RECOMENDADO

```bash
# ============================================
# PRODUCCIÓN - BeFit Backend
# ============================================

# ============ APLICACIÓN ============
APP_NAME="BeFit API"
APP_VERSION="1.0.0"
DEBUG=false                    # ← CAMBIO: false en producción
DEV_MODE=false

# ============ BASE DE DATOS ============
DATABASE_URL=postgresql://postgres:NUEVA_PASSWORD@database-befit.cf4gmmewwimz.us-east-2.rds.amazonaws.com/befit

# ============ AWS ============
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=NUEVA_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=NUEVA_SECRET_ACCESS_KEY

# ============ AWS COGNITO ============
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_1ugKX5pDK
COGNITO_CLIENT_ID=2p7dqbgfdm35u054lp5dld9d9m

# ============ AWS S3 ============
S3_BUCKET_NAME=test-s3-metodos

# ============ JWT ============
JWT_SECRET_KEY=NUEVA_JWT_SECRET_KEY
JWT_ALGORITHM=HS256              # ← VERIFICAR: Coincide con config.py
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# ============ STRIPE (TEST MODE) ============
STRIPE_API_KEY=pk_test_51RIP5qB0vBm8XsikGndnz0UL593qTgV97ZZvIuA4FZkjtLRRreTZUdkr28DOBsqSaGp5lWbQf8S4tSDE84e1ohU900Db7HA6F5
STRIPE_SECRET_KEY=NUEVA_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_832593405b7aaafa45d828323594fcd5171b5878a244f4b97908374726ef34a9

# ============ PAYPAL (SANDBOX) ============
PAYPAL_CLIENT_ID=NUEVA_PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET=NUEVA_PAYPAL_SECRET
PAYPAL_API_BASE_URL=https://api-m.sandbox.paypal.com

# ============ CORS ============
# IMPORTANTE: Incluir todas las variantes de Amplify
BACKEND_CORS_ORIGINS=["https://frontend.d34s9corpodswj.amplifyapp.com","https://main.d34s9corpodswj.amplifyapp.com","https://dev.d34s9corpodswj.amplifyapp.com","http://localhost:3000","http://localhost:5173","http://localhost:8000","https://befitapi.store"]

# URL del frontend (para redirecciones)
APP_URL=https://frontend.d34s9corpodswj.amplifyapp.com
```

---

## 📝 CAMBIOS A HACER EN config.py

**Archivo:** `Backend/app/config.py`

### Cambio 1: JWT Algorithm (si usas HS256)

**Línea 42:**
```python
# ANTES
JWT_ALGORITHM: str = "RS256"

# DESPUÉS
JWT_ALGORITHM: str = "HS256"
```

**O mejor aún, hacer que lea del .env:**
```python
JWT_ALGORITHM: str = "HS256"  # Default, se sobrescribe con .env
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

### Backend (.env):
- [x] CORS incluye URL de Amplify
- [x] APP_URL apunta a Amplify
- [x] Database URL configurada
- [x] AWS configurado
- [x] Cognito configurado
- [x] Stripe configurado
- [x] PayPal configurado
- [ ] DEBUG=false (cambiar de true)
- [ ] JWT_ALGORITHM coincide con config.py
- [ ] Credenciales rotadas (por seguridad)

### Frontend (Amplify - Variables de Entorno):
- [ ] VITE_API_BASE=https://befitapi.store
- [ ] VITE_STRIPE_PUBLIC_KEY=pk_test_...

### Código:
- [ ] Backend/app/config.py JWT_ALGORITHM = HS256

---

## 🧪 PRUEBAS DESPUÉS DE LOS CAMBIOS

### 1. Verificar que el backend inicia sin errores:
```bash
# Ver logs del backend
tail -f logs.txt

# Deberías ver:
# CORS Origins configurados: ['https://frontend.d34s9corpodswj.amplifyapp.com', ...]
```

### 2. Verificar CORS desde curl:
```bash
curl -I -X OPTIONS https://befitapi.store/api/v1/search \
  -H "Origin: https://frontend.d34s9corpodswj.amplifyapp.com" \
  -H "Access-Control-Request-Method: GET"
```

**Debe incluir:**
```
Access-Control-Allow-Origin: https://frontend.d34s9corpodswj.amplifyapp.com
Access-Control-Allow-Methods: *
```

### 3. Verificar desde Amplify:
1. Abre https://frontend.d34s9corpodswj.amplifyapp.com
2. Abre DevTools (F12) → Console
3. Ejecuta:
   ```javascript
   fetch('https://befitapi.store/health')
     .then(r => r.json())
     .then(console.log)
   ```

**Debe mostrar:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

**Si ves error de CORS:**
- Verifica que reiniciaste el backend
- Verifica los logs: `CORS Origins configurados:`
- Verifica que la URL coincida EXACTAMENTE

---

## 🎯 RESUMEN

### Tu configuración actual está 95% correcta ✅

**Solo necesitas:**

1. **SEGURIDAD (URGENTE):**
   - Rotar todas las credenciales compartidas
   - Ver: `SEGURIDAD_URGENTE.md`

2. **CONFIGURACIÓN (5 minutos):**
   - Cambiar `DEBUG=false`
   - Verificar `JWT_ALGORITHM` en config.py
   - Opcionalmente agregar más URLs de Amplify a CORS

3. **VARIABLES EN AMPLIFY (2 minutos):**
   - Agregar `VITE_API_BASE=https://befitapi.store`
   - Re-desplegar

**Después de esto, todo debería funcionar perfectamente.** 🎉
