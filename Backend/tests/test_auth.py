# Autor: Luis Flores
# Fecha: 17/11/2025
# Descripción: Archivo de pruebas para el módulo de autenticación. Incluye pruebas
#             unitarias, integrales y funcionales para operaciones de auth con Cognito.

import pytest
from unittest.mock import Mock, patch, MagicMock
from sqlalchemy.orm import Session
from datetime import date
from app.api.v1.auth.service import CognitoService
from app.api.v1.auth import schemas
from app.models.user import User
from app.models.enum import AuthType, UserRole, Gender
from app.core.security import hash_password, verify_password


# ==================== PRUEBAS UNITARIAS ====================

class TestCognitoServiceUnit:
    """
    Autor: Luis Flores
    Descripción: Clase que agrupa las pruebas unitarias del servicio de autenticación.
    """

    @patch('app.api.v1.auth.service.boto3.client')
    def test_sign_up_success(self, mock_boto_client, db: Session):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria que verifica el registro exitoso de un usuario.
        Parámetros:
            mock_boto_client: Mock del cliente de boto3.
            db (Session): Sesión de base de datos de prueba.
        """
        # Arrange
        mock_cognito = MagicMock()
        mock_cognito.sign_up.return_value = {
            "UserSub": "test-cognito-sub-123"
        }
        mock_boto_client.return_value = mock_cognito

        service = CognitoService()
        user_data = schemas.SignUpRequest(
            email="newuser@test.com",
            password="Test123!@#",
            first_name="New",
            last_name="User",
            gender="M",
            birth_date=date(1995, 5, 15)
        )

        # Act
        with patch('app.api.v1.auth.service.S3Service') as mock_s3:
            result = service.sign_up(db, user_data, profile_image=None)

        # Assert
        assert result["success"] is True
        assert "user_sub" in result
        assert "user_id" in result

        # Verificar que el usuario se guardó en la BD
        user = db.query(User).filter(User.email == "newuser@test.com").first()
        assert user is not None
        assert user.first_name == "New"
        assert user.last_name == "User"

    @patch('app.api.v1.auth.service.boto3.client')
    def test_sign_in_success(self, mock_boto_client):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para inicio de sesión exitoso.
        Parámetros:
            mock_boto_client: Mock del cliente de boto3.
        """
        # Arrange
        mock_cognito = MagicMock()
        mock_cognito.initiate_auth.return_value = {
            "AuthenticationResult": {
                "AccessToken": "mock-access-token",
                "IdToken": "mock-id-token",
                "RefreshToken": "mock-refresh-token",
                "ExpiresIn": 3600
            }
        }
        mock_boto_client.return_value = mock_cognito

        service = CognitoService()
        credentials = schemas.SignInRequest(
            email="test@example.com",
            password="Test123!@#"
        )

        # Act
        result = service.sign_in(credentials)

        # Assert
        assert result["success"] is True
        assert result["access_token"] == "mock-access-token"
        assert result["id_token"] == "mock-id-token"
        assert result["refresh_token"] == "mock-refresh-token"
        assert result["expires_in"] == 3600

    @patch('app.api.v1.auth.service.boto3.client')
    def test_sign_in_invalid_credentials(self, mock_boto_client):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para credenciales inválidas.
        Parámetros:
            mock_boto_client: Mock del cliente de boto3.
        """
        # Arrange
        mock_cognito = MagicMock()
        mock_cognito.initiate_auth.side_effect = Exception("NotAuthorizedException")
        mock_boto_client.return_value = mock_cognito

        service = CognitoService()
        credentials = schemas.SignInRequest(
            email="test@example.com",
            password="WrongPassword123!"
        )

        # Act
        result = service.sign_in(credentials)

        # Assert
        assert result["success"] is False
        assert "error" in result

    @patch('app.api.v1.auth.service.boto3.client')
    def test_confirm_sign_up(self, mock_boto_client):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para confirmación de registro.
        Parámetros:
            mock_boto_client: Mock del cliente de boto3.
        """
        # Arrange
        mock_cognito = MagicMock()
        mock_cognito.confirm_sign_up.return_value = {}
        mock_boto_client.return_value = mock_cognito

        service = CognitoService()
        confirm_data = schemas.ConfirmSignUpRequest(
            email="test@example.com",
            code="123456"
        )

        # Act
        result = service.confirm_sign_up(confirm_data)

        # Assert
        assert result["success"] is True
        mock_cognito.confirm_sign_up.assert_called_once()

    @patch('app.api.v1.auth.service.boto3.client')
    def test_forgot_password(self, mock_boto_client):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para solicitud de recuperación de contraseña.
        Parámetros:
            mock_boto_client: Mock del cliente de boto3.
        """
        # Arrange
        mock_cognito = MagicMock()
        mock_cognito.forgot_password.return_value = {}
        mock_boto_client.return_value = mock_cognito

        service = CognitoService()
        request_data = schemas.ForgotPasswordRequest(email="test@example.com")

        # Act
        result = service.forgot_password(request_data)

        # Assert
        assert result["success"] is True
        mock_cognito.forgot_password.assert_called_once()

    @patch('app.api.v1.auth.service.boto3.client')
    def test_refresh_token(self, mock_boto_client):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para renovación de token.
        Parámetros:
            mock_boto_client: Mock del cliente de boto3.
        """
        # Arrange
        mock_cognito = MagicMock()
        mock_cognito.initiate_auth.return_value = {
            "AuthenticationResult": {
                "AccessToken": "new-access-token",
                "IdToken": "new-id-token",
                "ExpiresIn": 3600
            }
        }
        mock_boto_client.return_value = mock_cognito

        service = CognitoService()
        refresh_data = schemas.RefreshTokenRequest(refresh_token="old-refresh-token")

        # Act
        result = service.refresh_token(refresh_data)

        # Assert
        assert result["success"] is True
        assert result["access_token"] == "new-access-token"


# ==================== PRUEBAS DE INTEGRACIÓN ====================

class TestAuthAPIIntegration:
    """
    Autor: Luis Flores
    Descripción: Clase que agrupa las pruebas de integración de la API de autenticación.
    """

    @patch('app.api.v1.auth.service.boto3.client')
    def test_signup_endpoint(self, mock_boto_client, client, db):
        """
        Autor: Luis Flores
        Descripción: Prueba de integración para endpoint de registro.
        Parámetros:
            mock_boto_client: Mock del cliente de boto3.
            client (TestClient): Cliente HTTP de prueba.
            db (Session): Sesión de base de datos.
        """
        # Arrange
        mock_cognito = MagicMock()
        mock_cognito.sign_up.return_value = {
            "UserSub": "test-sub-456"
        }
        mock_boto_client.return_value = mock_cognito

        signup_data = {
            "email": "integration@test.com",
            "password": "IntegTest123!",
            "first_name": "Integration",
            "last_name": "Test",
            "gender": "F",
            "birth_date": "1992-03-20"
        }

        # Act
        with patch('app.api.v1.auth.service.S3Service'):
            response = client.post("/api/v1/auth/signup", json=signup_data)

        # Assert
        assert response.status_code in [200, 201]
        data = response.json()
        assert data["success"] is True

    @patch('app.api.v1.auth.service.boto3.client')
    def test_signin_endpoint(self, mock_boto_client, client):
        """
        Autor: Luis Flores
        Descripción: Prueba de integración para endpoint de login.
        Parámetros:
            mock_boto_client: Mock del cliente de boto3.
            client (TestClient): Cliente HTTP de prueba.
        """
        # Arrange
        mock_cognito = MagicMock()
        mock_cognito.initiate_auth.return_value = {
            "AuthenticationResult": {
                "AccessToken": "test-access-token",
                "IdToken": "test-id-token",
                "RefreshToken": "test-refresh-token",
                "ExpiresIn": 3600
            }
        }
        mock_boto_client.return_value = mock_cognito

        signin_data = {
            "email": "test@example.com",
            "password": "Test123!@#"
        }

        # Act
        response = client.post("/api/v1/auth/signin", json=signin_data)

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data


# ==================== PRUEBAS FUNCIONALES ====================

class TestAuthFunctional:
    """
    Autor: Luis Flores
    Descripción: Clase que agrupa las pruebas funcionales end-to-end de autenticación.
    """

    @patch('app.api.v1.auth.service.boto3.client')
    def test_complete_registration_flow(self, mock_boto_client, client, db):
        """
        Autor: Luis Flores
        Descripción: Prueba funcional del flujo completo de registro:
                     registro, confirmación y primer login.
        Parámetros:
            mock_boto_client: Mock del cliente de boto3.
            client (TestClient): Cliente HTTP de prueba.
            db (Session): Sesión de base de datos.
        """
        # Arrange
        mock_cognito = MagicMock()
        mock_cognito.sign_up.return_value = {"UserSub": "flow-test-sub"}
        mock_cognito.confirm_sign_up.return_value = {}
        mock_cognito.initiate_auth.return_value = {
            "AuthenticationResult": {
                "AccessToken": "flow-access-token",
                "IdToken": "flow-id-token",
                "RefreshToken": "flow-refresh-token",
                "ExpiresIn": 3600
            }
        }
        mock_boto_client.return_value = mock_cognito

        # Paso 1: Registro
        signup_data = {
            "email": "flowtest@example.com",
            "password": "FlowTest123!",
            "first_name": "Flow",
            "last_name": "Test"
        }

        with patch('app.api.v1.auth.service.S3Service'):
            signup_response = client.post("/api/v1/auth/signup", json=signup_data)

        assert signup_response.status_code in [200, 201]
        signup_result = signup_response.json()
        assert signup_result["success"] is True

        # Paso 2: Confirmación
        confirm_data = {
            "email": "flowtest@example.com",
            "code": "123456"
        }
        confirm_response = client.post("/api/v1/auth/confirm", json=confirm_data)
        assert confirm_response.status_code == 200

        # Paso 3: Login
        signin_data = {
            "email": "flowtest@example.com",
            "password": "FlowTest123!"
        }
        signin_response = client.post("/api/v1/auth/signin", json=signin_data)
        assert signin_response.status_code == 200
        signin_result = signin_response.json()
        assert signin_result["success"] is True
        assert "access_token" in signin_result

        # Verificar que el usuario existe en la BD
        user = db.query(User).filter(User.email == "flowtest@example.com").first()
        assert user is not None
        assert user.first_name == "Flow"

        print("✅ Prueba funcional de flujo completo de registro completada")

    @patch('app.api.v1.auth.service.boto3.client')
    def test_password_recovery_flow(self, mock_boto_client, client):
        """
        Autor: Luis Flores
        Descripción: Prueba funcional del flujo de recuperación de contraseña.
        Parámetros:
            mock_boto_client: Mock del cliente de boto3.
            client (TestClient): Cliente HTTP de prueba.
        """
        # Arrange
        mock_cognito = MagicMock()
        mock_cognito.forgot_password.return_value = {}
        mock_cognito.confirm_forgot_password.return_value = {}
        mock_boto_client.return_value = mock_cognito

        # Paso 1: Solicitar recuperación
        forgot_data = {"email": "forgot@example.com"}
        forgot_response = client.post("/api/v1/auth/forgot-password", json=forgot_data)
        assert forgot_response.status_code == 200
        forgot_result = forgot_response.json()
        assert forgot_result["success"] is True

        # Paso 2: Confirmar nueva contraseña
        confirm_data = {
            "email": "forgot@example.com",
            "code": "123456",
            "new_password": "NewPassword123!"
        }
        confirm_response = client.post("/api/v1/auth/confirm-forgot-password", json=confirm_data)
        assert confirm_response.status_code == 200
        confirm_result = confirm_response.json()
        assert confirm_result["success"] is True

        print("✅ Prueba funcional de recuperación de contraseña completada")

    def test_password_hashing(self):
        """
        Autor: Luis Flores
        Descripción: Prueba funcional de hashing y verificación de contraseñas.
        """
        # Arrange
        password = "TestPassword123!"

        # Act
        hashed = hash_password(password)
        is_valid = verify_password(password, hashed)
        is_invalid = verify_password("WrongPassword", hashed)

        # Assert
        assert hashed != password
        assert is_valid is True
        assert is_invalid is False

        print("✅ Prueba funcional de hashing de contraseñas completada")
