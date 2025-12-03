import React, { useEffect, useState, useCallback } from "react";
import { Form, Input, Button, Select, Switch, message, Card, Spin } from 'antd';
import type { CashierRead, CashierUpdate } from '/home/emily/Escritorio/SaleIntegrationSystem/frontend/src/modules/admin/types.ts';
import { getCashiers, updateCashier } from '/home/emily/Escritorio/SaleIntegrationSystem/frontend/src/modules/admin/api.ts'; 
import { EditOutlined, UserOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Option } = Select;

// El tipo de datos que maneja el formulario
type CashierFormValues = CashierUpdate;

interface CashierEditViewProps {
    onSuccess: () => void;
    onCancel: () => void;
    // Opcional: Si se pasa, el formulario se abre directamente con este cajero
    initialCashier?: CashierRead | null; 
}

const CashierEditView: React.FC<CashierEditViewProps> = ({ onSuccess, onCancel, initialCashier }) => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Estados para la lógica de selección y datos
    const [allCashiers, setAllCashiers] = useState<CashierRead[]>([]);
    const [selectedCashier, setSelectedCashier] = useState<CashierRead | null>(initialCashier || null);
    const [loadingData, setLoadingData] = useState(true);

    /** 1. Cargar datos (Lista de Cajeros) */
    const loadData = useCallback(async () => {
        setLoadingData(true);
        try {
            // Solo necesitamos obtener la lista de cajeros
            const data = await getCashiers();
            setAllCashiers(data);
        } catch (e: any) {
            message.error("Error al cargar la lista de cajeros. Verifique API.");
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    /** 2. Efecto para cargar los datos en el formulario cuando se selecciona un cajero */
    useEffect(() => {
        if (selectedCashier) {
            form.setFieldsValue(selectedCashier);
        } else {
            form.resetFields();
        }
    }, [form, selectedCashier]);

    /** 3. Manejador de selección desde el Dropdown */
    const handleCashierSelect = (id: number) => {
        const cashier = allCashiers.find(c => c.id === id) || null;
        setSelectedCashier(cashier);
    }

    /** 4. Lógica de Envío (UPDATE) */
    const onFinish = async (values: CashierFormValues) => {
        if (!selectedCashier) {
            message.warning('Debe seleccionar un cajero.');
            return;
        }
        setLoading(true);
        try {
            // Preparamos los datos para enviar (name e is_active)
            const updatePayload: CashierUpdate = {
                name: values.name,
                is_active: values.is_active
            };

            await updateCashier(selectedCashier.id, updatePayload);
            message.success(`Cajero "${values.name}" actualizado con éxito.`);
            
            // Recargar datos para refrescar la lista y limpiar selección si no venía del dashboard
            await loadData();
            
            if (!initialCashier) {
                setSelectedCashier(null);
                form.resetFields();
            }
            
            onSuccess();
        } catch (e: any) {
            const errorMsg = e.response?.data?.detail || "Error al actualizar el cajero.";
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const formTitle = selectedCashier 
        ? `Editando perfil de: ${selectedCashier.name}`
        : "Seleccione un cajero del listado";
    
    return (
         <Card title="Gestión de Perfiles de Cajero" style={{ marginBottom: 24, maxWidth: 600, margin: '0 auto' }}>
            <Spin spinning={loadingData} tip="Cargando cajeros...">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    
                    {/* DROPDOWN DE SELECCIÓN (Visible si no se pasó un cajero inicial o si se quiere cambiar) */}
                    <Form.Item label="Seleccionar Cajero" required={!selectedCashier}>
                        <Select
                            placeholder="Buscar por nombre o RUT..."
                            value={selectedCashier ? selectedCashier.id : undefined}
                            onChange={handleCashierSelect}
                            showSearch
                            optionFilterProp="children"
                            disabled={!!initialCashier} // Si viene del dashboard, bloqueamos el cambio
                            style={{ width: '100%' }}
                        >
                            {allCashiers.map(c => (
                                <Option key={c.id} value={c.id}>
                                    {c.name} - {c.rut}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* FORMULARIO DE EDICIÓN (Se muestra al seleccionar un cajero) */}
                    {selectedCashier && (
                        <Card type="inner" title={formTitle} style={{ marginTop: 20, backgroundColor: '#fafafa' }}>
                            
                            <Form.Item 
                                name="name" 
                                label="Nombre Completo" 
                                rules={[{ required: true, message: 'El nombre es obligatorio' }]}
                            >
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>
                            
                            <Form.Item 
                                name="rut" 
                                label="RUT (Identificador)"
                                tooltip="El RUT no se puede modificar después de la creación."
                            >
                                <Input disabled /> 
                            </Form.Item>

                            <Form.Item 
                                name="is_active" 
                                label="Estado del Cajero" 
                                valuePropName="checked"
                                tooltip="Desactivar para impedir el acceso al sistema."
                            >
                                <Switch 
                                    checkedChildren={<CheckOutlined />} 
                                    unCheckedChildren={<CloseOutlined />} 
                                />
                            </Form.Item>

                            {/* Botones de Acción */}
                            <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading} 
                                    icon={<EditOutlined />} 
                                    style={{ marginRight: 8 }}
                                    block
                                >
                                    Guardar Cambios
                                </Button>
                                {!initialCashier && (
                                    <Button onClick={() => setSelectedCashier(null)} disabled={loading} style={{ marginTop: 10 }} block>
                                        Cancelar Selección
                                    </Button>
                                )}
                            </Form.Item>
                        </Card>
                    )}

                    {!selectedCashier && !loadingData && allCashiers.length > 0 && (
                        <p style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
                            👆 Busque un cajero para ver sus detalles.
                        </p>
                    )}

                </Form>
            </Spin>
        </Card>
    );
};

export default CashierEditView;