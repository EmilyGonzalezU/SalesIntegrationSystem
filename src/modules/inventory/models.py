from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from database.connection import Base
from datetime import datetime

# ====================================================================
# CONFIGURACIÓN DINÁMICA DE IMPUESTOS
# ====================================================================

class TaxRate(Base):
    __tablename__ = 'tax_rates'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False, default="IVA_ESTANDAR") 
    rate = Column(Float, nullable=False, default=0.19) 
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# ====================================================================
# GESTIÓN DE ADMINISTRADORES (SEGURIDAD REFORZADA)
# ====================================================================
# ESTE ES EL MODELO CRÍTICO QUE FALTABA
class Admin(Base):
    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False) # Contraseña cifrada
    name = Column(String)
    is_active = Column(Boolean, default=True)


# ====================================================================
# GESTIÓN DE INVENTARIO
# ====================================================================

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    is_weighted = Column(Boolean, default=False)
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    bar_code = Column(String, index=True, nullable=True) # CORREGIDO: Debe ser nullable=True para productos de peso
    name = Column(String, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="products")
    description = Column(String, index=True, nullable=True)
    brand = Column(String, index=True, nullable=False)
    
    # CORREGIDO: Stock y Min_Stock deben ser FLOAT para manejar KG/Gramos
    stock = Column(Float, default=0) 
    min_stock = Column(Float, default=0) 
    
    price = Column(Float, nullable=False)
    discount = Column(Float, nullable=True)
    
    is_iva_exempt = Column(Boolean, default=False) 
    
# ====================================================================
# INFORMACIÓN DEL CAJERO (RESPONSABILIDAD)
# ====================================================================

class Cashier(Base):
    __tablename__ = 'cashiers'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    rut = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    
    sales = relationship("Sale", back_populates="cashier") 
    
# ====================================================================
# VENTA (SALE) Y DETALLE DE VENTA (SALEDETAIL)
# ====================================================================

class Sale(Base):
    __tablename__ = 'sales'

    id = Column(Integer, primary_key=True, index=True)
    sale_date = Column(DateTime, default=datetime.utcnow)
    
    net_amount = Column(Float, default=0.0)
    iva_total = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0) 
    
    is_completed = Column(Boolean, default=True) 
    
    cashier_id = Column(Integer, ForeignKey('cashiers.id'))
    cashier = relationship("Cashier", back_populates="sales")
    
    details = relationship("SaleDetail", back_populates="sale")

class SaleDetail(Base):
    __tablename__ = 'sale_details'

    id = Column(Integer, primary_key=True, index=True)
    quantity = Column(Float, nullable=False) 
    price_at_sale = Column(Float, nullable=False) 
    subtotal = Column(Float, nullable=False) 
    
    iva_percentage_at_sale = Column(Float, default=0.19) 
    iva_amount = Column(Float, default=0.0)
    
    sale_id = Column(Integer, ForeignKey('sales.id'))
    sale = relationship("Sale", back_populates="details")
    
    product_id = Column(Integer, ForeignKey('products.id'))
    product = relationship("Product")