import React, { useState, useEffect, useContext } from 'react';
import { Order, OrderStatus } from '../../types';
import { supabase, mockProducts } from '../../services/supabase';
import { UserContext } from '../../App';
// Fix: Import missing ClipboardDocumentListIcon component.
import { UserIcon, ClipboardDocumentListIcon } from '../../components/icons/Icons';

const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.Requested:
            return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' };
        case OrderStatus.Preparing:
            return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-500' };
    }
};

const RequestCard: React.FC<{ order: Order, onSelect: (order: Order) => void }> = ({ order, onSelect }) => {
    const { bg, text, border } = getStatusStyles(order.estado);
    
    return (
        <div className={`bg-white rounded-lg shadow-md mb-4 border-l-4 ${border}`} onClick={() => onSelect(order)}>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <span className="font-bold text-gray-800">Pedido #{order.id}</span>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                            <UserIcon className="w-4 h-4 mr-1"/>
                            <span>{order.nombreUsuarioSolicitante}</span>
                        </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${bg} ${text}`}>
                        {order.estado}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Fecha: {order.fecha}</p>
                <p className="text-sm text-gray-600 mt-1">
                    {order.items.length} tipo(s) de producto(s) solicitado(s).
                </p>
            </div>
        </div>
    );
};

const PackingView: React.FC<{ order: Order, onBack: () => void }> = ({ order, onBack }) => {
    const getProductDetails = (sku: string) => mockProducts.find(p => p.sku === sku);

    return (
        <div className="p-4">
             <button onClick={onBack} className="text-primary font-semibold mb-4">&larr; Volver a la lista</button>
             <h2 className="text-xl font-bold text-gray-800">Preparando Pedido #{order.id}</h2>
             <p className="text-gray-600 mb-4">Para: {order.nombreUsuarioSolicitante}</p>
             
             <div className="bg-white rounded-lg shadow p-4 space-y-4">
                <h3 className="font-semibold">Items a preparar:</h3>
                {order.items.map(item => {
                    const product = getProductDetails(item.sku);
                    return (
                        <div key={item.id} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                            <div>
                                <p className="font-medium text-gray-700">{product?.nombre || item.sku}</p>
                                <p className="text-xs text-gray-500">Ubicación: {product?.ubicacionBodega}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-primary">{item.cantidad}</p>
                            </div>
                        </div>
                    );
                })}
             </div>
             <div className="mt-6 space-y-3">
                <button className="w-full bg-error text-white font-bold py-3 px-4 rounded-lg">
                    Rechazar Pedido
                </button>
                <button className="w-full bg-success text-white font-bold py-3 px-4 rounded-lg">
                    Marcar como Listo y Despachar
                </button>
             </div>
        </div>
    );
}

const RequestQueue: React.FC = () => {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase.from('pedidos').select(o => 
                o.idBodega === user.idBodega && (o.estado === OrderStatus.Requested || o.estado === OrderStatus.Preparing)
            );
            if (error) {
                console.error('Error fetching orders:', error);
            } else {
                setOrders(data.sort((a,b) => a.id - b.id) || []);
            }
            setLoading(false);
        };

        fetchOrders();
    }, [user]);

    if (loading) return <div className="text-center p-4">Cargando pedidos...</div>;
    
    if (selectedOrder) {
        return <PackingView order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
    }

    if (orders.length === 0) return (
        <div className="text-center p-10 text-gray-500">
            <ClipboardDocumentListIcon className="w-16 h-16 mx-auto text-gray-300" />
            <p className="mt-4">No hay pedidos pendientes.</p>
        </div>
    );

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Pedidos Pendientes</h2>
            {orders.map(order => (
                <RequestCard key={order.id} order={order} onSelect={setSelectedOrder} />
            ))}
        </div>
    );
};

export default RequestQueue;
