from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from datetime import datetime

# ====================================================================
# GESTIÓN DE INVENTARIO
# ====================================================================

# Esquemas de Categorías
class CategoryCreate(BaseModel):
    name: str

class CategoryRead(CategoryCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)

# Esquemas de Productos
class ProductCreate(BaseModel):
    bar_code: Optional[str] = None
    name: str
    category_id: int
    description: Optional[str] = None
    brand: str
    stock: float
    min_stock: float
    price: float
    discount: Optional[float] = None
    is_iva_exempt: bool = False # Campo de IVA

class ProductRead(ProductCreate):
    id: int
    category: Optional[CategoryRead] = None 
    model_config = ConfigDict(from_attributes=True)

# ====================================================================
# GESTIÓN DE CAJEROS
# ====================================================================

# Esquema Base de Cajero
class CashierBase(BaseModel):
    name: str
    rut: str 

# Esquema para crear un cajero (Admin)
class CashierCreate(CashierBase):
    pass

# Esquema para leer un cajero (Respuesta de API)
class CashierRead(CashierBase):
    id: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)

# Esquema de Validación para el inicio de Caja
class CashierLogin(BaseModel):
    rut: str = Field(..., description="RUT o identificación del cajero para iniciar sesión.")

# ====================================================================
# GESTIÓN DE ADMINISTRADORES (SEGURIDAD REFORZADA)
# ====================================================================

# Esquemas para la gestión de Admin
class AdminBase(BaseModel):
    username: str
    name: str
class AdminCreate(AdminBase):
    password: str # Solo para creación
class AdminRead(AdminBase):
    id: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)
class AdminLogin(BaseModel):
    username: str
    password: str 

# ====================================================================
# CONFIGURACIÓN DE IMPUESTOS
# ====================================================================

# Esquemas de Tasa de Impuesto (IVA Dinámico)
class TaxRateBase(BaseModel):
    rate: float = Field(..., description="Tasa del impuesto en formato decimal (ej: 0.19).", ge=0.0)

class TaxRateUpdate(TaxRateBase):
    pass

class TaxRateRead(TaxRateBase):
    id: int
    name: str
    last_updated: datetime
    model_config = ConfigDict(from_attributes=True)

# ====================================================================
# VENTAS
# ====================================================================

# Esquemas de Detalle de Venta
class SaleDetailBase(BaseModel):
    product_id: int
    quantity: float 

class SaleDetailCreate(SaleDetailBase):
    pass

class SaleDetailRead(SaleDetailBase):
    id: int
    price_at_sale: float
    subtotal: float
    iva_percentage_at_sale: float
    iva_amount: float
    
    model_config = ConfigDict(from_attributes=True)

# Esquemas de Venta
class SaleCreate(BaseModel):
    details: List[SaleDetailCreate] 
    cashier_id: int 
    
class SaleRead(BaseModel):
    id: int
    sale_date: datetime
    cashier_id: int
    net_amount: float
    iva_total: float
    total_amount: float
    details: List[SaleDetailRead] 
    
    model_config = ConfigDict(from_attributes=True)