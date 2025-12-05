
export interface CashierRead {
  id: number;
  name: string;
  rut: string;
  is_active: boolean;
}

export interface CashierLogin {
  rut: string;
}

// ✨ Lo que necesitan los formularios:
export interface CashierCreate {
  name: string;
  rut: string;
  is_active: boolean; // Se necesita para crear un cajero activo/inactivo
}

export interface CashierUpdate {
  name: string;
  is_active: boolean; // El RUT no se actualiza
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

export interface TaxRateRead {
    id: number;
    name: string;
    rate: number; // Decimal (ej: 0.19)
    last_updated: string;
}

export interface TaxRateUpdate {
    rate: number; // Decimal (ej: 0.19)
}