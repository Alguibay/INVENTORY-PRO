import React, { useState, useEffect, useContext } from 'react';
import { Product, OrderItem, OrderStatus } from '../../types';
import { supabase } from '../../services/supabase';
import { UserContext } from '../../App';
import { TrashIcon } from '../../components/icons/Icons';

interface NewRequestFormProps {
    onOrderPlaced: () => void;
}

const NewRequestForm: React.FC<NewRequestFormProps> = ({ onOrderPlaced }) => {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase.from('productos').select(p => p.estado === true);
            setProducts(data || []);
        };
        fetchProducts();
    }, []);

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.sku === product.sku);
        if (existingItem) {
            setCart(cart.map(item => item.sku === product.sku ? { ...item, cantidad: item.cantidad + 1 } : item));
        } else {
            setCart([...cart, { id: Date.now(), sku: product.sku, cantidad: 1, comentario: '', productDetails: product }]);
        }
    };

    const updateQuantity = (sku: string, quantity: number) => {
        if (quantity <= 0) {
            setCart(cart.filter(item => item.sku !== sku));
        } else {
            setCart(cart.map(item => item.sku === sku ? { ...item, cantidad: quantity } : item));
        }
    };
    
    const handleSubmit = async () => {
        if (!user || cart.length === 0) return;
        setSubmitting(true);
        const newOrder = {
            idUsuarioSolicitante: user.id,
            nombreUsuarioSolicitante: `${user.nombre} ${user.apellido}`,
            idBodega: user.idBodega,
            items: cart.map(({productDetails, ...item}) => item), // Remove productDetails before insertion
            fecha: new Date().toISOString().split('T')[0],
            estado: OrderStatus.Requested
        };

        const { error } = await supabase.from('pedidos').insert(newOrder);
        if (error) {
            alert('Error al crear el pedido.');
            console.error(error);
        } else {
            alert('Pedido enviado con éxito!');
            setCart([]);
            onOrderPlaced();
        }
        setSubmitting(false);
    }

    const filteredProducts = products.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Nueva Solicitud de Materiales</h2>
            
            {/* Shopping Cart */}
            {cart.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-bold mb-2">Mi Pedido ({totalItems} items)</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {cart.map(item => (
                            <div key={item.sku} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-sm">{item.productDetails?.nombre}</p>
                                    <p className="text-xs text-gray-500">{item.sku}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input 
                                        type="number" 
                                        value={item.cantidad} 
                                        onChange={(e) => updateQuantity(item.sku, parseInt(e.target.value))}
                                        className="w-16 p-1 text-center border rounded-md"
                                    />
                                    <button onClick={() => updateQuantity(item.sku, 0)} className="text-red-500 hover:text-red-700">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSubmit} disabled={submitting} className="w-full mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary disabled:bg-gray-400">
                        {submitting ? 'Enviando...' : 'Confirmar y Enviar Pedido'}
                    </button>
                </div>
            )}

            {/* Product List */}
            <div className="bg-white p-4 rounded-lg shadow">
                <input 
                    type="text"
                    placeholder="Buscar producto por nombre o SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                />
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                            <div>
                                <p className="font-semibold text-sm">{product.nombre}</p>
                                <p className="text-xs text-gray-500">{product.sku}</p>
                            </div>
                            <button onClick={() => addToCart(product)} className="bg-accent text-white text-xs font-bold py-1 px-3 rounded-full hover:bg-secondary">
                                Añadir
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewRequestForm;