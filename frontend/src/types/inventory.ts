// ------------------- CATEGORÍAS -------------------

// CATEGORY (Lectura y Edición)
export interface Category {
  id: number;
  name: string;
  is_weighted: boolean; 
}

// CATEGORY CREATE (Solo se envía el nombre al API)
export interface CategoryCreate {
  name: string;
  is_weighted: boolean; // ✨ Nuevo campo
}

export interface CategoryUpdate {
  name: string;
  is_weighted: boolean; // ✨ Nuevo campo
}

// ------------------- CAJEROS -------------------

export interface CashierRead {
  id: number;
  name: string;
  rut: string;
  is_active: boolean;
}

export interface CashierLogin {
  rut: string;
}

// ------------------- ADMINISTRADORES -------------------

export interface AdminRead {
  id: number;
  username: string;
  name: string;
  is_active: boolean;
}

export interface AdminLogin {
  username: string;
  password: string;
}

// ------------------- PRODUCTOS -------------------

export interface Product {
  id: number;
  bar_code: string | null;
  name: string;
  category_id: number;
  description: string | null;
  brand: string;
  stock: number;
  min_stock: number;
  price: number;
  discount: number | null;
  is_iva_exempt: boolean;
  category?: Category;
}

export interface ProductCreate {
  id: number;
  bar_code: string | null;
  name: string;
  category_id: number;
  description: string | null;
  brand: string;
  stock: number;
  min_stock: number;
  price: number;
  discount: number | null;
  is_iva_exempt: boolean;
  category?: Category;
}
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