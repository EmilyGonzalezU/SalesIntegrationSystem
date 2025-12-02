import React, { useEffect, useState, useCallback } from "react";
import type { Category, CategoryUpdate } from "../../types/inventory"; 
import { Form, Input, Button, message, Card, Select, Spin, Switch } from "antd";
// Importamos updateCategory y getCategories
import { updateCategory, getCategories } from "../../services/apiConection"; 
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;

type CategoryFormValues = {
    is_weighted: boolean; name: string 
};

// Las props se simplifican a solo funciones de manejo
interface CategoryEditViewProps {
    onSuccess: () => void; // Función a ejecutar tras guardar exitosamente
    onCancel: () => void; // Función para cerrar el formulario
}

// ✨ ESTE COMPONENTE GESTIONA LA SELECCIÓN Y EDICIÓN
const CategoryEditView: React.FC<CategoryEditViewProps> = ({ 
    onSuccess, 
    onCancel 
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    
    // ESTADOS: Lista de categorías, la seleccionada y estado de carga
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Función para cargar categorías (memoizada para evitar re-creación)
    const loadCategories = useCallback(async () => {
        setLoadingCategories(true);
        try {
            const data = await getCategories();
            setAllCategories(data);
            if (data.length === 0) {
                message.info("No hay categorías para editar.");
            }
        } catch (e) {
            message.error("Error al cargar categorías. Verifique su Backend.");
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    // --- EFECTO 1: CARGAR TODAS LAS CATEGORÍAS AL INICIO y tras editar ---
    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    // --- EFECTO 2: CARGAR EL NOMBRE AL SELECCIONAR CATEGORÍA ---
    useEffect(() => {
        if (selectedCategory) {
            // Carga el nombre de la categoría seleccionada en el campo de input
            form.setFieldsValue({ name: selectedCategory.name, is_weighted: selectedCategory.is_weighted});
        } else {
            // Limpia el formulario si no hay nada seleccionado
            form.resetFields();
        }
        // Usamos selectedCategory.id como dependencia para evitar problemas si el objeto es el mismo
    }, [form, selectedCategory]); 
    
    // --- MANEJADOR DE CAMBIO EN EL DROPDOWN ---
    const handleCategorySelect = (categoryId: number) => {
        // Busca el objeto Category completo
        const category = allCategories.find(c => c.id === categoryId) || null;
        // Reinicia la selección si se selecciona la opción "vacía" (categoryId puede ser undefined)
        if (!category) {
            setSelectedCategory(null);
            return;
        }
        setSelectedCategory(category);
    };

    // --- LÓGICA ÚNICA: EDICIÓN ---
    const onFinish = async (values: CategoryFormValues) => {
        if (!selectedCategory) {
            message.warning("Por favor, seleccione una categoría para editar.");
            return;
        }

        setLoading(true);
        try {
            const updateData: CategoryUpdate = { name: values.name, is_weighted: values.is_weighted
            };

            await updateCategory(selectedCategory.id, updateData);
            
            message.success(`Categoría "${values.name}" actualizada con éxito.`);
            
            // 1. Recarga la lista para que el dropdown muestre el nuevo nombre
            await loadCategories();

            // 2. Reinicia la selección
            setSelectedCategory(null); 
            form.resetFields();
            onSuccess();
            
        } catch (e: any) {
            const errorMessage = e.response?.data?.detail || "Error al actualizar. Verifique el nombre o conexión.";
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    // Título dinámico
    const cardTitle = selectedCategory 
        ? `Editando: ${selectedCategory.name}` 
        : "Ingrese el nuevo nombre abajo";

    return (
        <Card title="Modificar Categoría Existente" style={{ marginBottom: 24, width: 450 }}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                
                {/* 1. DROPDOWN DE SELECCIÓN DE CATEGORÍA */}
                <Form.Item
                    label="Seleccionar Categoría a Editar"
                    required
                >
                    <Select
                        placeholder="Elija una categoría..."
                        // Usamos selectedCategory.id como valor
                        value={selectedCategory ? selectedCategory.id : undefined} 
                        onChange={handleCategorySelect}
                        loading={loadingCategories}
                        disabled={loadingCategories}
                    >
                        {allCategories.map(cat => (
                            <Option key={cat.id} value={cat.id}>
                                {cat.name}
                            </Option>
                        ))}
                    </Select>
                    {loadingCategories && <Spin size="small" style={{ marginLeft: 10 }} />}
                </Form.Item>
                
                {/* 2. CAMPO DE EDICIÓN (Solo visible si hay una categoría seleccionada) */}
                {selectedCategory && (
                    <>
                        <Card type="inner" title={cardTitle} style={{ marginTop: 15 }}>
                            <Form.Item
                                name="name"
                                label="Nuevo Nombre"
                                rules={[{ required: true, message: "Campo obligatorio" }]}
                                // Nota: useEffect ya setea el valor, pero es bueno tener una referencia.
                            >
                                <Input 
                                    placeholder="Nuevo nombre de la categoría" 
                                    autoFocus 
                                />
                            </Form.Item>
                        </Card>

                        {/* 3. BOTONES DE ACCIÓN */}
                        <Form.Item style={{ marginTop: 20 }}>
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
                                Cerrar
                            </Button>
                        </Form.Item>
                        <Form.Item
                                name="is_weighted"
                                label="Venta por Peso (KG)"
                                valuePropName="checked"
                                tooltip="Active si los productos de esta categoría se venden por peso."
                            >
                                <Switch 
                                    checkedChildren={<CheckOutlined />} 
                                    unCheckedChildren={<CloseOutlined />} 
                                />
                            </Form.Item>
                            {/* FIN NUEVO */}
                    </>
                )}
                
                {/* Mensaje cuando no hay selección */}
                {!selectedCategory && !loadingCategories && allCategories.length > 0 && (
                    <p style={{ textAlign: 'center', color: '#888' }}>
                        👆 Seleccione una categoría para modificar su nombre.
                    </p>
                )}
                
            </Form>
        </Card>
    );
};

export default CategoryEditView;