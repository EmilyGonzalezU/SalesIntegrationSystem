import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Card, Switch } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import type { CashierRead, CashierUpdate } from "../../types/inventory";
import { updateCashier } from "../../services/apiConection";

// El cuerpo de la petición solo contiene campos editables
type CashierFormValues = CashierUpdate; 

interface CashierEditFormProps {
    onSuccess: () => void; 
    onCancel: () => void;
    // ✨ OBLIGATORIO: El objeto Cajero a editar
    cashierToEdit: CashierRead; 
}

const CashierEditForm: React.FC<CashierEditFormProps> = ({ onSuccess, onCancel, cashierToEdit }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    
    // Cargar datos del cajero al montar o si el objeto cambia
    useEffect(() => {
        // Cargar todos los valores del objeto CashierRead
        form.setFieldsValue(cashierToEdit);
    }, [form, cashierToEdit]);

    // Lógica para Editar
    const onFinish = async (values: CashierFormValues) => {
        setLoading(true);
        try {
            // MODO EDICIÓN (PUT): Se envían solo los campos name y is_active
            const updateData: CashierUpdate = { name: values.name, is_active: values.is_active };
            
            await updateCashier(cashierToEdit.id, updateData);
            message.success(`Cajero ${values.name} actualizado.`);
            
            onSuccess(); // Cierra el modal y recarga la tabla
        } catch (e: any) {
            const errorMessage =
                e.response?.data?.detail || "Error al actualizar el perfil.";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title={`Modificar Cajero: ${cashierToEdit.name}`} style={{ marginBottom: 24, width: 450 }}>
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
                    // El RUT no es editable después de la creación
                    tooltip="El RUT no se puede modificar después del registro inicial."
                >
                    <Input disabled /> 
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
                        icon={<EditOutlined />}
                        style={{ marginRight: 8 }}
                    >
                        Guardar Cambios
                    </Button>

                    <Button onClick={onCancel} disabled={loading}>
                        Cancelar
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CashierEditForm;