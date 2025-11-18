# 🔴 PROBLEMA IDENTIFICADO: "Failed to fetch"

## ❌ El Problema Real

Tu frontend en Amplify está intentando hacer peticiones al backend, pero **falla** porque:

1. **NO existe archivo `.env`** en el Frontend
2. **Amplify NO tiene configurada** la variable `VITE_API_BASE`
3. El código usa un fallback: `https://befitapi.store` (línea 9 de api.js)
4. **Pero el backend RECHAZA** las peticiones porque CORS no está permitiendo tu URL de Amplify

---

## ✅ SOLUCIÓN COMPLETA (15 minutos)

### PASO 1: Configurar Variables en AWS Amplify (5 min)

1. **Ir a AWS Amplify Console:**
   - https://console.aws.amazon.com/amplify/

2. **Seleccionar tu aplicación**

3. **Ir a "App settings" → "Environment variables"**

4. **Agregar estas 2 variables:**

   | Variable key | Value |
   |--------------|-------|
   | `VITE_API_BASE` | `https://befitapi.store` |
   | `VITE_STRIPE_PUBLIC_KEY` | `pk_test_51RIP5qB0vBm8XsikGndnz0UL593qTgV97ZZvIuA4FZkjtLRRreTZUdkr28DOBsqSaGp5lWbQf8S4tSDE84e1ohU900Db7HA6F5` |

   **IMPORTANTE:** Usa los valores EXACTOS de arriba.

5. **Click en "Save"**

6. **Re-desplegar:**
   - Ir a "Deployments"
   - Click en "Redeploy this version"
   - Esperar a que termine (3-5 minutos)

---

### PASO 2: Verificar CORS en el Backend (2 min)

**Tu archivo Backend/.env debe tener:**

```bash
BACKEND_CORS_ORIGINS=["https://frontend.d34s9corpodswj.amplifyapp.com","http://localhost:3000","http://localhost:5173"]
```

**VERIFICAR:**
1. Que la URL sea **EXACTAMENTE** la de tu Amplify (sin barra final)
2. Que tenga `https://` al inicio
3. Que esté entre comillas dobles
4. Que esté en formato JSON válido

**Si tu URL de Amplify es diferente, cámbiala a la correcta.**

---

### PASO 3: Reiniciar el Backend (1 min)

Después de modificar el `.env`:

```bash
# Detener el servidor
# Actualizar .env
# Iniciar el servidor de nuevo
```

Verificar en los logs que diga:
```
CORS Origins configurados: ['https://frontend.d34s9corpodswj.amplifyapp.com', ...]
```

---

### PASO 4: Verificar que el Backend está Accesible (2 min)

**Prueba 1: Health Check**
```bash
curl https://befitapi.store/health
```

**Debe retornar:**
```json
{"status":"healthy","version":"1.0.0"}
```

**Prueba 2: Productos (sin autenticación)**
```bash
curl https://befitapi.store/api/v1/search?page=1&limit=4&is_active=true
```

**Debe retornar JSON con productos.**

**Si alguna de estas falla:**
- El backend no está corriendo, O
- El dominio `befitapi.store` no apunta al servidor correcto

---

### PASO 5: Verificar desde Amplify (5 min)

**Después de re-desplegar:**

1. **Abrir tu sitio de Amplify:**
   ```
   https://frontend.d34s9corpodswj.amplifyapp.com
   ```

2. **Abrir DevTools (F12)**

3. **Ir a la pestaña "Console"**

4. **Ejecutar:**
   ```javascript
   console.log(import.meta.env.VITE_API_BASE)
   ```

   **Debe mostrar:**
   ```
   https://befitapi.store
   ```

   **Si muestra `undefined`:**
   - La variable NO se configuró bien en Amplify
   - Repite el Paso 1

5. **Probar conexión al backend:**
   ```javascript
   fetch('https://befitapi.store/health')
     .then(r => r.json())
     .then(console.log)
   ```

   **Debe mostrar:**
   ```json
   {status: "healthy", version: "1.0.0"}
   ```

   **Si ves error de CORS:**
   ```
   Access to fetch at 'https://befitapi.store...' from origin 'https://frontend.d34s9corpodswj.amplifyapp.com'
   has been blocked by CORS policy
   ```
   → **SOLUCIÓN:** El Paso 2 no está bien configurado

6. **Probar login/productos:**
   - Intenta navegar por la página
   - Verifica que los productos se carguen
   - Verifica que puedas hacer login

---

## 🔍 DIAGNÓSTICO: ¿Qué URL de Amplify tienes?

**Opciones comunes:**

1. **URL del branch main:**
   ```
   https://main.d34s9corpodswj.amplifyapp.com
   ```

2. **URL del deployment (la que me diste):**
   ```
   https://frontend.d34s9corpodswj.amplifyapp.com
   ```

3. **URL custom:**
   ```
   https://tu-dominio-custom.com
   ```

**IMPORTANTE:** Usa la URL que aparece en Amplify Console → Domain management

---

## 🐛 TROUBLESHOOTING

### Error 1: CORS Policy

**Error en consola:**
```
Access to fetch at 'https://befitapi.store/api/v1/...' from origin 'https://frontend.d34s9corpodswj.amplifyapp.com'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**Causa:** El backend NO tiene tu URL de Amplify en CORS

**Solución:**
1. Verificar `Backend/.env` línea de `BACKEND_CORS_ORIGINS`
2. La URL debe ser EXACTA (copiar desde Amplify Console)
3. Reiniciar el backend
4. Verificar logs: `CORS Origins configurados: [...]`

---

### Error 2: import.meta.env.VITE_API_BASE es undefined

**Síntoma:** En la consola del navegador sale `undefined`

**Causa:** Variable no configurada en Amplify

**Solución:**
1. Ir a Amplify → Environment variables
2. Agregar `VITE_API_BASE=https://befitapi.store`
3. **IMPORTANTE:** Re-desplegar (no se aplica automáticamente)
4. Esperar a que termine el build
5. Verificar de nuevo en consola

---

### Error 3: Failed to fetch (sin mensaje de CORS)

**Síntoma:** Solo dice "Failed to fetch" sin más detalles

**Causa:** El backend no está accesible O problemas de SSL

**Solución:**
1. Verificar que `curl https://befitapi.store/health` funcione
2. Verificar que el dominio resuelva: `nslookup befitapi.store`
3. Verificar certificado SSL en el navegador
4. Verificar que el backend esté corriendo

---

### Error 4: El build de Amplify falla

**Síntoma:** El deployment en Amplify no termina

**Causa:** Errores de compilación

**Solución:**
1. Ver logs en Amplify → Deployments → Ver log completo
2. Buscar líneas rojas con errores
3. Corregir errores en el código
4. Push nuevo commit

---

## 📋 CHECKLIST FINAL

### Backend:
- [ ] `BACKEND_CORS_ORIGINS` tiene la URL de Amplify
- [ ] Backend reiniciado
- [ ] Logs muestran: `CORS Origins configurados: [...]`
- [ ] `curl https://befitapi.store/health` funciona
- [ ] `curl https://befitapi.store/api/v1/search?page=1&limit=4` funciona

### Amplify:
- [ ] Variable `VITE_API_BASE` agregada
- [ ] Variable `VITE_STRIPE_PUBLIC_KEY` agregada
- [ ] Aplicación re-desplegada
- [ ] Build terminó exitosamente
- [ ] Sitio accesible

### Verificación en el Navegador:
- [ ] `console.log(import.meta.env.VITE_API_BASE)` muestra `https://befitapi.store`
- [ ] No hay errores de CORS en consola
- [ ] `fetch('https://befitapi.store/health')` funciona
- [ ] Los productos se cargan
- [ ] Puedes hacer login
- [ ] El carrito funciona

---

## 🎯 RESUMEN

**El problema es configuración de deployment, NO de código.**

Tu código está 100% correcto. Solo necesitas:

1. **En Amplify:** Agregar variable `VITE_API_BASE`
2. **En Backend:** Verificar CORS
3. **Re-desplegar** ambos

**Tiempo total:** 15 minutos

---

## 📞 Si Aún No Funciona

**Comparte:**
1. URL exacta de tu Amplify
2. Screenshot de las variables de entorno en Amplify
3. Contenido de `BACKEND_CORS_ORIGINS` en tu `.env`
4. Error EXACTO de la consola del navegador (F12)
5. Resultado de `curl https://befitapi.store/health`
