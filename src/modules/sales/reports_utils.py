from sqlalchemy.orm import Session
from sqlalchemy import func
from src.modules.inventory import models, schemas 
from typing import Dict, Any, List
from datetime import date

def get_daily_sales_report(db: Session, target_date: date) -> Dict[str, Any]:
    """
    Genera un reporte resumido de las ventas para un día específico,
    incluyendo el desglose por cajero.
    """
    
    daily_sales = db.query(models.Sale).filter(
        models.Sale.is_completed == True,
        func.date(models.Sale.sale_date) == target_date
    ).all()

    if not daily_sales:
        return {
            "date": target_date.isoformat(),
            "total_sales_count": 0,
            "total_net_amount": 0.0,
            "total_iva_amount": 0.0,
            "total_gross_amount": 0.0,
            "cashier_breakdown": {}
        }

    total_net = sum(sale.net_amount for sale in daily_sales)
    total_iva = sum(sale.iva_total for sale in daily_sales)
    total_gross = sum(sale.total_amount for sale in daily_sales)
    
    # Desglose por Cajero
    cashier_sales = db.query(
        models.Cashier.name,
        func.count(models.Sale.id).label('sales_count'),
        func.sum(models.Sale.total_amount).label('gross_total')
    ).join(models.Sale, models.Sale.cashier_id == models.Cashier.id).filter(
        models.Sale.is_completed == True,
        func.date(models.Sale.sale_date) == target_date
    ).group_by(models.Cashier.name).all()

    cashier_breakdown = {
        name: {"count": count, "total": float(gross_total)}
        for name, count, gross_total in cashier_sales
    }

    return {
        "date": target_date.isoformat(),
        "total_sales_count": len(daily_sales),
        "total_net_amount": round(total_net, 2),
        "total_iva_amount": round(total_iva, 2),
        "total_gross_amount": round(total_gross, 2),
        "cashier_breakdown": cashier_breakdown
    }

def get_low_stock_products(db: Session) -> List[models.Product]:
    """Obtiene productos cuyo stock actual es menor o igual al stock mínimo (para el dashboard)."""
    return db.query(models.Product).filter(
        models.Product.stock <= models.Product.min_stock
    ).all()