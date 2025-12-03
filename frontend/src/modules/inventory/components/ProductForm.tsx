import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Select, Switch, message, Card } from 'antd';
import type { Category, ProductCreate } from '/home/emily/Escritorio/SaleIntegrationSystem/frontend/src/modules/inventory/types.ts';
import { getCategories, createProductAdmin } from '/home/emily/Escritorio/SaleIntegrationSystem/frontend/src/modules/inventory/api.ts'; 
import { CheckOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import * as Antd from 'antd'; 

type ProductFormValues = ProductCreate;

interface ProductCreateFormProps {
    onSuccess: () => void; 
    onCancel: () => void; 
}

const ProductCreateForm: React.FC<ProductCreateFormProps> = ({ onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    // 1. Cargar categorías
    useEffect(() => {
        const loadCats = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
                if (data.length === 0) {
                    message.warning('No se encontraron categorías. Cree algunas antes de añadir productos.');
                } else {
                    // Seleccionar la primera categoría por defecto para activar el watch
                    form.setFieldsValue({ 
                        category_id: data[0].id, 
                        stock: 0, 
                        min_stock: 0, 
                        price: 0, 
                        is_iva_exempt: false,
                        discount: 0
                    });
                }
            } catch (e) {
                message.error('Error al cargar categorías.');
            }
        };
        loadCats();
    }, [form]);

    // 2. Observar cambios en el campo 'category_id'
    const categoryId = Form.useWatch('category_id', form); 

    // 3. Buscar si la categoría seleccionada es por peso
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    // Nota: Asegúrate de que tu backend devuelve 'is_weighted' en el objeto categoría
    const isWeighted = selectedCategory?.is_weighted ?? false; 

    // 4. Texto dinámico para las etiquetas
    const priceLabel = isWeighted ? 'Precio de Venta (x KG)' : 'Precio de Venta (x Unidad)';
    const stockLabel = isWeighted ? 'Stock Actual (Kg)' : 'Stock Actual (Unidad)';
    const minStockLabel = isWeighted ? 'Stock Mínimo (Kg)' : 'Stock Mínimo (Unidad)';

    // 5. Lógica de Envío
    const onFinish = async (values: ProductFormValues) => {
        setLoading(true);
        try {
            await createProductAdmin(values);
            message.success(`Producto "${values.name}" creado con éxito.`);
            form.resetFields(); 
            // Restaurar valores por defecto tras limpiar
            if (categories.length > 0) {
                form.setFieldsValue({ category_id: categories[0].id, stock: 0, min_stock: 0, price: 0 });
            }
            onSuccess(); 
        } catch (e: any) {
            const errorMessage = e.response?.data?.detail || 'Error al guardar el producto. Verifique los datos.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card 
            title="Crear Nuevo Producto"
            style={{ marginBottom: 24, width: 600 }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ stock: 0, min_stock: 0, price: 0, is_iva_exempt: false, bar_code: null, description: null, discount: 0 }}
            >
                {/* 1. Nombre y Código de Barras */}
                <Form.Item name="name" label="Nombre del Producto" rules={[{ required: true, message: 'Campo obligatorio' }]}>
                    <Input placeholder="Ej: Lomo Liso" />
                </Form.Item>
                <Form.Item name="bar_code" label="Código de Barras" rules={[{ required: true, message: 'Campo obligatorio' }]}>
                    <Input placeholder={isWeighted ? "Opcional para peso variable" : "Escanee código"} />
                </Form.Item>

                {/* 2. Descripción y Marca */}
                <Form.Item name="brand" label="Marca" rules={[{ required: true, message: 'Campo obligatorio' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Descripción">
                    <Input.TextArea rows={2} />
                </Form.Item>

                {/* 3. Categoría */}
                <Form.Item name="category_id" label="Categoría" rules={[{ required: true, message: 'Seleccione una categoría' }]}>
                    <Select placeholder="Seleccione Categoría" disabled={categories.length === 0} loading={categories.length === 0}>
                        {categories.map(cat => (
                            <Select.Option key={cat.id} value={cat.id}>
                                {cat.name} {cat.is_weighted ? "(KG)" : ""}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* 4. Números: Precio, Stock y Stock Mínimo (FLOAT) */}
                <Antd.Row gutter={16}>
                    <Antd.Col span={8}>
                        {/* AQUI ESTABA EL ERROR: Faltaba el InputNumber dentro */}
                        <Form.Item name="price" label={priceLabel} rules={[{ required: true, type: 'number', min: 0 }]}>
                            <InputNumber 
                                min={0} 
                                step={0.01} 
                                precision={2} 
                                style={{ width: '100%' }} 
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                                parser={(value: string | undefined) => parseFloat(value?.replace(/\$\s?|(,*)/g, '') || '0')} 
                            />
                        </Form.Item>
                    </Antd.Col>
                    <Antd.Col span={8}>
                        <Form.Item name="stock" label={stockLabel} rules={[{ required: true, type: 'number', min: 0 }]}>
                            <InputNumber 
                                min={0} 
                                step={isWeighted ? 0.001 : 1} // Permitir 3 decimales si es peso
                                precision={isWeighted ? 3 : 0} 
                                style={{ width: '100%' }} 
                            />
                        </Form.Item>
                    </Antd.Col>
                    <Antd.Col span={8}>
                        <Form.Item name="min_stock" label={minStockLabel} rules={[{ required: true, type: 'number', min: 0 }]}>
                            <InputNumber 
                                min={0} 
                                step={isWeighted ? 0.001 : 1} 
                                precision={isWeighted ? 3 : 0} 
                                style={{ width: '100%' }} 
                            />
                        </Form.Item>
                    </Antd.Col>
                </Antd.Row>
                
                {/* 5. IVA y Descuento */}
                <Form.Item name="is_iva_exempt" label="Exento de IVA (Tasa 19%)" valuePropName="checked">
                    <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
                </Form.Item>

                <Form.Item name="discount" label="Descuento (%)" rules={[{ type: 'number', min: 0, max: 100 }]}>
                    <InputNumber min={0} max={100} style={{ width: '100%' }} formatter={value => `${value}%`} parser={(value: string | undefined): number => parseFloat(value?.replace(/\$\s?|(,*)/g, '') || '0')} />
                </Form.Item>

                {/* 6. Botones de Acción */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />} style={{ marginRight: 8 }}>
                        Crear Producto
                    </Button>
                    <Button onClick={onCancel} disabled={loading}>
                        Cerrar Formulario
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ProductCreateForm;