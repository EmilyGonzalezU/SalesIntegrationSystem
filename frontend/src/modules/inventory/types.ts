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

export interface ProductUpdate {
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



