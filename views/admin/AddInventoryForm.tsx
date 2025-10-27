import React, { useState, useEffect } from 'react';
import { Inventory, Product, Warehouse } from '../../types';
import { supabase } from '../../services/supabase';

interface AddInventoryFormProps {
    onSubmit: (newItem: Omit<Inventory, 'id'>) => void;
    onCancel: () => void;
}

const AddInventoryForm: React.FC<AddInventoryFormProps> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Inventory, 'id'>>({
        sku: '',
        cantidad: 0,
        idBodega: 1,
        fecha: new Date().toISOString().split('T')[0],
        estado: true,
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: prodData } = await supabase.from('productos').select();
            setProducts(prodData || []);
            const { data: whData } = await supabase.from('bodegas').select();
            setWarehouses(whData || []);
        };
        fetchData();
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
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">Producto (SKU)</label>
                <select name="sku" id="sku" value={formData.sku} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    <option value="">Seleccione un producto</option>
                    {products.map(p => (
                        <option key={p.id} value={p.sku}>{p.nombre} ({p.sku})</option>
                    ))}
                </select>
            </div>
             <div>
                <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700">Cantidad</label>
                <input type="number" name="cantidad" id="cantidad" value={formData.cantidad} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
             <div>
                <label htmlFor="idBodega" className="block text-sm font-medium text-gray-700">Bodega</label>
                <select name="idBodega" id="idBodega" value={formData.idBodega} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                    {warehouses.map(wh => (
                        <option key={wh.id} value={wh.id}>{wh.nombre}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary">Añadir Stock</button>
            </div>
        </form>
    );
};

export default AddInventoryForm;
