from fastapi import FastAPI
from fastapi import FastAPI
from database.connection import Base, engine
from src.modules.inventory import router as inventory_router

app = FastAPI(
    title="Sistema de Integración Local",
    description="Backend para la gestión de productos y ventas."
)

Base.metadata.create_all(bind=engine)

app.include_router(inventory_router.router)

@app.get("/")
def read_root():
    return {"Mensaje": "¡FastAPI funcionando!"}