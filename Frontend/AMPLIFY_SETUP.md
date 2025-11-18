# Guía de Configuración AWS Amplify para BeFit Frontend

## 🔧 Solución al Error de `npm ci`

El error que viste:
```
npm error The `npm ci` command can only install with an existing package-lock.json
```

**✅ YA ESTÁ SOLUCIONADO**

Hemos agregado el archivo `package-lock.json` al repositorio en el último commit. AWS Amplify ahora podrá ejecutar `npm ci` sin problemas.

---

## 📋 Pasos para Desplegar en AWS Amplify

### 1. Acceder a AWS Amplify Console

1. Inicia sesión en [AWS Console](https://console.aws.amazon.com)
2. Busca "Amplify" en el buscador de servicios
3. Haz clic en "New app" → "Host web app"

### 2. Conectar tu Repositorio de GitHub

1. Selecciona "GitHub" como proveedor
2. Autoriza AWS Amplify para acceder a tu cuenta de GitHub
3. Selecciona tu repositorio: `LuisFlores223046/paracalar2`
4. Selecciona la rama: `claude/ecommerce-backend-01Yc5BGwbeBfa9QdNSd8yYKH`

### 3. Configurar Build Settings

Amplify detectará automáticamente el archivo `amplify.yml` en el directorio `Frontend/`.

**El archivo ya está configurado correctamente:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci          # ✅ Ahora funcionará con package-lock.json
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

**IMPORTANTE:** En "App build specification", asegúrate de que el "Build directory" esté configurado como `Frontend`.

### 4. Configurar Variables de Entorno

Antes de desplegar, debes configurar las siguientes variables de entorno en Amplify:

1. En la consola de Amplify, ve a "Environment variables" en el menú lateral
2. Agrega las siguientes variables:

| Variable | Valor de Ejemplo | Descripción |
|----------|------------------|-------------|
| `VITE_API_BASE_URL` | `https://api.befit.com/api/v1` | URL de tu backend FastAPI |
| `VITE_COGNITO_REGION` | `us-east-1` | Región de AWS Cognito |
| `VITE_COGNITO_USER_POOL_ID` | `us-east-1_xxxxxxxxx` | ID del User Pool de Cognito |
| `VITE_COGNITO_CLIENT_ID` | `xxxxxxxxxxxxxxxxxxxx` | Client ID de Cognito |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_xxxxxxxxxx` | Publishable Key de Stripe |
| `VITE_PAYPAL_CLIENT_ID` | `xxxxxxxxxxxxxxxxxxxx` | Client ID de PayPal |
| `VITE_APP_URL` | `https://main.xxxxxx.amplifyapp.com` | URL de tu app en Amplify |

**Nota:** Usa las claves de **test/sandbox** primero para probar.

### 5. Configuraciones Avanzadas (Opcional pero Recomendado)

#### A. Configurar el directorio raíz del build:
- En "Build settings" → "Edit"
- Asegúrate de que:
  - **Monorepo root**: `Frontend`
  - **Build command**: `npm run build`
  - **Base directory**: `Frontend`

#### B. Habilitar Auto-Deploy:
- Ve a "Build settings"
- Activa "Auto-deploy" para que se actualice automáticamente con cada push

#### C. Configurar dominios personalizados (Opcional):
- Ve a "Domain management"
- Agrega tu dominio personalizado si tienes uno

### 6. Iniciar el Deploy

1. Haz clic en "Save and deploy"
2. Amplify comenzará a:
   - ✅ Clonar el repositorio
   - ✅ Ejecutar `npm ci` (ahora funcionará)
   - ✅ Ejecutar `npm run build`
   - ✅ Desplegar a CDN
3. Espera 3-5 minutos

### 7. Verificar el Deploy

Una vez completado:
1. Verás un mensaje "Deployment successfully completed"
2. Amplify te dará una URL como: `https://main.d13l5cs0cwfyyr.amplifyapp.com`
3. Visita la URL para verificar que funciona

---

## 🔍 Troubleshooting

### Error: "npm ci can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync"

**Solución:**
Este error ya no debería ocurrir porque acabamos de actualizar y sincronizar ambos archivos. Si aún ocurre:
```bash
cd Frontend
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### Error: "Module not found" durante el build

**Solución:**
Verifica que todas las variables de entorno estén configuradas correctamente en Amplify.

### Error de CORS en producción

**Solución:**
Asegúrate de que tu backend FastAPI tenga configurado CORS para permitir requests desde tu dominio de Amplify:
```python
# Backend/app/main.py
origins = [
    "http://localhost:3000",
    "https://main.d13l5cs0cwfyyr.amplifyapp.com",  # Tu URL de Amplify
]
```

### Las variables de entorno no se leen

**Problema:** En Vite, las variables deben empezar con `VITE_`

**Solución:**
Todas nuestras variables ya tienen el prefijo `VITE_`, así que deberían funcionar. Si no:
1. Verifica que las agregaste en Amplify Console
2. Redeploy la app después de agregar las variables

---

## 📝 Checklist Pre-Deploy

Antes de hacer el deploy final a producción, verifica:

- [ ] ✅ `package-lock.json` está en el repositorio
- [ ] ✅ Todas las variables de entorno están configuradas en Amplify
- [ ] ✅ Backend API está desplegado y accesible
- [ ] ✅ CORS está configurado en el backend
- [ ] ✅ Cognito User Pool está creado
- [ ] ✅ Stripe/PayPal están configurados
- [ ] ✅ S3 bucket para imágenes está creado
- [ ] ✅ Has probado el login local

---

## 🚀 Comandos Útiles

### Para desarrollo local:
```bash
cd Frontend
npm install
npm run dev        # Servidor de desarrollo en http://localhost:3000
```

### Para probar el build de producción localmente:
```bash
npm run build      # Genera build en dist/
npm run preview    # Preview del build en http://localhost:4173
```

### Para limpiar y reinstalar:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 URLs Importantes

Una vez desplegado, tendrás:

- **App URL**: `https://main.d13l5cs0cwfyyr.amplifyapp.com`
- **Amplify Console**: Para ver logs y métricas
- **CloudWatch**: Para logs detallados si algo falla

---

## ⚙️ Configuración del Backend

Para que el frontend funcione correctamente, asegúrate de que tu backend FastAPI esté:

1. **Desplegado** en AWS EC2 o similar
2. **Accesible** vía HTTPS (usa ALB + SSL)
3. **CORS configurado** para permitir tu dominio de Amplify
4. **Variables de entorno** configuradas:
   - AWS Cognito credentials
   - Stripe/PayPal keys
   - S3 bucket info

---

## 🎉 ¡Listo!

Tu aplicación BeFit Frontend estará desplegada y funcionando en AWS Amplify.

**Próximos pasos:**
1. Configura el backend en EC2
2. Conecta el dominio personalizado
3. Configura SSL/HTTPS
4. Habilita monitoring y alertas
5. ¡Lanza tu app! 🚀

---

**Última actualización:** 2025-11-18
**Estado:** ✅ Listo para deploy
