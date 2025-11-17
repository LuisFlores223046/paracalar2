import json
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Configuración de la aplicación usando variables de entorno del archivo .env
    """
    
    # ============ APLICACIÓN ============
    APP_NAME: str = "BeFit API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # ============ BASE DE DATOS ============
    DATABASE_URL: str
    
    # ============ AWS ============
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    
    # ============ AWS COGNITO ============
    COGNITO_REGION: str
    COGNITO_USER_POOL_ID: str
    COGNITO_CLIENT_ID: str
    
    # ============ AWS S3 ============
    S3_BUCKET_NAME: str
    
    # ============ JWT ============
    JWT_SECRET_KEY: str | None = None
    JWT_ALGORITHM: str = "RS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # ============ STRIPE ============
    STRIPE_API_KEY: str
    STRIPE_SECRET_KEY: str
    STRIPE_WEBHOOK_SECRET: str
    
    # ============ PAYPAL ============
    PAYPAL_CLIENT_ID: str
    PAYPAL_CLIENT_SECRET: str
    PAYPAL_API_BASE_URL: str
    
    # ============ CORS ============
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # ============ APPLICATION URL ============
    APP_URL: str = "http://localhost:3000"
    
    @field_validator('BACKEND_CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """
        Valida y parsea BACKEND_CORS_ORIGINS desde string JSON a lista.
        """
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                # Si falla el JSON, intentar split por comas
                return [origin.strip() for origin in v.split(',') if origin.strip()]
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"
        
    def print_debug_info(self):
        """
        Método para imprimir información de debug SOLO en desarrollo.
        """
        if self.DEBUG:
            print("=" * 50)
            print("CONFIGURACIÓN DE DEBUG")
            print("=" * 50)
            print(f"App Name: {self.APP_NAME}")
            print(f"Version: {self.APP_VERSION}")
            print(f"Database URL: {self.DATABASE_URL}")
            print(f"AWS Region: {self.AWS_REGION}")
            print(f"Cognito Region: {self.COGNITO_REGION}")
            print(f"Cognito User Pool ID: {self.COGNITO_USER_POOL_ID}")
            print(f"Cognito Client ID: {self.COGNITO_CLIENT_ID}")
            print(f"S3 Bucket: {self.S3_BUCKET_NAME}")
            print(f"JWT Algorithm: {self.JWT_ALGORITHM}")
            print(f"CORS Origins: {self.BACKEND_CORS_ORIGINS}")
            print(f"Stripe API Key configurada: {'✓' if self.STRIPE_API_KEY else '✗'}")
            print(f"PayPal Client ID configurada: {'✓' if self.PAYPAL_CLIENT_ID else '✗'}")
            print("=" * 50)


settings = Settings()
settings.print_debug_info()