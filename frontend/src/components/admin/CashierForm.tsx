import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Card, Switch } from "antd";
import { SaveOutlined, CheckOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import type { CashierCreate } from "../../types/inventory";
import { createCashier } from "../../services/apiConection";

type CashierFormValues = CashierCreate; 

interface CashierCreateFormProps {
    onSuccess: () => void; 
    onCancel: () => void;
}

const CashierCreateForm: React.FC<CashierCreateFormProps> = ({ onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    
    // Al montar, inicializar campos
    useEffect(() => {
        form.resetFields();
        form.setFieldsValue({ is_active: true }); // Por defecto, el nuevo cajero está ACTIVO
    }, [form]);

    // Lógica para Crear
    const onFinish = async (values: CashierFormValues) => {
        setLoading(true);
        try {
            await createCashier(values);
            message.success(`Cajero ${values.name} registrado con éxito.`);
            form.resetFields();
            form.setFieldsValue({ is_active: true }); 
            onSuccess(); 
        } catch (e: any) {
            const errorMessage =
                e.response?.data?.detail || "Error al registrar. Verifique que el RUT sea único.";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Registrar Nuevo Cajero" style={{ marginBottom: 24, width: 450 }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                
                <Form.Item
                    name="name"
                    label="Nombre Completo"
                    rules={[{ required: true, message: "El nombre es obligatorio" }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Ej. Juan Pérez" autoFocus />
                </Form.Item>

                <Form.Item
                    name="rut"
                    label="RUT (Identificador Único)"
                    rules={[{ required: true, message: "El RUT es obligatorio" }]}
                    tooltip="El RUT se usará para iniciar sesión en el POS."
                >
                    <Input placeholder="Ej. 12345678-9" /> 
                </Form.Item>

                <Form.Item
                    name="is_active"
                    label="Estado (Activo/Inactivo)"
                    valuePropName="checked"
                    tooltip="Solo los cajeros activos pueden ingresar al sistema POS."
                >
                    <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<SaveOutlined />}
                        style={{ marginRight: 8 }}
                    >
                        Registrar Cajero
                    </Button>

                    <Button onClick={onCancel} disabled={loading}>
                        Cancelar
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CashierCreateForm;