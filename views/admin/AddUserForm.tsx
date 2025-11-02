import React, { useState, useEffect } from 'react';
import { User, UserRole, Warehouse } from '../../types';
import { supabase } from '../../services/supabase';

interface AddUserFormProps {
    onSubmit: (newUser: Omit<User, 'id'>) => void;
    onCancel: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, onCancel }) => {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        rut: '',
        tipo: UserRole.Technician,
        id_bodega: 0,
        bodega_asignada: '',
        direccion_envio: '',
        comuna: '',
        region: '',
        pais: 'Chile',
        password: ''
    });

    useEffect(() => {
        const fetchWarehouses = async () => {
            const { data, error } = await supabase.from('bodegas').select('id, nombre');
            if (error) {
                console.error("Error fetching warehouses", error);
            } else if (data && data.length > 0) {
                setWarehouses(data);
                // Set default warehouse in form
                setFormData(prev => ({
                    ...prev,
                    id_bodega: data[0].id,
                    bodega_asignada: data[0].nombre,
                }));
            }
        };
        fetchWarehouses();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value, 10);
        const selectedWarehouse = warehouses.find(w => w.id === selectedId);
        if (selectedWarehouse) {
            setFormData(prev => ({
                ...prev,
                id_bodega: selectedWarehouse.id,
                bodega_asignada: selectedWarehouse.nombre,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
                    <input type="text" name="apellido" id="apellido" value={formData.apellido} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (para login)</label>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                 <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
            </div>
             <div>
                <label htmlFor="rut" className="block text-sm font-medium text-gray-700">RUT</label>
                <input type="text" name="rut" id="rut" value={formData.rut} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Rol</label>
                    <select name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                        {Object.values(UserRole).map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="id_bodega" className="block text-sm font-medium text-gray-700">Bodega Asignada</label>
                    <select name="id_bodega" id="id_bodega" value={formData.id_bodega} onChange={handleWarehouseChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                        {warehouses.length === 0 ? (
                            <option>Cargando bodegas...</option>
                        ) : (
                            warehouses.map(wh => (
                                <option key={wh.id} value={wh.id}>{wh.nombre}</option>
                            ))
                        )}
                    </select>
                </div>
            </div>
            
            <hr/>
            <h4 className="text-md font-medium text-gray-800 pt-2">Información de Envío (Opcional)</h4>
            
            <div>
                <label htmlFor="direccion_envio" className="block text-sm font-medium text-gray-700">Dirección de Envío</label>
                <input type="text" name="direccion_envio" id="direccion_envio" value={formData.direccion_envio} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="comuna" className="block text-sm font-medium text-gray-700">Comuna</label>
                    <input type="text" name="comuna" id="comuna" value={formData.comuna} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">Región</label>
                    <input type="text" name="region" id="region" value={formData.region} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary">Crear Usuario</button>
            </div>
        </form>
    );
};

export default AddUserForm;
