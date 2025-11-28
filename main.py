from fastapi import FastAPI
from database.connection import Base, engine
from src.modules.inventory import router as inventory_router
from src.modules.users import router as auth_router   # Renombrado de 'users_router' a 'auth_router'
from src.modules.sales import router as sales_router    
from src.modules.admin import router as admin_router    # <--- AÑADIDO: Router de Admin/Reportes
from fastapi.middleware.cors import CORSMiddleware 
from src.modules.inventory import models # Asegura la carga de todos los modelos (Cashier, Admin, Sale, etc.)


app = FastAPI(
    title="Sistema POS/Admin Full-Stack",
    description="Backend completo con seguridad reforzada para el administrador.",
    version="1.0.0"
)

# Configuración CORS para que React (http://localhost:5173) pueda conectarse al API
origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CREA LAS TABLAS: Asegúrate que tu DB esté corriendo antes de ejecutar esto.
# Llama a Base.metadata.create_all para crear TODAS las tablas definidas en models.py.
Base.metadata.create_all(bind=engine)

# --- INCLUSIÓN DE TODOS LOS ROUTERS ---
app.include_router(inventory_router.router)
app.include_router(auth_router.router)    # Maneja /auth/cashier_validate_rut/ y /auth/admin_login/
app.include_router(sales_router.router)   # Maneja /sales/
app.include_router(auth_router.router)   # Maneja /admin/reports/, /admin/cashiers/, /admin/tax_rate/

@app.get("/")
def read_root():
    return {"status": "Backend conectado y listo. Acceda a /docs para ver endpoints."}