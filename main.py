from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
# Importaciones necesarias
from src.modules.inventory import router as inventory_router
from src.modules.users import router as auth_router       # Router de Usuarios/Auth
from src.modules.sales import router as sales_router    
from src.modules.admin import router as admin_router    # Router de Admin/Reportes
from database.connection import engine
from src.modules.inventory import models # Asegura la carga de todos los modelos (Cashier, Admin, Sale, etc.)


app = FastAPI(
    title="Sistema POS/Admin Full-Stack",
    description="Backend completo con seguridad reforzada para el administrador.",
    version="1.0.0"
)

# Configuración CORS
origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000", # Para Swagger/Docs
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ❌ REMOVER: Base.metadata.create_all(bind=engine)
# Usar el script reset_db.py para crear/actualizar la BD.

# --- INCLUSIÓN DE TODOS LOS ROUTERS ---
app.include_router(inventory_router.router)
app.include_router(auth_router.router)      # Rutas /auth/...
app.include_router(sales_router.router)     # Rutas /sales/...
app.include_router(admin_router.router)     # Rutas /admin/...

@app.get("/")
def read_root():
    return {"status": "Backend conectado y listo. Acceda a /docs para ver endpoints."}