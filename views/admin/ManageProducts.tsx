
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { supabase } from '../../services/supabase';
import Table from '../../components/Table';

const ManageProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('productos').select();
            if (error) {
                console.error('Error fetching products:', error);
            } else {
                setProducts(data || []);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    const columns = [
        { key: 'sku' as keyof Product, header: 'SKU' },
        { key: 'nombre' as keyof Product, header: 'Nombre' },
        { key: 'descripcion' as keyof Product, header: 'Descripción' },
        { key: 'tipo' as keyof Product, header: 'Tipo' },
        { key: 'ubicacionBodega' as keyof Product, header: 'Ubicación' },
        { key: 'estado' as keyof Product, header: 'Estado' },
    ];
    
    if (loading) return <div className="text-center p-4">Cargando productos...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Productos</h2>
            <Table<Product>
                columns={columns}
                data={products}
                onEdit={(product) => alert(`Editando producto: ${product.nombre}`)}
                onDelete={(product) => alert(`Eliminando producto: ${product.nombre}`)}
            />
        </div>
    );
};

export default ManageProducts;
