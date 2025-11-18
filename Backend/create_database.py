#!/usr/bin/env python3

"""

Script para crear la base de datos 'befit' en RDS

Autor: Claude

Fecha: 2025-11-18

"""

import psycopg2

from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

import os

from dotenv import load_dotenv

 

load_dotenv()

 

def create_befit_database():

    """Crea la base de datos 'befit' en RDS si no existe"""

 

    # Extraer credenciales del DATABASE_URL

    DATABASE_URL = os.getenv("DATABASE_URL")

 

    # Parsear la URL para obtener las partes

    # postgresql://usuario:contraseña@host:puerto/database

    parts = DATABASE_URL.replace("postgresql://", "").split("@")

    user_pass = parts[0].split(":")

    host_db = parts[1].split("/")

    host_port = host_db[0].split(":")

 

    user = user_pass[0]

    password = user_pass[1]

    host = host_port[0]

    port = host_port[1] if len(host_port) > 1 else "5432"

    target_db = host_db[1]

 

    print("=" * 70)

    print("CREAR BASE DE DATOS EN AMAZON RDS")

    print("=" * 70)

    print(f"🔧 Host: {host}")

    print(f"👤 Usuario: {user}")

    print(f"💾 Base de datos a crear: {target_db}")

    print("-" * 70)

 

    try:

        # Conectar a la base de datos 'postgres' (por defecto siempre existe)

        print("\n🔄 Conectando a base de datos 'postgres'...")

        conn = psycopg2.connect(

            host=host,

            port=port,

            user=user,

            password=password,

            database="postgres"  # Conectar a la BD por defecto

        )

 

        # Cambiar a modo autocommit (necesario para CREATE DATABASE)

        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)

        cursor = conn.cursor()

 

        # Verificar si la base de datos ya existe

        print(f"🔍 Verificando si '{target_db}' existe...")

        cursor.execute(

            "SELECT 1 FROM pg_database WHERE datname = %s",

            (target_db,)

        )

        exists = cursor.fetchone()

 

        if exists:

            print(f"✅ La base de datos '{target_db}' ya existe")

        else:

            # Crear la base de datos

            print(f"🔄 Creando base de datos '{target_db}'...")

            cursor.execute(f'CREATE DATABASE "{target_db}"')

            print(f"✅ Base de datos '{target_db}' creada exitosamente!")

 

        # Listar todas las bases de datos

        cursor.execute("""

            SELECT datname FROM pg_database

            WHERE datistemplate = false

            ORDER BY datname;

        """)

        databases = cursor.fetchall()

 

        print("\n📋 Bases de datos en RDS:")

        for db in databases:

            marker = "✓" if db[0] == target_db else " "

            print(f"  [{marker}] {db[0]}")

 

        cursor.close()

        conn.close()

 

        print("\n" + "=" * 70)

        print("✅ PROCESO COMPLETADO")

        print("=" * 70)

        print(f"Ahora puedes ejecutar: alembic upgrade head")

        print("Para crear las tablas en la base de datos '{target_db}'")

 

        return True

 

    except psycopg2.OperationalError as e:

        print(f"\n❌ ERROR DE CONEXIÓN:")

        print(f"   {str(e)}")

        print("\n🔍 Posibles causas:")

        print("  1. Contraseña incorrecta")

        print("  2. Security Group no permite tu IP")

        print("  3. RDS no está disponible")

        return False

 

    except Exception as e:

        print(f"\n❌ ERROR:")

        print(f"   {str(e)}")

        return False

 

if __name__ == "__main__":

    success = create_befit_database()

    exit(0 if success else 1)