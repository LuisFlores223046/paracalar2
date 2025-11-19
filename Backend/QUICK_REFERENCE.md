# Guía Rápida de Referencia - BeFit API

## Comandos Rápidos

### Configuración Inicial
```bash
# 1. Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
./venv/Scripts/activate   # Windows

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Configurar variables de entorno
cp .env.example .env  # Editar con tus credenciales

# 4. Crear base de datos
python create_database.py

# 5. Ejecutar migraciones
cd Backend
alembic upgrade head

# 6. (Opcional) Poblar datos de prueba
python seed_data.py
```

### Desarrollo
```bash
# Levantar servidor en modo desarrollo
cd Backend
uvicorn app.main:app --reload

# Ejecutar tests
pytest

# Ejecutar tests con coverage
pytest --cov=app --cov-report=html

# Ver logs
tail -f logs/app.log  # Si tienes logging a archivo
```

### Base de Datos
```bash
# Crear nueva migración
alembic revision --autogenerate -m "descripción del cambio"

# Aplicar migraciones pendientes
alembic upgrade head

# Revertir última migración
alembic downgrade -1

# Ver historial de migraciones
alembic history

# Ver estado actual
alembic current
```

---

## Estructura de un Módulo

Cada módulo en `app/api/v1/` sigue esta estructura:

```
module_name/
├── __init__.py          # Exporta router y schemas
├── routes.py            # Endpoints HTTP
├── schemas.py           # Pydantic schemas (validación)
└── service.py           # Lógica de negocio
```

### Crear un Nuevo Módulo

#### 1. `routes.py`
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from .schemas import ItemCreate, ItemResponse
from .service import ItemService

router = APIRouter()
service = ItemService()

@router.post("/", response_model=ItemResponse)
async def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crear nuevo item"""
    return await service.create_item(db, item, current_user.id)

@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    """Obtener item por ID"""
    return await service.get_item(db, item_id)
```

#### 2. `schemas.py`
```python
from pydantic import BaseModel, Field
from datetime import datetime

class ItemBase(BaseModel):
    """Schema base"""
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = None

class ItemCreate(ItemBase):
    """Schema para crear item"""
    pass

class ItemUpdate(BaseModel):
    """Schema para actualizar item"""
    name: str | None = None
    description: str | None = None

class ItemResponse(ItemBase):
    """Schema para respuesta"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
```

#### 3. `service.py`
```python
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.item import Item
from .schemas import ItemCreate, ItemUpdate

class ItemService:
    """Servicio de lógica de negocio para items"""

    async def create_item(self, db: Session, item: ItemCreate, user_id: int):
        """Crear nuevo item"""
        db_item = Item(
            name=item.name,
            description=item.description,
            user_id=user_id
        )
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    async def get_item(self, db: Session, item_id: int):
        """Obtener item por ID"""
        item = db.query(Item).filter(Item.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item no encontrado")
        return item

    async def update_item(self, db: Session, item_id: int, item: ItemUpdate):
        """Actualizar item"""
        db_item = await self.get_item(db, item_id)

        for key, value in item.dict(exclude_unset=True).items():
            setattr(db_item, key, value)

        db.commit()
        db.refresh(db_item)
        return db_item
```

#### 4. `__init__.py`
```python
from .routes import router

__all__ = ["router"]
```

#### 5. Registrar en `router.py` principal
```python
# app/api/v1/router.py
from fastapi import APIRouter
from app.api.v1.items import router as items_router  # Nuevo

api_router = APIRouter()

api_router.include_router(items_router, prefix="/items", tags=["Items"])
```

---

## Crear un Modelo de Base de Datos

```python
# app/models/item.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models import Base

class Item(Base):
    """Modelo de Item"""
    __tablename__ = "items"

    # Campos
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    user = relationship("User", back_populates="items")
```

Después de crear el modelo:
```bash
alembic revision --autogenerate -m "add items table"
alembic upgrade head
```

---

## Patrones Comunes

### 1. Obtener Usuario Actual
```python
from app.api.deps import get_current_user
from app.models.user import User

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
```

### 2. Requiere Admin
```python
from app.api.deps import get_admin_user

@router.delete("/items/{item_id}")
async def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)  # Solo admin
):
    # ...
```

### 3. Paginación
```python
from typing import List

@router.get("/", response_model=List[ItemResponse])
async def list_items(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    items = db.query(Item).offset(skip).limit(limit).all()
    return items
```

### 4. Filtrado
```python
@router.get("/search")
async def search_items(
    q: str | None = None,
    category: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Item)

    if q:
        query = query.filter(Item.name.ilike(f"%{q}%"))

    if category:
        query = query.filter(Item.category == category)

    return query.all()
```

### 5. Manejo de Errores
```python
from fastapi import HTTPException

# Not Found
raise HTTPException(status_code=404, detail="Item no encontrado")

# Unauthorized
raise HTTPException(status_code=401, detail="No autenticado")

# Forbidden
raise HTTPException(status_code=403, detail="Sin permisos")

# Bad Request
raise HTTPException(status_code=400, detail="Datos inválidos")

# Conflict
raise HTTPException(status_code=409, detail="Item ya existe")
```

### 6. Subir Archivos a S3
```python
from app.services.s3_service import S3Service
from fastapi import UploadFile, File

s3_service = S3Service()

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Validar tipo de archivo
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(400, "Tipo de archivo no permitido")

    # Subir a S3
    file_url = await s3_service.upload_file(
        file=file.file,
        filename=file.filename,
        folder="items"
    )

    return {"url": file_url}
```

### 7. Transacciones
```python
from sqlalchemy.exc import IntegrityError

async def complex_operation(db: Session):
    try:
        # Operación 1
        item = Item(name="Test")
        db.add(item)
        db.flush()  # Obtener ID sin commit

        # Operación 2
        related = RelatedItem(item_id=item.id)
        db.add(related)

        # Commit de todo
        db.commit()

    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "Error en la operación")
```

---

## Testing

### Test Básico
```python
# tests/test_items.py
import pytest
from fastapi.testclient import TestClient

def test_create_item(client: TestClient, auth_headers: dict):
    """Test crear item"""
    response = client.post(
        "/api/v1/items",
        json={"name": "Test Item", "description": "Test"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Item"

def test_get_item(client: TestClient, test_item: dict):
    """Test obtener item"""
    response = client.get(f"/api/v1/items/{test_item['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == test_item["id"]

def test_unauthorized(client: TestClient):
    """Test sin autenticación"""
    response = client.post("/api/v1/items", json={"name": "Test"})
    assert response.status_code == 401
```

### Fixtures Comunes
```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db

@pytest.fixture
def client():
    """Cliente de test"""
    return TestClient(app)

@pytest.fixture
def test_user(db):
    """Usuario de prueba"""
    user = User(email="test@example.com", name="Test")
    db.add(user)
    db.commit()
    return user

@pytest.fixture
def auth_headers(test_user):
    """Headers de autenticación"""
    token = create_access_token(test_user.id)
    return {"Authorization": f"Bearer {token}"}
```

---

## Variables de Entorno

### Desarrollo
```env
DEBUG=True
DEV_MODE=True
APP_URL=http://localhost:8000
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
DATABASE_URL=postgresql://user:pass@localhost:5432/befit_dev
```

### Producción
```env
DEBUG=False
DEV_MODE=False
APP_URL=https://api.befit.com
BACKEND_CORS_ORIGINS=["https://befit.com"]
DATABASE_URL=postgresql://user:pass@prod-db:5432/befit_prod
```

---

## URLs Importantes

### Desarrollo
- **API:** http://localhost:8000
- **Docs (Swagger):** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health

### Base URLs de API
- **API v1:** `/api/v1`
- **Auth:** `/api/v1/auth`
- **Products:** `/api/v1/products`
- **Orders:** `/api/v1/orders`
- **Cart:** `/api/v1/cart`

---

## Debugging

### Logging
```python
import logging

logger = logging.getLogger(__name__)

# Diferentes niveles
logger.debug("Información de debug")
logger.info("Información general")
logger.warning("Advertencia")
logger.error("Error", exc_info=True)  # Incluye stack trace
logger.critical("Error crítico")
```

### Breakpoints
```python
# Usar debugpy para VS Code
import debugpy
debugpy.breakpoint()

# O pdb para debugging en consola
import pdb
pdb.set_trace()
```

### Ver Queries SQL
```python
# En config de SQLAlchemy
engine = create_engine(
    settings.DATABASE_URL,
    echo=True  # Muestra todas las queries SQL
)
```

---

## Tips y Mejores Prácticas

### 1. Siempre usa Type Hints
```python
# ✅ Bueno
def get_user(user_id: int) -> User:
    pass

# ❌ Malo
def get_user(user_id):
    pass
```

### 2. Valida con Pydantic
```python
# ✅ Bueno
class UserCreate(BaseModel):
    email: EmailStr  # Valida email
    age: int = Field(..., ge=18, le=120)  # Entre 18 y 120

# ❌ Malo
class UserCreate(BaseModel):
    email: str
    age: int
```

### 3. Usa Async cuando sea apropiado
```python
# ✅ Para I/O operations
async def send_email(to: str):
    await mail.send(...)

# ✅ Para DB operations (con async driver)
async def get_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(User).filter(User.id == user_id))
    return result.scalar_one()
```

### 4. Maneja errores apropiadamente
```python
# ✅ Bueno
try:
    user = get_user(user_id)
    if not user:
        raise HTTPException(404, "Usuario no encontrado")
except Exception as e:
    logger.error(f"Error al obtener usuario: {e}")
    raise HTTPException(500, "Error interno")

# ❌ Malo
user = get_user(user_id)  # Puede fallar sin manejo
```

### 5. No expongas información sensible
```python
# ✅ Bueno
class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    # NO incluir: password_hash, tokens, etc.

# ❌ Malo
class UserResponse(BaseModel):
    id: int
    email: str
    password_hash: str  # NUNCA exponer!
```

### 6. Usa dependencias para código reutilizable
```python
# ✅ Bueno
async def get_item_or_404(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(404, "Item no encontrado")
    return item

@router.put("/{item_id}")
async def update_item(item: Item = Depends(get_item_or_404)):
    # item ya está validado y existe
    pass
```

---

## Solución de Problemas Comunes

### Error: "Module not found"
```bash
# Asegúrate de estar en el entorno virtual
source venv/bin/activate

# Reinstala dependencias
pip install -r requirements.txt
```

### Error: "Database connection failed"
```bash
# Verifica que PostgreSQL esté corriendo
sudo service postgresql status

# Verifica las credenciales en .env
echo $DATABASE_URL
```

### Error: "CORS policy"
```python
# Agrega el origen en config.py
BACKEND_CORS_ORIGINS=["http://localhost:3000", "tu-frontend.com"]
```

### Error: "Alembic can't locate revision"
```bash
# Reinicia el historial de migraciones
rm -rf alembic/versions/*
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

---

## Recursos Útiles

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Pydantic Docs:** https://docs.pydantic.dev/
- **SQLAlchemy Docs:** https://docs.sqlalchemy.org/
- **Alembic Tutorial:** https://alembic.sqlalchemy.org/en/latest/tutorial.html
- **pytest Docs:** https://docs.pytest.org/

---

**Mantén esta guía actualizada mientras el proyecto evoluciona!**
