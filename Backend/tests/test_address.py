# Autor: Luis Flores
# Fecha: 17/11/2025
# Descripción: Archivo de pruebas para el módulo de direcciones. Incluye pruebas
#             unitarias, integrales y funcionales para operaciones de direcciones.

import pytest
from sqlalchemy.orm import Session
from app.api.v1.address.service import address_service
from app.api.v1.address import schemas
from app.models.address import Address
from app.models.user import User


# ==================== PRUEBAS UNITARIAS ====================

class TestAddressServiceUnit:
    """
    Autor: Luis Flores
    Descripción: Clase que agrupa las pruebas unitarias del servicio de direcciones.
    """

    def test_create_address(self, db: Session, test_user: User):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para crear una dirección.
        Parámetros:
            db (Session): Sesión de base de datos de prueba.
            test_user (User): Usuario de prueba.
        """
        # Arrange
        address_data = schemas.CreateAddressRequest(
            address_name="Oficina",
            address_line1="Av. Principal 456",
            address_line2="Piso 3",
            country="México",
            state="Chihuahua",
            city="Chihuahua",
            zip_code="31000",
            recipient_name="Test User",
            phone_number="9876543210",
            is_default=False
        )

        # Act
        address = address_service.create_address(db=db, user_id=test_user.user_id, address_data=address_data)

        # Assert
        assert address.address_id is not None
        assert address.user_id == test_user.user_id
        assert address.address_name == "Oficina"
        assert address.city == "Chihuahua"

    def test_get_user_addresses(self, db: Session, test_user: User):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para obtener direcciones de un usuario.
        Parámetros:
            db (Session): Sesión de base de datos de prueba.
            test_user (User): Usuario de prueba.
        """
        # Arrange
        address1 = Address(
            user_id=test_user.user_id,
            address_name="Casa",
            address_line1="Calle 1",
            country="México",
            state="Chihuahua",
            city="Juárez",
            zip_code="32000",
            recipient_name="Test",
            phone_number="1234567890",
            is_default=True
        )
        address2 = Address(
            user_id=test_user.user_id,
            address_name="Trabajo",
            address_line1="Calle 2",
            country="México",
            state="Chihuahua",
            city="Juárez",
            zip_code="32001",
            recipient_name="Test",
            phone_number="1234567890",
            is_default=False
        )
        db.add_all([address1, address2])
        db.commit()

        # Act
        addresses = address_service.get_user_addresses(db=db, user_id=test_user.user_id)

        # Assert
        assert len(addresses) >= 2

    def test_update_address(self, db: Session, test_user: User):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para actualizar una dirección.
        Parámetros:
            db (Session): Sesión de base de datos de prueba.
            test_user (User): Usuario de prueba.
        """
        # Arrange
        address = Address(
            user_id=test_user.user_id,
            address_name="Original",
            address_line1="Calle Original",
            country="México",
            state="Chihuahua",
            city="Juárez",
            zip_code="32000",
            recipient_name="Test",
            phone_number="1234567890",
            is_default=True
        )
        db.add(address)
        db.commit()
        db.refresh(address)

        update_data = schemas.UpdateAddressRequest(
            address_name="Actualizada",
            city="Chihuahua"
        )

        # Act
        updated = address_service.update_address(
            db=db, address_id=address.address_id, user_id=test_user.user_id, address_data=update_data
        )

        # Assert
        assert updated.address_name == "Actualizada"
        assert updated.city == "Chihuahua"

    def test_delete_address(self, db: Session, test_user: User):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para eliminar una dirección.
        Parámetros:
            db (Session): Sesión de base de datos de prueba.
            test_user (User): Usuario de prueba.
        """
        # Arrange
        address = Address(
            user_id=test_user.user_id,
            address_name="Para eliminar",
            address_line1="Calle Temp",
            country="México",
            state="Chihuahua",
            city="Juárez",
            zip_code="32000",
            recipient_name="Test",
            phone_number="1234567890",
            is_default=False
        )
        db.add(address)
        db.commit()
        address_id = address.address_id

        # Act
        result = address_service.delete_address(db=db, address_id=address_id, user_id=test_user.user_id)

        # Assert
        assert result is True
        deleted = db.query(Address).filter(Address.address_id == address_id).first()
        assert deleted is None

    def test_set_default_address(self, db: Session, test_user: User):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para establecer dirección por defecto.
        Parámetros:
            db (Session): Sesión de base de datos de prueba.
            test_user (User): Usuario de prueba.
        """
        # Arrange
        address1 = Address(
            user_id=test_user.user_id,
            address_name="Dirección 1",
            address_line1="Calle 1",
            country="México",
            state="Chihuahua",
            city="Juárez",
            zip_code="32000",
            recipient_name="Test",
            phone_number="1234567890",
            is_default=True
        )
        address2 = Address(
            user_id=test_user.user_id,
            address_name="Dirección 2",
            address_line1="Calle 2",
            country="México",
            state="Chihuahua",
            city="Juárez",
            zip_code="32001",
            recipient_name="Test",
            phone_number="1234567890",
            is_default=False
        )
        db.add_all([address1, address2])
        db.commit()

        # Act
        address_service.set_default_address(db=db, address_id=address2.address_id, user_id=test_user.user_id)

        # Assert
        db.refresh(address1)
        db.refresh(address2)
        assert address1.is_default is False
        assert address2.is_default is True


# ==================== PRUEBAS DE INTEGRACIÓN ====================

class TestAddressAPIIntegration:
    """
    Autor: Luis Flores
    Descripción: Clase que agrupa las pruebas de integración de la API de direcciones.
    """

    def test_create_address_endpoint(self, user_client, test_user):
        """
        Autor: Luis Flores
        Descripción: Prueba de integración para crear dirección via API.
        Parámetros:
            user_client (TestClient): Cliente HTTP autenticado.
            test_user (User): Usuario de prueba.
        """
        # Arrange
        address_data = {
            "address_name": "Casa Nueva",
            "address_line1": "Nueva Calle 123",
            "country": "México",
            "state": "Chihuahua",
            "city": "Juárez",
            "zip_code": "32000",
            "recipient_name": "Test User",
            "phone_number": "1234567890",
            "is_default": True
        }

        # Act
        response = user_client.post("/api/v1/address/", json=address_data)

        # Assert
        assert response.status_code in [200, 201]
        data = response.json()
        assert data["address_name"] == "Casa Nueva"

    def test_get_addresses_endpoint(self, user_client, db, test_user):
        """
        Autor: Luis Flores
        Descripción: Prueba de integración para obtener direcciones via API.
        Parámetros:
            user_client (TestClient): Cliente HTTP autenticado.
            db (Session): Sesión de base de datos.
            test_user (User): Usuario de prueba.
        """
        # Arrange
        address = Address(
            user_id=test_user.user_id,
            address_name="Test Address",
            address_line1="Test Street",
            country="México",
            state="Chihuahua",
            city="Juárez",
            zip_code="32000",
            recipient_name="Test",
            phone_number="1234567890",
            is_default=True
        )
        db.add(address)
        db.commit()

        # Act
        response = user_client.get("/api/v1/address/")

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1


# ==================== PRUEBAS FUNCIONALES ====================

class TestAddressFunctional:
    """
    Autor: Luis Flores
    Descripción: Clase que agrupa las pruebas funcionales end-to-end de direcciones.
    """

    def test_address_management_flow(self, db, test_user):
        """
        Autor: Luis Flores
        Descripción: Prueba funcional del flujo completo de gestión de direcciones:
                     crear, listar, actualizar, cambiar default, eliminar.
        Parámetros:
            db (Session): Sesión de base de datos.
            test_user (User): Usuario de prueba.
        """
        # Paso 1: Crear primera dirección
        address1_data = schemas.CreateAddressRequest(
            address_name="Casa",
            address_line1="Calle 1",
            country="México",
            state="Chihuahua",
            city="Juárez",
            zip_code="32000",
            recipient_name="Test",
            phone_number="1234567890",
            is_default=True
        )
        address1 = address_service.create_address(db=db, user_id=test_user.user_id, address_data=address1_data)
        assert address1.is_default is True

        # Paso 2: Crear segunda dirección
        address2_data = schemas.CreateAddressRequest(
            address_name="Trabajo",
            address_line1="Calle 2",
            country="México",
            state="Chihuahua",
            city="Chihuahua",
            zip_code="31000",
            recipient_name="Test",
            phone_number="9876543210",
            is_default=False
        )
        address2 = address_service.create_address(db=db, user_id=test_user.user_id, address_data=address2_data)

        # Paso 3: Listar direcciones
        addresses = address_service.get_user_addresses(db=db, user_id=test_user.user_id)
        assert len(addresses) == 2

        # Paso 4: Actualizar segunda dirección
        update_data = schemas.UpdateAddressRequest(address_name="Oficina")
        updated = address_service.update_address(
            db=db, address_id=address2.address_id, user_id=test_user.user_id, address_data=update_data
        )
        assert updated.address_name == "Oficina"

        # Paso 5: Cambiar dirección por defecto
        address_service.set_default_address(db=db, address_id=address2.address_id, user_id=test_user.user_id)
        db.refresh(address1)
        db.refresh(address2)
        assert address2.is_default is True
        assert address1.is_default is False

        # Paso 6: Eliminar primera dirección
        address_service.delete_address(db=db, address_id=address1.address_id, user_id=test_user.user_id)
        remaining = address_service.get_user_addresses(db=db, user_id=test_user.user_id)
        assert len(remaining) == 1

        print("✅ Prueba funcional de gestión de direcciones completada")
