import React, { useState } from 'react';
import { Product, ProductType } from '../../types';

interface EditProductFormProps {
    product: Product;
    onSubmit: (updatedProduct: Product) => void;
    onCancel: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Product>(product);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
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
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
                    <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Corto</label>
                    <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
            </div>
            <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="descripcion" id="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">Tipo</label>
                    <select name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                        {Object.values(ProductType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="ubicacionBodega" className="block text-sm font-medium text-gray-700">Ubicación en Bodega</label>
                    <input type="text" name="ubicacionBodega" id="ubicacionBodega" value={formData.ubicacionBodega} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
            </div>
             <div>
                <label className="flex items-center space-x-3">
                    <input type="checkbox" name="estado" checked={formData.estado} onChange={handleChange} className="form-checkbox h-5 w-5 text-primary rounded focus:ring-primary"/>
                    <span className="text-sm font-medium text-gray-700">Producto Activo</span>
                </label>
             </div>
            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-success text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Guardar Cambios</button>
            </div>
        </form>
    );
};

export default EditProductForm;