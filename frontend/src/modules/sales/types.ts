import type { Product } from "../inventory/types";

// Estructura para el carrito interno del cajero
export interface CartItem extends Product {
    cartQuantity: number;
    subtotal: number;
}

// ------------------- VENTAS -------------------

export interface SaleDetailCreate {
  product_id: number;
  quantity: number;
}

export interface SaleCreate {
  details: SaleDetailCreate[];
  cashier_id: number;
}

export interface SaleDetailRead {
    id: number;
    price_at_sale: number;
    subtotal: number;
    iva_percentage_at_sale: number;
    iva_amount: number;
}

export interface SaleRead {
    id: number;
    sale_date: string;
    cashier_id: number;
    net_amount: number;
    iva_total: number;
    total_amount: number;
    details: SaleDetailRead[];
}