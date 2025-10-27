import React, { useState } from 'react';
import { Warehouse } from '../../types';

interface EditWarehouseFormProps {
    warehouse: Warehouse;
    onSubmit: (updatedWarehouse: Warehouse) => void;
    onCancel: () => void;
}

const EditWarehouseForm: React.FC<EditWarehouseFormProps> = ({ warehouse, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Warehouse>(warehouse);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre de Bodega</label>
                <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
                <input type="text" name="direccion" id="direccion" value={formData.direccion} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-success text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Guardar Cambios</button>
            </div>
        </form>
    );
};

export default EditWarehouseForm;
