import React, { useState } from 'react';
import { Typography, Card, Button, Divider } from 'antd'; // Añadido Divider de AntD
import ProductForm from '/home/emily/Escritorio/SaleIntegrationSystem/frontend/src/components/admin/ProductForm.tsx'; // Asumo que este es el formulario de producto
import CategoryForm from '/home/emily/Escritorio/SaleIntegrationSystem/frontend/src/components/admin/categoryForm';   // Asumo que este es el formulario de categoría
import CategoryEditForm from '/home/emily/Escritorio/SaleIntegrationSystem/frontend/src/components/admin/categoryEdit';
const { Title } = Typography;

const InventoryManagement: React.FC = () => {
    // Usamos dos estados separados para controlar la visibilidad de cada formulario
    const [showProductForm, setShowProductForm] = useState(true);
    const [showCategoryForm, setShowCategoryForm] = useState(true);
    const [showCategoryEditForm, setShowCategoryEditForm] = useState(true);

    // Funciones de callback
    const handleProductSuccess = () => {
        setShowProductForm(false);
        // Aquí iría la lógica para recargar la lista de productos
        alert('Producto creado (simulado).');
    };
    
    const handleCategorySuccess = () => {
        setShowCategoryForm(false);
        // Aquí iría la lógica para recargar la lista de categorías
        alert('Categoría creada (simulada).');
    };

    const handleCategoryEditSuccess = () => {
        setShowCategoryEditForm(false);
        // Aquí iría la lógica para recargar la lista de categorías
        alert('Categoría modificada (simulada).');
    };

    return (
        <div style={{ padding: '20px', maxWidth: 1000, margin: '0 auto' }}>
            <Title level={2}>Inventario (Previsualización de Formularios)</Title>
            <p>Vistas temporales para verificar el diseño de ambos formularios de creación.</p>
            
            <Divider >Creación de Productos</Divider>
            
            <Button onClick={() => setShowProductForm(true)} type="primary" style={{ marginBottom: 20 }} disabled={showProductForm}>
                Mostrar Formulario Producto
            </Button>

            {/* --- 1. FORMULARIO DE PRODUCTOS --- */}
            {showProductForm && (
                <Card title="1. Formulario Producto" style={{ marginBottom: 40 }}>
                    <ProductForm 
                        onSuccess={handleProductSuccess} 
                        onCancel={() => setShowProductForm(false)}
                    />
                </Card>
            )}

            <Divider >Creación de Categorías</Divider>

            <Button onClick={() => setShowCategoryForm(true)} type="primary" style={{ marginBottom: 20 }} disabled={showCategoryForm}>
                Mostrar Formulario Categoría
            </Button>

            {/* --- 2. FORMULARIO DE CATEGORÍAS --- */}
            {showCategoryForm && (
                <Card title="2. Formulario Categoría" style={{ width: 450 }}>
                    <CategoryForm 
                        onSuccess={handleCategorySuccess}
                        onCancel={() => setShowCategoryForm(false)}
                    />
                </Card>
            )}

           <Divider >Edición de Categorías</Divider>

            <Button 
                onClick={() => setShowCategoryEditForm(true)} 
                type="primary" 
                style={{ marginBottom: 20 }} 
                disabled={showCategoryEditForm}
            >
                Mostrar Formulario Edición
            </Button>

            {/* --- 3. FORMULARIO DEDICADO A EDICIÓN --- */}
            {showCategoryEditForm && (
                <Card title="3. Formulario Edición Categoría" style={{ width: 450 }}>
                    <CategoryEditForm // <-- ¡COMPONENTE CORRECTO!
                        onSuccess={handleCategoryEditSuccess}
                        onCancel={() => setShowCategoryEditForm(false)}
                    />
                </Card>
            )}
        </div>
    );
};

export default InventoryManagement;