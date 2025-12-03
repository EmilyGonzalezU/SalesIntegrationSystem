import React, { useEffect, useState, useCallback } from "react";
import { Form, Input, InputNumber, Button, Select, Switch, message, Card, Row, Col, Spin } from 'antd';
import type { Category, Product, ProductUpdate } from "../../types/inventory";
import { getCategories, getProducts, updateProduct } from '../../services/apiConection'; 
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";


const { Option } = Select;

type ProductFormValues = ProductUpdate;

interface ProductEditViewProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const ProductEditView: React.FC<ProductEditViewProps> = ({ onSuccess, onCancel }) => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loadingData, setLoadingData] = useState(true);

    /** all important data */

    const loadData = useCallback(async () => {
        setLoadingData(true);
        try{
            const [productsData, categoriesData] = await Promise.all([
                getProducts(),
                getCategories()
            ]);
            setAllProducts(productsData);
            setAllCategories(categoriesData);
        } catch (e: any) {
            message.error("Error al cargar datos. Verificar API.");
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (selectedProduct){
            form.setFieldsValue(selectedProduct);
        } else {
            form.resetFields();
        }
    }, [form, selectedProduct]);

    const handleProductSelect = (id: number) => {
        const Product = allProducts.find(p => p.id === id) || null;
        setSelectedProduct(Product);
    }

    const categoryId = Form.useWatch('category_id', form);
    const selectedCategory = allCategories.find(cat => cat.id === categoryId);
    const isWeighted = selectedCategory?.is_weighted ?? false;

    const priceLabel = isWeighted ? 'Precio de Venta (KG)' : 'Precio de Venta (unidad)';
    const stockLabel = isWeighted ? 'Stock Actual (KG)' : 'Stock Actual (Unidad)';
    const minStockLabel = isWeighted ? 'Stock minimo (KG)' : 'Stock minimo (Unidad)';

    const onFinish = async (values: ProductFormValues) => {
        if (!selectedProduct){
            message.warning('Debe seleccionar un producto.');
            return;
        }
        setLoading(true);
        try{
            await updateProduct(selectedProduct.id, values as ProductUpdate);
            message.success(`Producto "${values.name}" actualizado con exito.`);
            
            await loadData();
            setSelectedProduct(null);
            form.resetFields();
            onSuccess();
        }   catch (e:any){
            const errorMsg = e.response?.data?.detail || "Errro al guardar el producto.";
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const formTitle = selectedProduct ? `Modificando:  ${selectedProduct.name}`
    : "Selecciona un producto del listado.";
    
    return (
         <Card title="Edición de Productos" style={{ marginBottom: 24, maxWidth: 800, margin: '0 auto' }}>
            <Spin spinning={loadingData} tip="Cargando productos y categorías...">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    
                    {/* DROPDOWN DE SELECCIÓN DE PRODUCTO */}
                    <Form.Item label="Producto a Editar" required>
                        <Select
                            placeholder="Buscar y seleccionar producto..."
                            value={selectedProduct ? selectedProduct.id : undefined}
                            onChange={handleProductSelect}
                            showSearch
                           
                            style={{ width: '100%' }}
                        >
                            {allProducts.map(p => (
                                <Option key={p.id} value={p.id}>
                                    {p.name} - ID: {p.id}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {selectedProduct && (
                        <Card type="inner" title={formTitle} style={{ marginTop: 20 }}>

                            {/* El ID y Categoría son solo para lectura en edición */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="id" label="ID del Producto">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="category_id" label="Categoría Asignada">
                                        <Select>
                                            {allCategories.map(cat => (
                                                <Option key={cat.id} value={cat.id}>
                                                    {cat.name} {cat.is_weighted ? "(KG)" : ""}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            
                            <Form.Item name="name" label="Nombre del Producto" rules={[{ required: true, message: 'Campo obligatorio' }]}>
                                <Input />
                            </Form.Item>
                            
                            <Form.Item name="bar_code" label="Código de Barras">
                                {/* Se deshabilita para evitar cambios críticos en la clave */}
                                <Input /> 
                            </Form.Item>

                            <Form.Item name="brand" label="Marca" rules={[{ required: true, message: 'Campo obligatorio' }]}>
                                <Input />
                            </Form.Item>
                            
                            <Form.Item name="description" label="Descripción">
                                <Input.TextArea rows={2} />
                            </Form.Item>

                            {/* 4. Números: Precio, Stock y Stock Mínimo (FLOAT) - Con Etiquetas Dinámicas */}
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item name="price" label={priceLabel} rules={[{ required: true, type: 'number', min: 0 }]}>
                                        <InputNumber 
                                            min={0} 
                                            step={0.01} 
                                            precision={2} 
                                            style={{ width: '100%' }} 
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="stock" label={stockLabel} rules={[{ required: true, type: 'number', min: 0 }]}>
                                        <InputNumber 
                                            min={0} 
                                            step={isWeighted ? 0.001 : 1} 
                                            precision={isWeighted ? 3 : 0} 
                                            style={{ width: '100%' }} 
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="min_stock" label={minStockLabel} rules={[{ required: true, type: 'number', min: 0 }]}>
                                        <InputNumber 
                                            min={0} 
                                            step={isWeighted ? 0.001 : 1} 
                                            precision={isWeighted ? 3 : 0} 
                                            style={{ width: '100%' }} 
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            {/* 5. IVA y Descuento */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="is_iva_exempt" label="Exento de IVA" valuePropName="checked">
                                        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="discount" label="Descuento (%)" rules={[{ type: 'number', min: 0, max: 100 }]}>
                                        <InputNumber min={0} max={100} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>


                            {/* 6. Botones de Acción */}
                            <Form.Item style={{ marginTop: 20 }}>
                                <Button type="primary" htmlType="submit" loading={loading} icon={<EditOutlined />} style={{ marginRight: 8 }}>
                                    Guardar Cambios
                                </Button>
                                <Button onClick={onCancel} disabled={loading}>
                                    Cerrar Edición
                                </Button>
                            </Form.Item>
                        </Card>
                    )}

                    {!selectedProduct && !loadingData && allProducts.length > 0 && (
                        <p style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
                            👆 Utilice el buscador para seleccionar un producto.
                        </p>
                    )}

                </Form>
            </Spin>
        </Card>
    );
};

export default ProductEditView;