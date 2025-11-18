#!/usr/bin/env python3

"""

Script para probar la conexión a Amazon RDS

Autor: Claude

Fecha: 2025-11-18

Descripción: Verifica que la conexión a PostgreSQL RDS esté funcionando correctamente

"""

from sqlalchemy import create_engine, text

import os

from dotenv import load_dotenv

 

# Cargar variables de entorno

load_dotenv()

 

def test_rds_connection():

    """Prueba la conexión a RDS y muestra información del servidor"""

    DATABASE_URL = os.getenv("DATABASE_URL")

 

    if not DATABASE_URL:

        print("❌ ERROR: DATABASE_URL no encontrada en .env")

        return False

 

    # Mostrar información de conexión (parcial por seguridad)

    endpoint = DATABASE_URL.split("@")[1].split("/")[0] if "@" in DATABASE_URL else "desconocido"

    db_name = DATABASE_URL.split("/")[-1] if "/" in DATABASE_URL else "desconocido"

 

    print("=" * 60)

    print("PRUEBA DE CONEXIÓN A AMAZON RDS")

    print("=" * 60)

    print(f"📍 Endpoint: {endpoint}")

    print(f"💾 Base de datos: {db_name}")

    print(f"🔧 Driver: PostgreSQL (psycopg2)")

    print("-" * 60)

 

    try:

        # Crear engine de SQLAlchemy

        print("🔄 Creando engine de SQLAlchemy...")

        engine = create_engine(DATABASE_URL, echo=False)

 

        # Probar conexión

        print("🔄 Probando conexión a RDS...")

        with engine.connect() as conn:

            # Obtener versión de PostgreSQL

            result = conn.execute(text("SELECT version();"))

            version = result.fetchone()[0]

 

            # Obtener fecha/hora del servidor

            result = conn.execute(text("SELECT NOW();"))

            server_time = result.fetchone()[0]

 

            # Obtener nombre de la base de datos actual

            result = conn.execute(text("SELECT current_database();"))

            current_db = result.fetchone()[0]

 

            # Listar tablas existentes

            result = conn.execute(text("""

                SELECT table_name

                FROM information_schema.tables

                WHERE table_schema = 'public'

                ORDER BY table_name;

            """))

            tables = [row[0] for row in result.fetchall()]

 

            print("\n✅ ¡CONEXIÓN EXITOSA!")

            print("=" * 60)

            print(f"📊 PostgreSQL Version:")

            print(f"   {version[:80]}...")

            print(f"\n⏰ Hora del servidor: {server_time}")

            print(f"💾 Base de datos actual: {current_db}")

            print(f"\n📋 Tablas encontradas ({len(tables)}):")

            if tables:

                for table in tables:

                    print(f"   - {table}")

            else:

                print("   (No hay tablas. Ejecuta 'alembic upgrade head' para crear el schema)")

            print("=" * 60)

 

            return True

 

    except Exception as e:

        print("\n❌ ERROR DE CONEXIÓN")

        print("=" * 60)

        print(f"Tipo de error: {type(e).__name__}")

        print(f"Mensaje: {str(e)}")

        print("\n🔍 Posibles causas:")

        print("  1. Credenciales incorrectas (usuario/contraseña)")

        print("  2. Security Group de RDS no permite tu IP")

        print("  3. RDS no está en estado 'Available'")

        print("  4. Endpoint incorrecto")

        print("  5. Base de datos no existe")

        print("\n💡 Soluciones:")

        print("  - Verifica el Security Group en AWS Console")

        print("  - Asegúrate de que RDS esté 'Available'")

        print("  - Revisa las credenciales en .env")

        print("=" * 60)

        return False

 

if __name__ == "__main__":

    success = test_rds_connection()

    exit(0 if success else 1)