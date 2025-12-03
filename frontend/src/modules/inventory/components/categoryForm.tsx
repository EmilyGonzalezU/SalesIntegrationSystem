import React, { useEffect, useState } from "react";
import type { CategoryCreate } from '/home/emily/Escritorio/SaleIntegrationSystem/frontend/src/modules/inventory/types.ts';
import { Form, Input, Button, message, Card, Switch } from "antd"; // Importamos Switch
import { createCategory } from '/home/emily/Escritorio/SaleIntegrationSystem/frontend/src/modules/inventory/api.ts';
import { SaveOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons"; // Importamos íconos

// El tipo de valores a enviar al formulario (name y is_weighted)
type CategoryFormValues = CategoryCreate;

interface CategoryFormProps {
    onSuccess: () => void; 
    onCancel: () => void; 
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.resetFields();
        // Establecer un valor por defecto para el Switch (NO por peso)
        form.setFieldsValue({ is_weighted: false }); 
    }, [form]);

    // Lógica para Crear
    const onFinish = async (values: CategoryFormValues) => {
        setLoading(true);
        try {
            await createCategory(values);
            message.success(`Categoría "${values.name}" creada.`);
            form.resetFields();
            form.setFieldsValue({ is_weighted: false }); // Mantener el valor por defecto
            onSuccess(); 
        } catch (e: any) {
            const errorMessage =
                e.response?.data?.detail || "Error al crear la categoría. Puede que ya exista.";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Crear Nueva Categoría" style={{ marginBottom: 24, width: 400 }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="Nombre Categoría"
                    rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                    <Input placeholder="Ej. Carnes, Lácteos, Fiambres" autoFocus />
                </Form.Item>

                {/* ✨ NUEVO: Switch para la opción por peso */}
                <Form.Item
                    name="is_weighted"
                    label="Venta por Peso (KG)"
                    valuePropName="checked" // Para que el Switch use 'checked' en lugar de 'value'
                    tooltip="Active si los productos de esta categoría (ej. carnes, fiambres) se venden por peso."
                >
                    <Switch 
                        checkedChildren={<CheckOutlined />} 
                        unCheckedChildren={<CloseOutlined />} 
                    />
                </Form.Item>
                {/* FIN NUEVO */}

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<SaveOutlined />}
                        style={{ marginRight: 8 }}
                    >
                        Crear Categoría
                    </Button>
                    <Button onClick={onCancel} disabled={loading}>
                        Cancelar
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CategoryForm;