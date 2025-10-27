import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { supabase } from '../../services/supabase';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import EditProductForm from './EditProductForm';
import AddProductForm from './AddProductForm';
import { isProductArray, downloadAsXLSX } from '../../utils/fileHelpers';
import UploadDataForm from './UploadDataForm';
import { CloudArrowDownIcon } from '../../components/icons/Icons';


const ManageProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('productos').select();
            if (error) {
                console.error("Error fetching products", error);
                alert('Error al cargar productos.');
            } else {
                setProducts(data || []);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [version]);

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    };

    const handleUpdateProduct = async (updatedProduct: Product) => {
        const { error } = await supabase.from('productos').update(updatedProduct.id, updatedProduct);
        if (error) {
            alert('Error al actualizar producto.');
        } else {
            setEditModalOpen(false);
            setSelectedProduct(null);
            setVersion(v => v + 1);
        }
    };
    
    const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
        const { error } = await supabase.from('productos').insert(newProduct);
        if (error) {
            alert('Error al agregar producto.');
        } else {
            setAddModalOpen(false);
            setVersion(v => v + 1);
        }
    };
    
    const handleUploadProducts = async (data: Partial<Product>[]) => {
        const productsToInsert = data.map(p => ({
            ...p,
            estado: p.estado ?? true,
            nombreLargo: p.nombreLargo || p.nombre || '',
            descripcion: p.descripcion || ''
        } as Omit<Product, 'id'>));
        const { error } = await supabase.from('productos').insertBulk(productsToInsert);
        if (error) {
             alert(`Error al cargar productos: ${error.message}`);
        } else {
            alert('Productos cargados exitosamente.');
            setUploadModalOpen(false);
            setVersion(v => v + 1);
        }
    };

    const columns = [
        { key: 'sku', header: 'SKU' },
        { key: 'nombre', header: 'Nombre' },
        { key: 'tipo', header: 'Tipo' },
        { key: 'ubicacionBodega', header: 'Ubicación' },
        { key: 'estado', header: 'Estado' },
    ] as { key: keyof Product; header: string }[];

    if (loading) return <div>Cargando productos...</div>;

    return (
        <div>
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Gestión de Productos</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={() => downloadAsXLSX(products, 'productos')} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center">
                        <CloudArrowDownIcon className="w-5 h-5 mr-2" />
                        Descargar Datos
                    </button>
                    <button onClick={() => setUploadModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Carga Masiva</button>
                    <button onClick={() => setAddModalOpen(true)} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary">Añadir Producto</button>
                </div>
            </div>
            <Table columns={columns} data={products} onEdit={handleEdit} />
             
            <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Producto">
                {selectedProduct && <EditProductForm product={selectedProduct} onSubmit={handleUpdateProduct} onCancel={() => setEditModalOpen(false)} />}
            </Modal>
             <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Añadir Nuevo Producto">
                <AddProductForm onSubmit={handleAddProduct} onCancel={() => setAddModalOpen(false)} />
            </Modal>
             <Modal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Carga Masiva de Productos">
                <UploadDataForm
                    onUpload={handleUploadProducts}
                    onCancel={() => setUploadModalOpen(false)}
                    dataValidator={isProductArray}
                    templateColumns={['sku', 'nombre', 'nombreLargo', 'descripcion', 'tipo', 'ubicacionBodega', 'estado']}
                    title="Cargar Productos desde Excel"
                />
            </Modal>
        </div>
    );
};

export default ManageProducts;