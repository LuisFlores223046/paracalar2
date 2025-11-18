# 🚀 Guía para Resolver "Failed to fetch" en Amplify

## 🔴 PROBLEMA IDENTIFICADO

Tu aplicación desplegada en AWS Amplify muestra **"Failed to fetch"** porque:

1. ❌ **CORS vacío en el backend** - No permite peticiones desde Amplify
2. ❌ **Variable de entorno faltante** - Amplify no sabe dónde está el backend
3. ❌ **Backend posiblemente inaccesible** desde internet

---

## ✅ SOLUCIÓN PASO A PASO

### 📋 Información que necesitas:

1. **URL de tu frontend en Amplify:** (ejemplo: `https://main.d34s9corpodswj.amplifyapp.com`)
2. **URL de tu backend:** `https://befitapi.store`

---

## 🛠️ PASO 1: Configurar CORS en el Backend

### Opción A: Usar archivo .env (RECOMENDADO)

**Ubicación:** `Backend/.env`

Agrega o modifica estas líneas:

```bash
# CORS - Permitir frontend de Amplify
BACKEND_CORS_ORIGINS=["https://main.d34s9corpodswj.amplifyapp.com","http://localhost:5173","http://localhost:3000"]

# URL del frontend para redirecciones
APP_URL=https://main.d34s9corpodswj.amplifyapp.com
```

**⚠️ IMPORTANTE:** Reemplaza `https://main.d34s9corpodswj.amplifyapp.com` con tu URL real de Amplify.

### Opción B: Modificar config.py directamente

**Archivo:** `Backend/app/config.py`

Encuentra la línea 57:
```python
BACKEND_CORS_ORIGINS: List[str] = []
```

Cámbiala a:
```python
BACKEND_CORS_ORIGINS: List[str] = [
    "https://main.d34s9corpodswj.amplifyapp.com",  # Amplify
    "http://localhost:5173",  # Desarrollo local
    "http://localhost:3000",  # Desarrollo local alt
]
```

### Verificar que funcionó:

1. Reinicia tu servidor backend
2. Verifica en los logs que aparezca:
   ```
   CORS Origins configurados: ['https://main.d34s9corpodswj.amplifyapp.com', ...]
   ```

---

## 🌐 PASO 2: Configurar Variables de Entorno en Amplify

### 2.1 Ir a la Consola de Amplify

1. Abre [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Selecciona tu aplicación
3. Ve a **"App settings"** → **"Environment variables"**

### 2.2 Agregar Variable de Entorno

Agrega la siguiente variable:

| Key | Value |
|-----|-------|
| `VITE_API_BASE` | `https://befitapi.store` |

**Captura de pantalla de cómo se ve:**
```
┌─────────────────┬──────────────────────────┐
│ Key             │ Value                    │
├─────────────────┼──────────────────────────┤
│ VITE_API_BASE   │ https://befitapi.store   │
└─────────────────┴──────────────────────────┘
```

### 2.3 Re-desplegar

Después de agregar la variable:

1. Ve a **"Deployments"**
2. Click en **"Redeploy this version"**
3. Espera a que termine el build

---

## 🔍 PASO 3: Verificar que el Backend sea Accesible

### 3.1 Probar el Backend desde el Navegador

Abre estas URLs en tu navegador:

1. **Health Check:**
   ```
   https://befitapi.store/health
   ```
   Debería retornar:
   ```json
   {
     "status": "healthy",
     "version": "1.0.0"
   }
   ```

2. **Root:**
   ```
   https://befitapi.store/
   ```
   Debería retornar:
   ```json
   {
     "message": "Welcome to the T1-MFDS 2025 Backend!",
     "docs": "/docs",
     "api_v1": "/api/v1"
   }
   ```

### 3.2 Si el backend NO responde:

Verifica:
- ✅ El servidor está corriendo
- ✅ El dominio `befitapi.store` apunta al servidor correcto
- ✅ El puerto 80/443 está abierto
- ✅ El certificado SSL está configurado

---

## 🧪 PASO 4: Probar la Conexión Frontend → Backend

### 4.1 Abrir la Consola del Navegador

1. Abre tu sitio en Amplify
2. Presiona `F12` (DevTools)
3. Ve a la pestaña **"Console"**

### 4.2 Verificar Errores

**❌ Si ves esto (MALO):**
```
Access to fetch at 'https://befitapi.store/api/v1/...' from origin 'https://main.d34s9corpodswj.amplifyapp.com' has been blocked by CORS policy
```
→ **Solución:** CORS no está configurado (ver Paso 1)

**❌ Si ves esto (MALO):**
```
Failed to fetch
TypeError: Failed to fetch
```
→ **Solución:** Variable de entorno faltante o backend inaccesible

**✅ Si NO ves errores (BUENO):**
→ ¡La conexión funciona!

### 4.3 Verificar la Variable de Entorno

En la consola del navegador, ejecuta:
```javascript
console.log(import.meta.env.VITE_API_BASE)
```

**Debería mostrar:**
```
https://befitapi.store
```

**Si muestra `undefined`:**
→ La variable no está configurada en Amplify (ver Paso 2)

---

## 🔧 PASO 5: Configuración de Archivo api.js (Verificar)

**Archivo:** `Frontend/src/utils/api.js`

Verifica que tenga:

```javascript
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
```

**NO debe tener hardcodeado:**
```javascript
const API_BASE = 'http://localhost:8000'; // ❌ MAL
```

---

## 📝 PASO 6: Build de Amplify (Verificar)

### 6.1 Verificar amplify.yml

Si tu proyecto tiene `amplify.yml`, verifica que incluya:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 6.2 Si usa package.json

Verifica que el script `build` esté configurado:

```json
{
  "scripts": {
    "build": "vite build"
  }
}
```

---

## ✅ CHECKLIST COMPLETO

Marca cada item cuando lo completes:

### Backend:
- [ ] Agregar URL de Amplify a `BACKEND_CORS_ORIGINS` en `.env`
- [ ] Configurar `APP_URL` con la URL de Amplify
- [ ] Reiniciar el servidor backend
- [ ] Verificar logs de CORS: `CORS Origins configurados: [...]`
- [ ] Probar `https://befitapi.store/health` en el navegador

### Amplify:
- [ ] Agregar variable `VITE_API_BASE=https://befitapi.store`
- [ ] Re-desplegar la aplicación
- [ ] Verificar que el build termine exitosamente
- [ ] Abrir la app y verificar la consola del navegador

### Verificación Final:
- [ ] No hay errores de CORS en la consola
- [ ] `import.meta.env.VITE_API_BASE` retorna `https://befitapi.store`
- [ ] Las peticiones al backend funcionan
- [ ] Puedes hacer login
- [ ] Puedes ver productos
- [ ] El carrito funciona

---

## 🐛 TROUBLESHOOTING

### Error: "Access blocked by CORS policy"

**Causa:** El backend no permite tu dominio de Amplify

**Solución:**
1. Verifica que agregaste la URL correcta a `BACKEND_CORS_ORIGINS`
2. La URL debe ser **EXACTA** (con https://, sin barra final)
3. Reinicia el backend
4. Verifica los logs

### Error: "Failed to fetch" sin mensaje de CORS

**Causa:** La variable `VITE_API_BASE` no está configurada

**Solución:**
1. Ve a Amplify → Environment variables
2. Agrega `VITE_API_BASE`
3. Re-despliega
4. Verifica en consola: `console.log(import.meta.env.VITE_API_BASE)`

### Error: "net::ERR_NAME_NOT_RESOLVED"

**Causa:** El dominio del backend no existe o no resuelve

**Solución:**
1. Verifica que `befitapi.store` sea accesible
2. Prueba con `curl https://befitapi.store/health`
3. Verifica DNS con `nslookup befitapi.store`

### Error: "Mixed Content" (HTTP en HTTPS)

**Causa:** Intentas hacer peticiones HTTP desde un sitio HTTPS

**Solución:**
1. Asegúrate que `VITE_API_BASE` use **https://** (no http://)
2. Verifica que tu backend tenga SSL configurado

### El backend responde pero las peticiones fallan

**Causa:** Tokens de autenticación no válidos

**Solución:**
1. Limpia localStorage: `localStorage.clear()`
2. Recarga la página
3. Vuelve a hacer login

---

## 📊 VERIFICACIÓN FINAL

### Prueba 1: Health Check
```bash
curl https://befitapi.store/health
```
Debe retornar: `{"status":"healthy","version":"1.0.0"}`

### Prueba 2: CORS Headers
```bash
curl -I -X OPTIONS https://befitapi.store/api/v1/search \
  -H "Origin: https://main.d34s9corpodswj.amplifyapp.com" \
  -H "Access-Control-Request-Method: GET"
```
Debe incluir:
```
Access-Control-Allow-Origin: https://main.d34s9corpodswj.amplifyapp.com
Access-Control-Allow-Methods: *
```

### Prueba 3: Productos (Sin autenticación)
```bash
curl https://befitapi.store/api/v1/search?page=1&limit=4&is_active=true
```
Debe retornar JSON con productos.

---

## 🎯 RESUMEN RÁPIDO

1. **Backend:** Agrega la URL de Amplify a CORS
   ```bash
   BACKEND_CORS_ORIGINS=["https://TU-APP.amplifyapp.com"]
   ```

2. **Amplify:** Agrega variable de entorno
   ```
   VITE_API_BASE=https://befitapi.store
   ```

3. **Re-despliega** ambos

4. **Verifica** en la consola del navegador que no haya errores

---

## 📞 ¿Aún tienes problemas?

Si después de seguir todos los pasos sigues viendo "Failed to fetch":

1. Copia el error COMPLETO de la consola del navegador
2. Verifica los logs del backend
3. Comparte:
   - URL de Amplify
   - Error de la consola
   - Respuesta de `curl https://befitapi.store/health`

---

## 📚 Enlaces Útiles

- [Documentación de CORS en FastAPI](https://fastapi.tiangolo.com/tutorial/cors/)
- [Variables de entorno en Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html)
- [Debugging en Vite](https://vitejs.dev/guide/env-and-mode.html)
