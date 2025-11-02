import React, { useState, useEffect } from 'react';
import { Warehouse, WarehouseLocation } from '../../types';
import { supabase } from '../../services/supabase';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import EditWarehouseForm from './EditWarehouseForm';
import AddWarehouseForm from './AddWarehouseForm';
import EditLocationForm from './EditLocationForm';
import AddLocationForm from './AddLocationForm';
import UploadDataForm from './UploadDataForm';
import { downloadAsXLSX, isWarehouseArray, isWarehouseLocationArray } from '../../utils/fileHelpers';
import { CloudArrowDownIcon } from '../../components/icons/Icons';

const ManageWarehouses: React.FC = () => {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [locations, setLocations] = useState<WarehouseLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [version, setVersion] = useState(0);

    const [isWarehouseModalOpen, setWarehouseModalOpen] = useState(false);
    const [isLocationModalOpen, setLocationModalOpen] = useState(false);
    const [isWarehouseUploadModalOpen, setWarehouseUploadModalOpen] = useState(false);
    const [isLocationUploadModalOpen, setLocationUploadModalOpen] = useState(false);

    const [isAdding, setIsAdding] = useState(true);
    
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<WarehouseLocation | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const whPromise = supabase.from('bodegas').select();
            const locPromise = supabase.from('mapping_bodega').select();
            const [whRes, locRes] = await Promise.all([whPromise, locPromise]);
            
            if (whRes.error) console.error("Error fetching warehouses", whRes.error);
            else setWarehouses(whRes.data || []);
            
            if (locRes.error) console.error("Error fetching locations", locRes.error);
            else setLocations(locRes.data || []);

            setLoading(false);
        };
        fetchData();
    }, [version]);
    
    // Warehouse handlers
    const handleAddWarehouse = () => { setIsAdding(true); setSelectedWarehouse(null); setWarehouseModalOpen(true); };
    const handleEditWarehouse = (wh: Warehouse) => { setIsAdding(false); setSelectedWarehouse(wh); setWarehouseModalOpen(true); };
    const submitWarehouseForm = async (data: Warehouse | Omit<Warehouse, 'id'>) => {
        const promise = 'id' in data 
            ? supabase.from('bodegas').update({ nombre: data.nombre, direccion: data.direccion }).eq('id', data.id)
            : supabase.from('bodegas').insert([data]);
        const { error } = await promise;
        if (error) alert(`Error: ${error.message}`);
        else { setWarehouseModalOpen(false); setVersion(v => v + 1); }
    };
    
    // Location handlers
    const handleAddLocation = () => { setIsAdding(true); setSelectedLocation(null); setLocationModalOpen(true); };
    const handleEditLocation = (loc: WarehouseLocation) => { setIsAdding(false); setSelectedLocation(loc); setLocationModalOpen(true); };
    const submitLocationForm = async (data: WarehouseLocation | Omit<WarehouseLocation, 'id'>) => {
        const promise = 'id' in data
            ? supabase.from('mapping_bodega').update({ idUbicacion: data.idUbicacion, numeroOrden: data.numeroOrden, estado: data.estado }).eq('id', data.id)
            : supabase.from('mapping_bodega').insert([data]);
        const { error } = await promise;
        if (error) alert(`Error: ${error.message}`);
        else { setLocationModalOpen(false); setVersion(v => v + 1); }
    };

    const handleUploadWarehouses = async (data: Partial<Warehouse>[]) => {
        const itemsToInsert = data.map(i => ({...i} as Omit<Warehouse, 'id'>));
        const { error } = await supabase.from('bodegas').insert(itemsToInsert);
        if (error) {
             alert(`Error al cargar bodegas: ${error.message}`);
        } else {
            alert('Bodegas cargadas exitosamente.');
            setWarehouseUploadModalOpen(false);
            setVersion(v => v + 1);
        }
    };

    const handleUploadLocations = async (data: Partial<WarehouseLocation>[]) => {
        const itemsToInsert = data.map(i => ({...i, estado: i.estado ?? true} as Omit<WarehouseLocation, 'id'>));
        const { error } = await supabase.from('mapping_bodega').insert(itemsToInsert);
        if (error) {
             alert(`Error al cargar ubicaciones: ${error.message}`);
        } else {
            alert('Ubicaciones cargadas exitosamente.');
            setLocationUploadModalOpen(false);
            setVersion(v => v + 1);
        }
    };

    const warehouseColumns = [
        { key: 'id', header: 'ID' },
        { key: 'nombre', header: 'Nombre' },
        { key: 'direccion', header: 'Dirección' },
    ] as { key: keyof Warehouse; header: string }[];
    
     const locationColumns = [
        { key: 'idUbicacion', header: 'ID Ubicación' },
        { key: 'numeroOrden', header: 'Orden Picking' },
        { key: 'estado', header: 'Estado' },
    ] as { key: keyof WarehouseLocation; header: string }[];

    if (loading) return <div>Cargando datos de bodegas...</div>;

    return (
        <div className="space-y-8">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Bodegas</h2>
                     <div className="flex items-center space-x-2">
                        <button onClick={() => downloadAsXLSX(warehouses, 'bodegas')} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center">
                            <CloudArrowDownIcon className="w-5 h-5 mr-2" />
                            Descargar Datos
                        </button>
                        <button onClick={() => setWarehouseUploadModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Carga Masiva</button>
                        <button onClick={handleAddWarehouse} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary">Añadir Bodega</button>
                    </div>
                </div>
                <Table columns={warehouseColumns} data={warehouses} onEdit={handleEditWarehouse} />
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Ubicaciones (Layout)</h2>
                     <div className="flex items-center space-x-2">
                        <button onClick={() => downloadAsXLSX(locations, 'ubicaciones')} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center">
                            <CloudArrowDownIcon className="w-5 h-5 mr-2" />
                            Descargar Datos
                        </button>
                        <button onClick={() => setLocationUploadModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Carga Masiva</button>
                        <button onClick={handleAddLocation} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary">Añadir Ubicación</button>
                    </div>
                </div>
                <Table columns={locationColumns} data={locations} onEdit={handleEditLocation} />
            </div>

            <Modal isOpen={isWarehouseModalOpen} onClose={() => setWarehouseModalOpen(false)} title={isAdding ? "Añadir Bodega" : "Editar Bodega"}>
                {isAdding ? (
                    <AddWarehouseForm onSubmit={submitWarehouseForm} onCancel={() => setWarehouseModalOpen(false)} />
                ) : (
                    selectedWarehouse && <EditWarehouseForm warehouse={selectedWarehouse} onSubmit={submitWarehouseForm} onCancel={() => setWarehouseModalOpen(false)} />
                )}
            </Modal>
            
            <Modal isOpen={isLocationModalOpen} onClose={() => setLocationModalOpen(false)} title={isAdding ? "Añadir Ubicación" : "Editar Ubicación"}>
                 {isAdding ? (
                    <AddLocationForm onSubmit={submitLocationForm} onCancel={() => setLocationModalOpen(false)} />
                ) : (
                    selectedLocation && <EditLocationForm location={selectedLocation} onSubmit={submitLocationForm} onCancel={() => setLocationModalOpen(false)} />
                )}
            </Modal>

            <Modal isOpen={isWarehouseUploadModalOpen} onClose={() => setWarehouseUploadModalOpen(false)} title="Carga Masiva de Bodegas">
                <UploadDataForm
                    onUpload={handleUploadWarehouses}
                    onCancel={() => setWarehouseUploadModalOpen(false)}
                    dataValidator={isWarehouseArray}
                    templateColumns={['nombre', 'direccion']}
                    title="Cargar Bodegas desde Excel"
                />
            </Modal>

            <Modal isOpen={isLocationUploadModalOpen} onClose={() => setLocationUploadModalOpen(false)} title="Carga Masiva de Ubicaciones">
                <UploadDataForm
                    onUpload={handleUploadLocations}
                    onCancel={() => setLocationUploadModalOpen(false)}
                    dataValidator={isWarehouseLocationArray}
                    templateColumns={['idUbicacion', 'numeroOrden', 'estado']}
                    title="Cargar Ubicaciones desde Excel"
                />
            </Modal>
        </div>
    );
};

export default ManageWarehouses;