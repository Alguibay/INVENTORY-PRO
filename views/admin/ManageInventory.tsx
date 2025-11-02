import React, { useState, useEffect } from 'react';
import { Inventory, Product, Warehouse } from '../../types';
import { supabase } from '../../services/supabase';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import EditInventoryForm from './EditInventoryForm';
import AddInventoryForm from './AddInventoryForm';
import { isInventoryArray, downloadAsXLSX } from '../../utils/fileHelpers';
import UploadDataForm from './UploadDataForm';
import { CloudArrowDownIcon } from '../../components/icons/Icons';


type InventoryDisplayItem = Inventory & { productName: string; warehouseName: string };

const ManageInventory: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryDisplayItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            const { data: invData, error: invError } = await supabase.from('inventario').select();
            const { data: prodData, error: prodError } = await supabase.from('productos').select();
            const { data: whData, error: whError } = await supabase.from('bodegas').select();

            if (invError || prodError || whError) {
                alert('Error al cargar el inventario.');
            } else {
                const productMap = new Map(prodData.map(p => [p.sku, p.nombre]));
                const warehouseMap = new Map(whData.map(w => [w.id, w.nombre]));
                
                const displayData = invData.map(item => ({
                    ...item,
                    productName: productMap.get(item.sku) || 'N/A',
                    warehouseName: warehouseMap.get(item.idBodega) || 'N/A'
                }));
                setInventory(displayData);
            }
            setLoading(false);
        };
        fetchInventory();
    }, [version]);

    // Fix: Changed `item` type from `Inventory` to `InventoryDisplayItem`
    // This resolves the type inference issue in the `Table` component,
    // ensuring that the `columns` prop correctly aligns with the `data` prop's type.
    const handleEdit = (item: InventoryDisplayItem) => {
        setSelectedItem(item);
        setEditModalOpen(true);
    };

    const handleUpdateItem = async (updatedItem: Inventory) => {
        const { id, ...itemData } = updatedItem;
        const { error } = await supabase.from('inventario').update(itemData).eq('id', id);
        if (error) {
            alert('Error al actualizar el inventario.');
        } else {
            setEditModalOpen(false);
            setSelectedItem(null);
            setVersion(v => v + 1);
        }
    };
    
    const handleAddItem = async (newItem: Omit<Inventory, 'id'>) => {
        const { error } = await supabase.from('inventario').insert([newItem]);
        if (error) {
            alert('Error al agregar al inventario.');
        } else {
            setAddModalOpen(false);
            setVersion(v => v + 1);
        }
    };
    
    const handleUploadInventory = async (data: Partial<Inventory>[]) => {
        const itemsToInsert = data.map(i => ({
            ...i,
            fecha: new Date().toISOString().split('T')[0],
            estado: i.estado ?? true
        }));
        const { error } = await supabase.from('inventario').insert(itemsToInsert);
         if (error) {
             alert(`Error al cargar inventario: ${error.message}`);
        } else {
            alert('Inventario cargado exitosamente.');
            setUploadModalOpen(false);
            setVersion(v => v + 1);
        }
    };

    const columns = [
        { key: 'sku', header: 'SKU' },
        { key: 'productName', header: 'Producto' },
        { key: 'cantidad', header: 'Cantidad' },
        { key: 'warehouseName', header: 'Bodega' },
        { key: 'estado', header: 'Estado' },
    ] as { key: keyof InventoryDisplayItem; header: string }[];

    if (loading) return <div>Cargando inventario...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Gestión de Inventario</h2>
                <div className="flex items-center space-x-2">
                     <button onClick={() => downloadAsXLSX(inventory, 'inventario')} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center">
                        <CloudArrowDownIcon className="w-5 h-5 mr-2" />
                        Descargar Datos
                    </button>
                    <button onClick={() => setUploadModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Carga Masiva</button>
                    <button onClick={() => setAddModalOpen(true)} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary">Añadir Stock</button>
                </div>
            </div>
            <Table columns={columns} data={inventory} onEdit={handleEdit} />
             <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Inventario">
                {selectedItem && <EditInventoryForm inventoryItem={selectedItem} onSubmit={handleUpdateItem} onCancel={() => setEditModalOpen(false)} />}
            </Modal>
             <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Añadir Stock">
                <AddInventoryForm onSubmit={handleAddItem} onCancel={() => setAddModalOpen(false)} />
            </Modal>
             <Modal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Carga Masiva de Inventario">
                <UploadDataForm
                    onUpload={handleUploadInventory}
                    onCancel={() => setUploadModalOpen(false)}
                    dataValidator={isInventoryArray}
                    templateColumns={['sku', 'cantidad', 'idBodega', 'estado']}
                    title="Cargar Inventario desde Excel"
                />
            </Modal>
        </div>
    );
};

export default ManageInventory;