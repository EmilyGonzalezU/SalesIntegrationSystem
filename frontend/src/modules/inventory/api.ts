import axios from 'axios';
import type { Product, Category, CategoryCreate, CategoryUpdate} from '/home/emily/Escritorio/SaleIntegrationSystem/frontend/src/modules/inventory/types.ts';

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