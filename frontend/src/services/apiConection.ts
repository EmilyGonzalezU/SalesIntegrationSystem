import axios from 'axios';
import type { 
    Product, Category, CashierRead, CashierLogin, SaleCreate, SaleRead, AdminLogin, AdminRead, 
    CategoryCreate, CategoryUpdate,
    // ✨ TIPOS DE CAJERO NECESARIOS:
    CashierCreate, // Para POST
    CashierUpdate  // Para PUT
} from '../types/inventory';
// URL del Backend donde corre Uvicorn (Asegúrate de que esta ruta sea la correcta)
const API_URL = 'http://127.0.0.1:8000'; 
const API_CATEGORY_ROUTE = `${API_URL}/inventory/categories`;


export const getProducts = async (query?: string): Promise<Product[]> => {
  const url = query ? `${API_URL}/inventory/products/?query=${query}` : `${API_URL}/inventory/products/`;
  const response = await axios.get<Product[]>(url);
  return response.data;
};

export const createProductAdmin = async (productData: Product): Promise<Product> => {
    // Usamos ProductCreate que excluye el ID, como definimos en schemas.ts
    const response = await axios.post<Product>(`${API_URL}/inventory/products/`, productData);
    return response.data;
};

export const updateProduct = async (productId: number, productData: Product): Promise<Product> => {
    // PUT para actualizar todos los campos del producto
    const response = await axios.put<Product>(`${API_URL}/inventory/products/${productId}`, productData);
    return response.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
    // DELETE para eliminar un producto
    await axios.delete(`${API_URL}/inventory/products/${productId}`);
};

// --- CATEGORÍAS (CRUD COMPLETO) ---

export const getCategories = async (): Promise<Category[]> => {
    // Esta ruta no requiere autenticación
    const response = await axios.get<Category[]>(`${API_URL}/inventory/categories/`);
    return response.data;
};

// **NUEVO:** Crear Categoría
export const createCategory = async (categoryData: CategoryCreate): Promise<Category> => {
    const response = await axios.post<Category>(`${API_URL}/inventory/categories/`, categoryData);
    return response.data;
};


// **NUEVO:** Actualizar Categoría (Usamos PUT, que implementamos en FastAPI)
export const updateCategory = async (categoryId: number, categoryData: CategoryUpdate): Promise<Category> => {
    // Aquí es donde se ensambla la URL:
    const response = await axios.put<Category>(`${API_CATEGORY_ROUTE}/${categoryId}`, categoryData);
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Debe incluir el prefijo
    return response.data;
};
// **NUEVO:** Eliminar Categoría
export const deleteCategory = async (categoryId: number): Promise<void> => {
    await axios.delete(`${API_URL}/inventory/categories/${categoryId}`);
};



// ------------------- CRUD CAJEROS (ADMIN) -------------------
// Asumimos que estas rutas están bajo el prefijo /admin/cashiers/
const API_CASHIER_ROUTE = `${API_URL}/admin/cashiers`;

export const getCashiers = async (): Promise<CashierRead[]> => {
    /** [ADMIN] Obtiene la lista completa de cajeros. */
    const response = await axios.get<CashierRead[]>(API_CASHIER_ROUTE);
    return response.data;
};

export const createCashier = async (cashierData: CashierCreate): Promise<CashierRead> => {
    /** [ADMIN] Crea un nuevo perfil de cajero. */
    const response = await axios.post<CashierRead>(API_CASHIER_ROUTE, cashierData);
    return response.data;
};

export const updateCashier = async (cashierId: number, cashierData: CashierUpdate): Promise<CashierRead> => {
    /** [ADMIN] Actualiza nombre o estado del cajero. */
    const response = await axios.put<CashierRead>(`${API_CASHIER_ROUTE}/${cashierId}`, cashierData);
    return response.data;
};

export const deleteCashier = async (cashierId: number): Promise<void> => {
    /** [ADMIN] Elimina un cajero. */
    await axios.delete(`${API_CASHIER_ROUTE}/${cashierId}`);
};


// ------------------- AUTENTICACIÓN (RUT y Admin) -------------------
// ... (validateCashier, adminLogin, sin cambios) ...

export const validateCashier = async (rut: string): Promise<CashierRead> => {
    const payload: CashierLogin = { rut };
    const response = await axios.post<CashierRead>(`${API_URL}/auth/cashier_validate_rut/`, payload);
    return response.data;
};

export const adminLogin = async (credentials: AdminLogin): Promise<AdminRead> => {
    const response = await axios.post<AdminRead>(`${API_URL}/auth/admin_login/`, credentials);
    return response.data;
};

// ------------------- VENTAS Y REPORTES -------------------
// ... (createSale, getDailySalesReport, sin cambios) ...

export const createSale = async (saleData: SaleCreate): Promise<SaleRead> => {
    const response = await axios.post<SaleRead>(`${API_URL}/sales/`, saleData);
    return response.data;
};

export const getDailySalesReport = async (targetDate: string): Promise<any> => {
    const response = await axios.get(`${API_URL}/admin/reports/daily_sales?target_date=${targetDate}`);
    return response.data;
};