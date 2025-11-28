from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.modules.inventory import models, schemas # CORREGIDO: Importar desde inventory
from database.connection import get_db
from src.modules.sales import reports_utils
import math 
from datetime import datetime

router = APIRouter(
    prefix="/sales",
    tags=["Sales (POS)"]
)

@router.post("/", response_model=schemas.SaleRead, status_code=status.HTTP_201_CREATED)
def create_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db)):
    """
    Registra una nueva venta, calcula totales, y descuenta el stock de los productos.
    """
    # 0. OBTENER LA TASA DE IVA DINÁMICA
    iva_config = db.query(models.TaxRate).filter(models.TaxRate.name == "IVA_ESTANDAR").first()
    IVA_RATE = iva_config.rate if iva_config else 0.19
    
    # 1. Crear el objeto Venta inicial
    db_sale = models.Sale(cashier_id=sale.cashier_id, net_amount=0, iva_total=0, total_amount=0, is_completed=False)
    db.add(db_sale)
    db.flush() # Obtener el ID de la venta

    net_amount = 0.0
    iva_total = 0.0
    db_details = []

    # 2. Procesar cada detalle de la venta (Lógica Crítica de Descuento)
    for detail in sale.details:
        product = db.query(models.Product).filter(models.Product.id == detail.product_id).first()

        if not product:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Producto con ID {detail.product_id} no encontrado.")

        if product.stock < detail.quantity:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Stock insuficiente para {product.name}. Disponible: {product.stock}")

        # CÁLCULO DE IMPUESTOS Y TOTALES
        subtotal_neto = detail.quantity * product.price
        
        applied_iva_rate = 0.0 if product.is_iva_exempt else IVA_RATE
        
        iva_amount = round(subtotal_neto * applied_iva_rate, 2)
        
        net_amount += subtotal_neto
        iva_total += iva_amount

        # 3. Descontar el stock 
        product.stock -= detail.quantity

        db_detail = models.SaleDetail(
            sale_id=db_sale.id,
            product_id=detail.product_id,
            quantity=detail.quantity,
            price_at_sale=product.price,
            subtotal=subtotal_neto, 
            iva_percentage_at_sale=applied_iva_rate,
            iva_amount=iva_amount
        )
        db_details.append(db_detail)

    # 4. Finalizar la Venta
    db_sale.details = db_details
    db_sale.net_amount = net_amount
    db_sale.iva_total = iva_total 
    db_sale.total_amount = net_amount + iva_total 
    db_sale.is_completed = True
    
    # 5. Guardar todo (COMMIT)
    db.add_all(db_details)
    db.commit()
    db.refresh(db_sale)
    
    return db_sale