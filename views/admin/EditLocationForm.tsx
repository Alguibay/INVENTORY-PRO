import React, { useState } from 'react';
import { WarehouseLocation } from '../../types';

interface EditLocationFormProps {
    location: WarehouseLocation;
    onSubmit: (updatedLocation: WarehouseLocation) => void;
    onCancel: () => void;
}

const EditLocationForm: React.FC<EditLocationFormProps> = ({ location, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<WarehouseLocation>(location);

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
                <label htmlFor="idUbicacion" className="block text-sm font-medium text-gray-700">ID Ubicación</label>
                <input type="text" name="idUbicacion" id="idUbicacion" value={formData.idUbicacion} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
             <div>
                <label htmlFor="numeroOrden" className="block text-sm font-medium text-gray-700">Número de Orden (Picking)</label>
                <input type="number" name="numeroOrden" id="numeroOrden" value={formData.numeroOrden} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
             <div>
                 <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                <select name="estado" id="estado" value={String(formData.estado)} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option value="true">Activa</option>
                    <option value="false">Inactiva</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-success text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Guardar Cambios</button>
            </div>
        </form>
    );
};

export default EditLocationForm;
