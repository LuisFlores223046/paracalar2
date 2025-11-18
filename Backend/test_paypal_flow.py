#!/usr/bin/env python3
"""
Script de Prueba para PayPal Checkout
Autor: Claude
Fecha: 2025-11-18
Descripción: Prueba el flujo completo de pago con PayPal Sandbox
"""
import httpx
import asyncio
import json
from datetime import date, timedelta
from decimal import Decimal

# Configuración
API_BASE_URL = "http://localhost:8000"
PAYPAL_SANDBOX_URL = "https://www.sandbox.paypal.com"

# Colores para la terminal
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_step(step_num, message):
    """Imprime un paso del proceso"""
    print(f"\n{Colors.BOLD}📍 Paso {step_num}: {message}{Colors.ENDC}")
    print("-" * 70)

def print_success(message):
    """Imprime mensaje de éxito"""
    print(f"{Colors.OKGREEN}✅ {message}{Colors.ENDC}")

def print_error(message):
    """Imprime mensaje de error"""
    print(f"{Colors.FAIL}❌ {message}{Colors.ENDC}")

def print_info(message):
    """Imprime información"""
    print(f"{Colors.OKCYAN}ℹ️  {message}{Colors.ENDC}")

def print_warning(message):
    """Imprime advertencia"""
    print(f"{Colors.WARNING}⚠️  {message}{Colors.ENDC}")


async def create_test_user(client):
    """Crea un usuario de prueba"""
    print_step(1, "Crear Usuario de Prueba")

    # Datos del usuario como formulario (multipart/form-data)
    user_data = {
        "email": "testpaypal@befit.com",
        "password": "TestPayPal123!",
        "first_name": "Test",
        "last_name": "PayPal",
        "gender": "M",
        "birth_date": "1990-01-01"
    }

    try:
        # Intentar registrar (puede fallar si ya existe)
        response = await client.post(
            f"{API_BASE_URL}/api/v1/auth/signup",
            data=user_data  # Usar 'data' en vez de 'json' para form-data
        )

        if response.status_code == 201:
            print_success("Usuario creado exitosamente")
            print_warning("IMPORTANTE: Debes confirmar el email en AWS Cognito Console")
            print_info("Ve a: AWS Console → Cognito → Users → testpaypal@befit.com → Confirm")
            input("Presiona ENTER después de confirmar el usuario en Cognito...")
            return True
        elif response.status_code == 400:
            error_detail = response.json().get("detail", "")
            if "already exists" in error_detail.lower() or "user already exist" in error_detail.lower():
                print_info("Usuario ya existe, continuando con login...")
                return True
            else:
                print_error(f"Error: {error_detail}")
                return False
        else:
            print_error(f"Error ({response.status_code}): {response.text}")
            return False

    except Exception as e:
        print_error(f"Error creando usuario: {str(e)}")
        return False


async def login_user(client):
    """Inicia sesión y obtiene el token"""
    print_step(2, "Login de Usuario")

    login_data = {
        "email": "testpaypal@befit.com",
        "password": "TestPayPal123!"
    }

    try:
        response = await client.post(
            f"{API_BASE_URL}/api/v1/auth/login",
            json=login_data
        )

        if response.status_code == 200:
            data = response.json()
            access_token = data.get("access_token")
            print_success("Login exitoso")
            print_info(f"Token: {access_token[:30]}...")
            return access_token
        else:
            print_error(f"Error en login: {response.text}")
            return None

    except Exception as e:
        print_error(f"Error en login: {str(e)}")
        return None


async def create_address(client, token):
    """Crea una dirección de envío"""
    print_step(3, "Crear Dirección de Envío")

    address_data = {
        "address_line1": "Av. Reforma 123",
        "address_line2": "Col. Centro",
        "city": "Ciudad de México",
        "state": "CDMX",
        "zip_code": "06000",
        "country": "México",
        "recipient_name": "Test PayPal",
        "phone_number": "5512345678",
        "is_default": True
    }

    headers = {"Authorization": f"Bearer {token}"}

    try:
        response = await client.post(
            f"{API_BASE_URL}/api/v1/addresses",
            json=address_data,
            headers=headers
        )

        if response.status_code == 201:
            data = response.json()
            address_id = data.get("address_id")
            print_success(f"Dirección creada: ID {address_id}")
            return address_id
        else:
            print_error(f"Error: {response.text}")
            return None

    except Exception as e:
        print_error(f"Error: {str(e)}")
        return None


async def add_products_to_cart(client, token):
    """Agrega productos al carrito"""
    print_step(4, "Agregar Productos al Carrito")

    headers = {"Authorization": f"Bearer {token}"}

    # Productos a agregar (IDs de los productos creados con seed_data.py)
    products_to_add = [
        {"product_id": 1, "quantity": 2},  # Whey Protein
        {"product_id": 5, "quantity": 1},  # C4 Pre-Workout
        {"product_id": 9, "quantity": 1}   # Creatine
    ]

    try:
        for product in products_to_add:
            response = await client.post(
                f"{API_BASE_URL}/api/v1/cart/add",
                json=product,
                headers=headers
            )

            if response.status_code == 201:
                print_success(f"Producto {product['product_id']} agregado (x{product['quantity']})")
            else:
                print_warning(f"Producto {product['product_id']}: {response.text}")

        # Obtener resumen del carrito
        response = await client.get(
            f"{API_BASE_URL}/api/v1/cart/summary",
            headers=headers
        )

        if response.status_code == 200:
            summary = response.json()
            print_info(f"Subtotal: ${summary.get('subtotal', 0)}")
            print_info(f"Items: {summary.get('items_count', 0)}")
            return True

        return False

    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


async def get_checkout_summary(client, token, address_id):
    """Obtiene el resumen del checkout"""
    print_step(5, "Obtener Resumen de Checkout")

    headers = {"Authorization": f"Bearer {token}"}
    summary_data = {
        "address_id": address_id
        # Sin cupón - los cupones deben estar asignados al usuario primero
    }

    try:
        response = await client.post(
            f"{API_BASE_URL}/api/v1/checkout/summary",
            json=summary_data,
            headers=headers
        )

        if response.status_code == 200:
            summary = response.json()
            print_success("Resumen calculado:")
            print(f"  💰 Subtotal: ${summary.get('subtotal', 0)}")
            print(f"  🚚 Envío: ${summary.get('shipping_cost', 0)}")
            print(f"  🎟️  Descuento: ${summary.get('discount_amount', 0)}")
            print(f"  💳 Total: ${summary.get('total_amount', 0)}")
            print(f"  ⭐ Puntos a ganar: {summary.get('points_to_earn', 0)}")
            return summary
        else:
            print_error(f"Error: {response.text}")
            return None

    except Exception as e:
        print_error(f"Error: {str(e)}")
        return None


async def initialize_paypal_checkout(client, token, address_id):
    """Inicializa el checkout de PayPal"""
    print_step(6, "Inicializar Checkout de PayPal")

    headers = {"Authorization": f"Bearer {token}"}
    paypal_data = {
        "address_id": address_id
        # Sin cupón - los cupones deben estar asignados al usuario primero
    }

    try:
        response = await client.post(
            f"{API_BASE_URL}/api/v1/checkout/paypal/init",
            json=paypal_data,
            headers=headers
        )

        if response.status_code == 200:
            data = response.json()
            paypal_order_id = data.get("paypal_order_id")
            approval_url = data.get("paypal_approval_url")

            print_success("PayPal Order creada!")
            print_info(f"Order ID: {paypal_order_id}")
            print_info(f"Approval URL: {approval_url}")

            print("\n" + "=" * 70)
            print_warning("ACCIÓN REQUERIDA:")
            print(f"1. Abre esta URL en tu navegador:\n   {approval_url}")
            print(f"\n2. Inicia sesión con tu cuenta PayPal Sandbox:")
            print(f"   Email: sb-buyer@personal.example.com (o la que creaste)")
            print(f"   Password: Tu contraseña de sandbox")
            print(f"\n3. Aprueba el pago")
            print(f"\n4. Serás redirigido a: {data.get('return_url', 'N/A')}")
            print("=" * 70)

            approved = input("\n¿Aprobaste el pago en PayPal? (s/n): ").lower()

            if approved == 's':
                return paypal_order_id
            else:
                print_warning("Pago cancelado por el usuario")
                return None
        else:
            print_error(f"Error: {response.text}")
            return None

    except Exception as e:
        print_error(f"Error: {str(e)}")
        return None


async def capture_paypal_payment(client, token, paypal_order_id, address_id):
    """Captura el pago de PayPal"""
    print_step(7, "Capturar Pago de PayPal")

    headers = {"Authorization": f"Bearer {token}"}
    capture_data = {
        "paypal_order_id": paypal_order_id,
        "address_id": address_id
        # Sin cupón - los cupones deben estar asignados al usuario primero
    }

    try:
        response = await client.post(
            f"{API_BASE_URL}/api/v1/checkout/paypal/capture",
            json=capture_data,
            headers=headers
        )

        if response.status_code == 200:
            data = response.json()
            print_success("¡Pago capturado exitosamente!")
            print_info(f"Order ID: {data.get('order_id')}")
            print_info(f"Total pagado: ${data.get('total_amount', 0)}")
            print_info(f"Puntos ganados: {data.get('points_earned', 0)}")
            return True
        else:
            print_error(f"Error capturando pago: {response.text}")
            return False

    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False


async def main():
    """Función principal"""
    print("\n" + "=" * 70)
    print(f"{Colors.BOLD}🧪 PRUEBA DE INTEGRACIÓN PAYPAL - BeFit API{Colors.ENDC}")
    print("=" * 70)

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Paso 1: Crear usuario
        if not await create_test_user(client):
            print_error("No se pudo crear/obtener usuario. Abortando...")
            return

        # Paso 2: Login
        token = await login_user(client)
        if not token:
            print_error("No se pudo iniciar sesión. Abortando...")
            return

        # Paso 3: Crear dirección
        address_id = await create_address(client, token)
        if not address_id:
            print_error("No se pudo crear dirección. Abortando...")
            return

        # Paso 4: Agregar productos al carrito
        if not await add_products_to_cart(client, token):
            print_error("No se pudieron agregar productos. Abortando...")
            return

        # Paso 5: Obtener resumen
        summary = await get_checkout_summary(client, token, address_id)
        if not summary:
            print_error("No se pudo obtener resumen. Abortando...")
            return

        # Paso 6: Inicializar PayPal
        paypal_order_id = await initialize_paypal_checkout(client, token, address_id)
        if not paypal_order_id:
            print_warning("Checkout cancelado")
            return

        # Paso 7: Capturar pago
        if await capture_paypal_payment(client, token, paypal_order_id, address_id):
            print("\n" + "=" * 70)
            print_success("PRUEBA COMPLETADA EXITOSAMENTE! 🎉")
            print("=" * 70)
            print_info("Puedes verificar la orden en:")
            print_info("  • pgAdmin4: SELECT * FROM \"order\" ORDER BY order_id DESC;")
            print_info("  • Swagger UI: http://localhost:8000/docs")
        else:
            print_error("No se pudo completar la prueba")


if __name__ == "__main__":
    print_info("Asegúrate de que:")
    print("  1. El servidor esté corriendo: uvicorn app.main:app --reload")
    print("  2. Tengas productos en la BD: python seed_data.py")
    print("  3. Tengas cuenta PayPal Sandbox configurada")

    proceed = input("\n¿Continuar? (s/n): ").lower()
    if proceed == 's':
        asyncio.run(main())
    else:
        print_warning("Prueba cancelada")
