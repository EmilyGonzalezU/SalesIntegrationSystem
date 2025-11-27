import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Generator

load_dotenv()

# 1. Obtener la URL de conexión
DATABASE_URL = os.getenv("DATABASE_URL")

# 2. Crear el Motor (Engine)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

# 3. Crear una Sesión de Base de Datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base Declarativa (para definir los modelos)
Base = declarative_base()

# 5. Función de Dependencia para FastAPI
def get_db() -> Generator[SessionLocal, None, None]:
    """Crea una sesión por cada solicitud y la cierra al finalizar."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()