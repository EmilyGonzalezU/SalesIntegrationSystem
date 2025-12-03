import React, { useState } from 'react';
import { Typography, Card, Button, Divider } from 'antd'; // Añadido Divider de AntD
import ProductForm from '.././modules/inventory/components/ProductForm'; // Asumo que este es el formulario de producto
import CategoryForm from '.././modules/inventory/components//categoryForm';   // Asumo que este es el formulario de categoría
import CategoryEditForm from '.././modules/inventory/components/categoryEdit';
import ProductEditForm from '.././modules/inventory/components/productEdit';
import CashierForm from '.././modules/admin/components/CashierForm';
import CashierEditForm from '.././modules/admin/components/cashierEdit';

const { Title } = Typography;

const InventoryManagement: React.FC = () => {
    // Usamos dos estados separados para controlar la visibilidad de cada formulario
    const [showProductForm, setShowProductForm] = useState(true);
    const [showCategoryForm, setShowCategoryForm] = useState(true);
    const [showCategoryEditForm, setShowCategoryEditForm] = useState(true);
    const [showProductEditForm, setShowProductEditForm] = useState(true);
    const [showCashierForm, setShowCashierForm] = useState(true);
    const [showCashierEditForm, setShowCashierEditForm] = useState(true);

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

    const handleProductEditSuccess = () => {
        setShowProductEditForm(false);
        // Aquí iría la lógica para recargar la lista de categorías
        alert('Categoría modificada (simulada).');
    };

    const handleCashierSuccess = () => {
        setShowCashierForm(false);
        // Aquí iría la lógica para recargar la lista de categorías
        alert('Cajero creado');
    };

    const handleCashierEditSuccess = () => {
        setShowCashierEditForm(false);
        // Aquí iría la lógica para recargar la lista de categorías
        alert('Cajero creado');
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


           <Divider >Edición de Productos</Divider>

            <Button 
                onClick={() => setShowProductEditForm(true)} 
                type="primary" 
                style={{ marginBottom: 20 }} 
                disabled={showProductEditForm}
            >
                Mostrar Formulario Edición
            </Button>

            {/* --- 3. FORMULARIO DEDICADO A EDICIÓN --- */}
            {showProductEditForm && (
                <Card title="3. Formulario Edición Productos" style={{ width: 450 }}>
                    <ProductEditForm // <-- ¡COMPONENTE CORRECTO!
                        onSuccess={handleProductEditSuccess}
                        onCancel={() => setShowProductEditForm(false)}
                    />
                </Card>
            )}

             <Divider >Creacion cajeros</Divider>

            <Button 
                onClick={() => setShowProductEditForm(true)} 
                type="primary" 
                style={{ marginBottom: 20 }} 
                disabled={showProductEditForm}
            >
                Mostrar Formulario Edición
            </Button>

            {/* --- 3. FORMULARIO DEDICADO A EDICIÓN --- */}
            {showCashierForm && (
                <Card title="3. Formulario Edición Productos" style={{ width: 450 }}>
                    <CashierForm // <-- ¡COMPONENTE CORRECTO!
                        onSuccess={handleCashierSuccess}
                        onCancel={() => setShowCashierForm(false)}
                    />
                </Card>
            )}
            <Divider >EDIT cajeros</Divider>

            <Button 
                onClick={() => setShowCashierEditForm(true)} 
                type="primary" 
                style={{ marginBottom: 20 }} 
                disabled={showProductEditForm}
            >
                Mostrar Formulario Edición
            </Button>

            {/* --- 3. FORMULARIO DEDICADO A EDICIÓN --- */}
            {showCashierEditForm && (
                <Card title="3. Formulario Edición Productos" style={{ width: 450 }}>
                    <CashierEditForm // <-- ¡COMPONENTE CORRECTO!
                        onSuccess={handleCashierEditSuccess}
                        onCancel={() => setShowCashierEditForm(false)}
                    />
                </Card>
            )}
        </div>
    );
};

export default InventoryManagement;