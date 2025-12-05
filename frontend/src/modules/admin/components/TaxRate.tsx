import React, { useEffect, useState } from 'react';
import { Card, Form, InputNumber, Button, Typography, Statistic, message, Alert, Spin, Space } from 'antd';
import { PercentageOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { getTaxRate, updateTaxRate } from '../api'; 
import type { TaxRateRead } from '../types';

const { Title } = Typography;

// 1. DEFINIR LA INTERFAZ DE PROPS (Para que acepte onSuccess y onCancel)
interface TaxSettingsViewProps {
    onSuccess?: () => void; // Opcional, por si se usa como vista independiente
    onCancel?: () => void;  // Opcional
}

// 2. RECIBIR LAS PROPS EN EL COMPONENTE
const TaxSettingsView: React.FC<TaxSettingsViewProps> = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [taxData, setTaxData] = useState<TaxRateRead | null>(null);
    const [form] = Form.useForm();

    const loadTaxData = async () => {
        setLoading(true);
        try {
            const data = await getTaxRate();
            setTaxData(data);
            form.setFieldsValue({ percentage: data.rate * 100 });
        } catch (error) {
            message.error("Error al cargar la configuración de impuestos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTaxData();
    }, []);

    const onFinish = async (values: { percentage: number }) => {
        setSaving(true);
        try {
            const decimalRate = values.percentage / 100;
            const updatedData = await updateTaxRate(decimalRate);
            setTaxData(updatedData);
            message.success(`IVA actualizado correctamente al ${values.percentage}%`);
            
            // 3. LLAMAR A ON SUCCESS (Si existe)
            if (onSuccess) onSuccess();
            
        } catch (error) {
            message.error("No se pudo actualizar la tasa de impuestos.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            {/* Quitamos el Title y p si lo vas a usar dentro de un Modal/Card pequeño */}
            
            <Spin spinning={loading}>
                {/* Quitamos el <Card> externo si el padre ya tiene un Card, o lo dejamos si es vista completa */}
                
                {/* Información Actual */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Statistic 
                        title="Tasa Actual" 
                        value={taxData ? taxData.rate * 100 : 0} 
                        precision={1} 
                        suffix="%" 
                        prefix={<PercentageOutlined />}
                    />
                    <Statistic 
                        title="Última Actualización" 
                        value={taxData ? new Date(taxData.last_updated).toLocaleDateString() : '-'} 
                        valueStyle={{ fontSize: 14 }}
                    />
                </div>

                <Alert 
                    message="Cambio Global" 
                    description="Afectará a todas las ventas futuras."
                    type="warning" 
                    showIcon 
                    style={{ marginBottom: 24 }}
                />

                <Form 
                    form={form} 
                    layout="vertical" 
                    onFinish={onFinish}
                    initialValues={{ percentage: 19 }}
                >
                    <Form.Item
                        label="Nueva Tasa de IVA (%)"
                        name="percentage"
                        rules={[
                            { required: true, message: 'Ingrese un porcentaje' },
                            { type: 'number', min: 0, max: 100, message: '0 - 100' }
                        ]}
                    >
                        <InputNumber 
                            min={0} 
                            max={100} 
                            step={0.1}
                            formatter={(value) => `${value}%`}
                           parser={(value: string | undefined): number => parseFloat(value?.replace(/\$\s?|(,*)/g, '') || '0')}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    {/* 4. BOTONES DE ACCIÓN (GUARDAR Y CANCELAR) */}
                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            {onCancel && (
                                <Button onClick={onCancel} disabled={saving}>
                                    Cancelar
                                </Button>
                            )}
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                icon={<SaveOutlined />} 
                                loading={saving}
                            >
                                Guardar Tasa
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
};

export default TaxSettingsView;