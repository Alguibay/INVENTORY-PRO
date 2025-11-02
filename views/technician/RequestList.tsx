import React, { useState, useEffect, useContext } from 'react';
import { OrderWithItems, OrderStatus, Product, OrderItem } from '../../types';
import { supabase } from '../../services/supabase';
import { UserContext } from '../../App';
import { TruckIcon, CheckCircleIcon, BoxIcon } from '../../components/icons/Icons';

const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.Requested:
            return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' };
        case OrderStatus.Preparing:
            return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' };
        case OrderStatus.ReadyForPickup:
        case OrderStatus.InTransit:
            return { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-500' };
        case OrderStatus.Received:
            return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' };
        case OrderStatus.Rejected:
            return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-500' };
    }
};


const OrderCard: React.FC<{ order: OrderWithItems; products: Product[] }> = ({ order, products }) => {
    const { bg, text, border } = getStatusStyles(order.estado);
    const [expanded, setExpanded] = useState(false);

    // Ahora busca en la lista de productos reales pasada como prop
    const getProductDetails = (sku: string) => products.find(p => p.sku === sku);

    return (
        <div className={`bg-white rounded-lg shadow-md mb-4 border-l-4 ${border}`}>
            <div className="p-4" onClick={() => setExpanded(!expanded)}>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Pedido #{order.id}</span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bg} ${text}`}>
                        {order.estado}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Fecha: {order.fecha}</p>
                 {order.estado === OrderStatus.ReadyForPickup && (
                    <div className="text-sm text-green-600 mt-2 flex items-center">
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        <span>Listo para retiro el {order.fechaRetiro}</span>
                    </div>
                )}
                 {order.estado === OrderStatus.InTransit && (
                    <div className="text-sm text-indigo-600 mt-2 flex items-center">
                        <TruckIcon className="w-4 h-4 mr-1" />
                        <span>En tránsito. Guía: {order.numeroGuia}</span>
                    </div>
                )}
            </div>
            {expanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-700 mb-2">Detalles del Pedido:</h4>
                    <ul className="space-y-2">
                        {order.items.map((item: OrderItem) => {
                             const product = getProductDetails(item.sku);
                             return (
                                <li key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="text-gray-600">
                                        <p>{product?.nombre || item.sku}</p>
                                        {item.comentario && <p className="text-xs text-gray-400 italic">"{item.comentario}"</p>}
                                    </div>
                                    <span className="font-medium text-gray-800">Cant: {item.cantidad}</span>
                                </li>
                            );
                        })}
                    </ul>
                     {order.estado === OrderStatus.Received && (
                        <button className="w-full mt-4 bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-lg cursor-not-allowed">
                            Pedido Recepcionado
                        </button>
                    )}
                     {order.estado === OrderStatus.ReadyForPickup && (
                        <button className="w-full mt-4 bg-success text-white font-bold py-2 px-4 rounded-lg">
                            Confirmar Recepción
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};


const RequestList: React.FC = () => {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [products, setProducts] = useState<Product[]>([]); // Estado para productos
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);

            // 1. Cargar Pedidos del usuario
            const { data: ordersData, error: ordersError } = await supabase
                .from('pedidos')
                .select('*')
                .eq('idUsuarioSolicitante', user.id);

            // 2. Cargar Productos
            const { data: productsData, error: productsError } = await supabase
                .from('productos')
                .select('*');

            // Manejar resultados
            if (ordersError) {
                console.error('Error fetching orders:', ordersError.message, ordersError);
            } else if (ordersData) {
                 // 3. Cargar los items para los pedidos obtenidos
                const orderIds = ordersData.map(o => o.id);
                if (orderIds.length > 0) {
                    const { data: itemsData, error: itemsError } = await supabase
                        .from('pedido_items')
                        .select('*')
                        .in('idPedido', orderIds);

                    if (itemsError) {
                        console.error('Error fetching order items:', itemsError.message, itemsError);
                    } else {
                        // 4. Combinar pedidos con sus items
                        const ordersWithItems: OrderWithItems[] = ordersData.map(order => ({
                            ...order,
                            items: itemsData?.filter(item => item.idPedido === order.id) || []
                        }));
                        setOrders(ordersWithItems.sort((a, b) => b.id - a.id));
                    }
                } else {
                     setOrders([]);
                }
            } else {
                setOrders([]);
            }

            if (productsError) {
                console.error('Error fetching products:', productsError.message, productsError);
            } else {
                setProducts(productsData || []);
            }
            
            setLoading(false);
        };

        fetchData();
    }, [user]);

    if (loading) return <div className="text-center p-4">Cargando pedidos...</div>;
    
    if (orders.length === 0) return (
        <div className="text-center p-10 text-gray-500">
            <BoxIcon className="w-16 h-16 mx-auto text-gray-300" />
            <p className="mt-4">No tienes pedidos registrados.</p>
        </div>
    );

    return (
        <div className="p-4">
            {orders.map(order => (
                // Pasar los productos al componente OrderCard
                <OrderCard key={order.id} order={order} products={products} />
            ))}
        </div>
    );
};

export default RequestList;
