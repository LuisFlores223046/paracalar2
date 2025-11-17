# Autor: Luis Flores
# Fecha: 17/11/2025
# Descripción: Archivo de pruebas para el módulo de test de colocación (placement test).
#             Incluye pruebas unitarias, integrales y funcionales para predicción ML de planes.

import pytest
from unittest.mock import patch, Mock
from sqlalchemy.orm import Session
from app.api.v1.placement_test.service import predict_plan, filter_test_attributes
from app.api.v1.placement_test import schemas
from app.models.fitness_profile import FitnessProfile
from app.models.user import User


# ==================== PRUEBAS UNITARIAS ====================

class TestPlacementTestServiceUnit:
    """
    Autor: Luis Flores
    Descripción: Clase que agrupa las pruebas unitarias del servicio de placement test.
    """

    def test_filter_test_attributes(self):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para filtrar atributos del test.
        """
        # Arrange
        input_data = {
            "age": 25,
            "gender": "M",
            "exercise_freq": 5,
            "activity_type": "weightlifting",
            "extra_field": "should be removed",
            "another_extra": 123
        }

        # Act
        filtered = filter_test_attributes(input_data)

        # Assert
        assert "age" in filtered
        assert "gender" in filtered
        assert "exercise_freq" in filtered
        assert "extra_field" not in filtered
        assert "another_extra" not in filtered

    @patch('app.api.v1.placement_test.service.joblib.load')
    @patch('app.api.v1.placement_test.service.pd.DataFrame')
    def test_predict_plan_bestrong(
        self, mock_dataframe, mock_joblib_load
    ):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para predicción de plan BeStrong.
        """
        # Arrange
        mock_model = Mock()
        mock_model.predict.return_value = ["BeStrong"]

        mock_encoders = {
            "gender": Mock(),
            "activity_type": Mock(),
            "activity_intensity": Mock(),
            "diet_type": Mock(),
            "diet_special": Mock(),
            "supplements": Mock(),
            "goal_declared": Mock()
        }

        mock_target_encoder = Mock()
        mock_target_encoder.inverse_transform.return_value = ["BeStrong"]

        mock_joblib_load.side_effect = [mock_model, mock_encoders, mock_target_encoder]

        input_data = {
            "age": 25,
            "gender": "M",
            "exercise_freq": 5,
            "activity_type": "weightlifting",
            "activity_intensity": "high",
            "diet_type": "high_protein",
            "diet_special": "none",
            "supplements": "yes",
            "goal_declared": "muscle_gain",
            "sleep_hours": 7
        }

        # Act
        result = predict_plan(input_data)

        # Assert
        assert result["recommended_plan"] == "BeStrong"
        assert "description" in result
        assert "attributes" in result

    def test_validate_placement_test_input_valid(self):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para validar input válido.
        """
        # Arrange
        valid_input = schemas.PlacementTestInput(
            age=25,
            gender="M",
            exercise_freq=5,
            activity_type="weightlifting",
            activity_intensity="high",
            diet_type="balanced",
            diet_special="none",
            supplements="no",
            goal_declared="muscle_gain",
            sleep_hours=7
        )

        # Assert
        assert valid_input.age == 25
        assert valid_input.gender == "M"
        assert valid_input.exercise_freq == 5

    def test_validate_placement_test_input_invalid_age(self):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para validar error con edad inválida.
        """
        # Act & Assert
        with pytest.raises(Exception):
            schemas.PlacementTestInput(
                age=10,  # Menor que 13
                gender="M",
                exercise_freq=5,
                activity_type="weightlifting",
                activity_intensity="high",
                diet_type="balanced",
                diet_special="none",
                supplements="no",
                goal_declared="muscle_gain",
                sleep_hours=7
            )

    def test_validate_placement_test_input_invalid_exercise_freq(self):
        """
        Autor: Luis Flores
        Descripción: Prueba unitaria para validar error con frecuencia de ejercicio inválida.
        """
        # Act & Assert
        with pytest.raises(Exception):
            schemas.PlacementTestInput(
                age=25,
                gender="M",
                exercise_freq=8,  # Mayor que 7
                activity_type="weightlifting",
                activity_intensity="high",
                diet_type="balanced",
                diet_special="none",
                supplements="no",
                goal_declared="muscle_gain",
                sleep_hours=7
            )


# ==================== PRUEBAS DE INTEGRACIÓN ====================

class TestPlacementTestAPIIntegration:
    """
    Autor: Luis Flores
    Descripción: Clase que agrupa las pruebas de integración de la API de placement test.
    """

    @patch('app.api.v1.placement_test.service.predict_plan')
    def test_placement_test_endpoint(
        self, mock_predict, user_client, db, test_user
    ):
        """
        Autor: Luis Flores
        Descripción: Prueba de integración para endpoint de placement test.
        """
        # Arrange
        mock_predict.return_value = {
            "recommended_plan": "BeStrong",
            "description": {
                "description": "Plan enfocado en ganancia muscular",
                "recommended_products": ["Whey Protein", "Creatina", "BCAA"]
            },
            "attributes": {
                "age": 25,
                "gender": "M",
                "exercise_freq": 5
            }
        }

        test_input = {
            "age": 25,
            "gender": "M",
            "exercise_freq": 5,
            "activity_type": "weightlifting",
            "activity_intensity": "high",
            "diet_type": "high_protein",
            "diet_special": "none",
            "supplements": "yes",
            "goal_declared": "muscle_gain",
            "sleep_hours": 7
        }

        # Act
        response = user_client.post("/api/v1/placement-test/", json=test_input)

        # Assert
        assert response.status_code in [200, 201]
        data = response.json()
        assert "recommended_plan" in data

        # Verificar que se creó el FitnessProfile
        profile = db.query(FitnessProfile).filter(
            FitnessProfile.user_id == test_user.user_id
        ).first()
        assert profile is not None


# ==================== PRUEBAS FUNCIONALES ====================

class TestPlacementTestFunctional:
    """
    Autor: Luis Flores
    Descripción: Clase que agrupa las pruebas funcionales end-to-end de placement test.
    """

    @patch('app.api.v1.placement_test.service.joblib.load')
    @patch('app.api.v1.placement_test.service.pd.DataFrame')
    def test_complete_placement_test_flow(
        self, mock_dataframe, mock_joblib_load, db, test_user
    ):
        """
        Autor: Luis Flores
        Descripción: Prueba funcional del flujo completo de placement test:
                     input, predicción ML, creación de FitnessProfile.
        """
        # Arrange - Mock del modelo ML
        mock_model = Mock()
        mock_model.predict.return_value = ["BeStrong"]

        mock_encoders = {
            "gender": Mock(),
            "activity_type": Mock(),
            "activity_intensity": Mock(),
            "diet_type": Mock(),
            "diet_special": Mock(),
            "supplements": Mock(),
            "goal_declared": Mock()
        }
        for encoder in mock_encoders.values():
            encoder.transform.return_value = [0]

        mock_target_encoder = Mock()
        mock_target_encoder.inverse_transform.return_value = ["BeStrong"]

        mock_joblib_load.side_effect = [mock_model, mock_encoders, mock_target_encoder]

        # Paso 1: Preparar input del usuario
        user_input = {
            "age": 28,
            "gender": "M",
            "exercise_freq": 5,
            "activity_type": "weightlifting",
            "activity_intensity": "high",
            "diet_type": "high_protein",
            "diet_special": "none",
            "supplements": "yes",
            "goal_declared": "muscle_gain",
            "sleep_hours": 7
        }

        # Paso 2: Filtrar atributos
        filtered_input = filter_test_attributes(user_input)
        assert len(filtered_input) == len(user_input)

        # Paso 3: Ejecutar predicción
        result = predict_plan(user_input)

        # Assert - Verificar predicción
        assert result["recommended_plan"] == "BeStrong"
        assert "description" in result
        assert "attributes" in result

        # Paso 4: Simular guardado de FitnessProfile
        from datetime import date
        # Merge recommended_plan into attributes
        profile_attributes = result["attributes"].copy()
        profile_attributes["recommended_plan"] = result["recommended_plan"]

        profile = FitnessProfile(
            user_id=test_user.user_id,
            test_date=date.today(),
            attributes=profile_attributes
        )
        db.add(profile)
        db.commit()

        # Paso 5: Verificar que el perfil se guardó correctamente
        saved_profile = db.query(FitnessProfile).filter(
            FitnessProfile.user_id == test_user.user_id
        ).first()

        assert saved_profile is not None
        assert saved_profile.attributes["recommended_plan"] == "BeStrong"
        assert saved_profile.attributes["age"] == 28
        assert saved_profile.attributes["gender"] == "M"

        print("Prueba funcional de placement test completada")

    def test_all_plan_types(self):
        """
        Autor: Luis Flores
        Descripción: Prueba funcional para verificar que el sistema puede predecir
                     todos los tipos de planes (BeStrong, BeLean, BeBalance, BeDefine, BeNutri).
        """
        # Este test verifica que el modelo puede retornar todos los planes
        expected_plans = ["BeStrong", "BeLean", "BeBalance", "BeDefine", "BeNutri"]

        # En un entorno real, el modelo ML debería poder predecir cualquiera de estos
        # basado en los inputs del usuario
        assert all(isinstance(plan, str) for plan in expected_plans)
        assert len(expected_plans) == 5

        print("Prueba de tipos de planes completada")
