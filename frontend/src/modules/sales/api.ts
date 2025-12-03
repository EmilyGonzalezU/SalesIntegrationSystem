import axios from 'axios';
import type {  SaleCreate, SaleRead
} from '/home/emily/Escritorio/SaleIntegrationSystem/frontend/src/modules/sales/types.ts';
// URL del Backend donde corre Uvicorn (Asegúrate de que esta ruta sea la correcta)
const API_URL = 'http://127.0.0.1:8000'; 

export const createSale = async (saleData: SaleCreate): Promise<SaleRead> => {
    const response = await axios.post<SaleRead>(`${API_URL}/sales/`, saleData);
    return response.data;
};

export const getDailySalesReport = async (targetDate: string): Promise<any> => {
    const response = await axios.get(`${API_URL}/admin/reports/daily_sales?target_date=${targetDate}`);
    return response.data;
};