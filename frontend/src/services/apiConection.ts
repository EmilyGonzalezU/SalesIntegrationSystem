import axios from 'axios';
import type { Product, ProductCreate, Category } from '../types/inventory';

const API_URL = 'http://127.0.0.1:8000/inventory/';

export const gesCategories = async (): Promise<Category[]> => {
    const response = await axios.get<Category[]>(`${API_URL}/categories/`);
    return response.data;
}

export const getProducts = async (query?: string): Promise<Product[]> => {
    const url = query ? `${API_URL}/products/?query=${query}` : `${API_URL}/products/`;
    const response = await axios.get<Product[]>(url);
    return response.data;
}

export const createProduct = async (productData: ProductCreate): Promise<Product> => {
    const response = await axios.post<Product>(`${API_URL}/products/`, productData);
    return response.data;
};