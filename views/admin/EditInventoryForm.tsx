import React, { useState, useEffect } from 'react';
import { Inventory, Warehouse } from '../../types';
import { supabase } from '../../services/supabase';

interface EditInventoryFormProps {
    inventoryItem: Inventory;
    onSubmit: (updatedItem: Inventory) => void;
    onCancel: () => void;
}

const EditInventoryForm: React.FC<EditInventoryFormProps> = ({ inventoryItem, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Inventory>(inventoryItem);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    useEffect(() => {
        const fetchWarehouses = async () => {
            const { data } = await supabase.from('bodegas').select();
            setWarehouses(data || []);
        };
        fetchWarehouses();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        let processedValue: string | number | boolean = value;
        if (type === 'number') {
            processedValue = parseInt(value, 10);
        } else if (name === 'estado') {
            processedValue = value === 'true';
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
                <input type="text" name="sku" id="sku" value={formData.sku} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" />
            </div>
             <div>
                <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">Cantidad</label>
                <input type="number" name="cantidad" id="cantidad" value={formData.cantidad} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
             <div>
                <label htmlFor="idBodega" className="block text-sm font-medium text-gray-700">Bodega</label>
                <select name="idBodega" id="idBodega" value={formData.idBodega} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    {warehouses.map(wh => (
                        <option key={wh.id} value={wh.id}>{wh.nombre}</option>
                    ))}
                </select>
            </div>
            <div>
                 <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                <select name="estado" id="estado" value={String(formData.estado)} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-success text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Guardar Cambios</button>
            </div>
        </form>
    );
};

export default EditInventoryForm;
