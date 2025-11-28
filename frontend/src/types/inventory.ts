
export interface Category {
    id: number;
    name: string;
}
   

export interface Product{
    id: number;
    bar_code: string;
    name: string;
    category_id: number;
    description: string;
    brand: string;
    stock: number;
    min_stock: number;
    price: GLfloat;
    discount: GLfloat;
    /** la caterogria se carga junto con la API*/
    category?: Category;    
}

export interface ProductCreate {
    bar_code: string;
    name: string;
    category_id: number;
    description: string;
    brand: string;
    stock: number;
    min_stock: number;
    price: GLfloat;
    discount: GLfloat;
}
