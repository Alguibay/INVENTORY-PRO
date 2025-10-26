
import React, { useState, useEffect } from 'react';
import { Warehouse, WarehouseLocation } from '../../types';
import { supabase } from '../../services/supabase';
import Table from '../../components/Table';

const ManageWarehouses: React.FC = () => {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [locations, setLocations] = useState<WarehouseLocation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [whResponse, locResponse] = await Promise.all([
                supabase.from('bodegas').select(),
                supabase.from('mapping_bodega').select(),
            ]);

            if (whResponse.error) console.error('Error fetching warehouses:', whResponse.error);
            else setWarehouses(whResponse.data || []);
            
            if (locResponse.error) console.error('Error fetching locations:', locResponse.error);
            else setLocations(locResponse.data || []);
            
            setLoading(false);
        };
        fetchData();
    }, []);

    const warehouseColumns = [
        { key: 'id' as keyof Warehouse, header: 'ID' },
        { key: 'nombre' as keyof Warehouse, header: 'Nombre Bodega' },
        { key: 'direccion' as keyof Warehouse, header: 'Dirección' },
    ];

    const locationColumns = [
        { key: 'idUbicacion' as keyof WarehouseLocation, header: 'ID Ubicación' },
        { key: 'numeroOrden' as keyof WarehouseLocation, header: 'N° Orden' },
        { key: 'estado' as keyof WarehouseLocation, header: 'Estado' },
    ];

    if (loading) return <div className="text-center p-4">Cargando bodegas...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Bodegas</h2>
                <Table<Warehouse> columns={warehouseColumns} data={warehouses} onEdit={(wh) => alert(`Editando bodega: ${wh.nombre}`)} />
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Layout de Bodega (Mapping)</h2>
                <Table<WarehouseLocation> columns={locationColumns} data={locations} onEdit={(loc) => alert(`Editando ubicación: ${loc.idUbicacion}`)} />
            </div>
        </div>
    );
};

export default ManageWarehouses;
