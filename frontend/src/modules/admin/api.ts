import axios from 'axios';
import type {  CashierRead, CashierLogin, AdminLogin, AdminRead, CashierCreate, CashierUpdate, TaxRateRead, TaxRateUpdate
} from '/home/emily/Escritorio/SaleIntegrationSystem/frontend/src/modules/admin/types.ts';
// URL del Backend donde c../typesorre Uvicorn (Asegúrate de que esta ruta sea la correcta)
const API_URL = 'http://127.0.0.1:8000'; 

// ------------------- CRUD CAJEROS (ADMIN) -------------------
// Asumimos que estas rutas están bajo el prefijo /admin/cashiers/
const API_CASHIER_ROUTE = `${API_URL}/admin/cashiers`;

export const getCashiers = async (): Promise<CashierRead[]> => {
    /** [ADMIN] Obtiene la lista completa de cajeros. */
    const response = await axios.get<CashierRead[]>(API_CASHIER_ROUTE);
    return response.data;
};

export const createCashier = async (cashierData: CashierCreate): Promise<CashierRead> => {
    /** [AtypesDMIN] Crea un nuevo perfil de cajero. */
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

const API_TAX_ROUTE = `${API_URL}/admin/tax_rate/iva`;

export const getTaxRate = async (): Promise<TaxRateRead> => {
    const response = await axios.get<TaxRateRead>(API_TAX_ROUTE);
    return response.data;
};

export const updateTaxRate = async (rate: number): Promise<TaxRateRead> => {
    // Enviamos el objeto TaxRateUpdate { rate: 0.19 }
    const response = await axios.put<TaxRateRead>(API_TAX_ROUTE, { rate });
    return response.data;
};