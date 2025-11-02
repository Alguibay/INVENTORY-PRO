import React, { useState, useEffect, useContext } from 'react';
import { OrderWithItems, OrderStatus, Product, OrderItem } from '../../types';
import { supabase } from '../../services/supabase';
import { UserContext } from '../../App';
import { UserIcon, ClipboardDocumentListIcon } from '../../components/icons/Icons';
import Modal from '../../components/Modal';

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

const RequestCard: React.FC<{ order: OrderWithItems, onSelect: (order: OrderWithItems) => void }> = ({ order, onSelect }) => {
    const { bg, text, border } = getStatusStyles(order.estado);
    
    return (
        <div className={`bg-white rounded-lg shadow-md mb-4 border-l-4 ${border} cursor-pointer hover:shadow-lg transition-shadow`} onClick={() => onSelect(order)}>
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

const DispatchForm: React.FC<{ onSubmit: (details: {numeroGuia: string, odt: string, fechaRetiro: string}) => void; onCancel: () => void; }> = ({ onSubmit, onCancel }) => {
    const [details, setDetails] = useState({ numeroGuia: '', odt: '', fechaRetiro: new Date().toISOString().split('T')[0] });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(details);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="numeroGuia" className="block text-sm font-medium text-gray-700">Número de Guía</label>
                <input type="text" name="numeroGuia" id="numeroGuia" value={details.numeroGuia} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
                <label htmlFor="odt" className="block text-sm font-medium text-gray-700">ODT (Orden de Trabajo)</label>
                <input type="text" name="odt" id="odt" value={details.odt} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
                <label htmlFor="fechaRetiro" className="block text-sm font-medium text-gray-700">Fecha Disponible para Retiro</label>
                <input type="date" name="fechaRetiro" id="fechaRetiro" value={details.fechaRetiro} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required/>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-success text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Confirmar Despacho</button>
            </div>
        </form>
    )
}

const PackingView: React.FC<{ order: OrderWithItems, onBack: () => void, products: Product[] }> = ({ order, onBack, products }) => {
    const getProductDetails = (sku: string) => products.find(p => p.sku === sku);
    const [isDispatchModalOpen, setDispatchModalOpen] = useState(false);

    const handleDispatch = async (details: {numeroGuia: string, odt: string, fechaRetiro: string}) => {
        const { error } = await supabase.from('pedidos').update({
            ...details,
            estado: OrderStatus.ReadyForPickup,
        }).eq('id', order.id);

        if (error) {
            alert('Error al despachar el pedido.');
            console.error(error.message, error);
        } else {
            alert('Pedido despachado con éxito.');
            setDispatchModalOpen(false);
            onBack(); // Go back to the list to see the update
        }
    };

    return (
        <div className="p-4">
             <button onClick={onBack} className="text-primary font-semibold mb-4">&larr; Volver a la lista</button>
             <h2 className="text-xl font-bold text-gray-800">Preparando Pedido #{order.id}</h2>
             <p className="text-gray-600 mb-4">Para: {order.nombreUsuarioSolicitante}</p>
             
             <div className="bg-white rounded-lg shadow p-4 space-y-4">
                <h3 className="font-semibold">Items a preparar:</h3>
                {order.items.map((item: OrderItem) => {
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
                <button onClick={() => setDispatchModalOpen(true)} className="w-full bg-success text-white font-bold py-3 px-4 rounded-lg">
                    Marcar como Listo y Despachar
                </button>
             </div>
             <Modal isOpen={isDispatchModalOpen} onClose={() => setDispatchModalOpen(false)} title="Información de Despacho">
                <DispatchForm onSubmit={handleDispatch} onCancel={() => setDispatchModalOpen(false)} />
             </Modal>
        </div>
    );
}

const RequestQueue: React.FC = () => {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
    const [version, setVersion] = useState(0); // Used to force re-render

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);

            const { data: ordersData, error: ordersError } = await supabase
                .from('pedidos')
                .select('*')
                .eq('idBodega', user.id_bodega)
                .in('estado', [OrderStatus.Requested, OrderStatus.Preparing]);
            
            const { data: productsData, error: productsError } = await supabase.from('productos').select('*');

            if (ordersError) {
                console.error('Error fetching orders:', ordersError.message, ordersError);
            } else if (ordersData) {
                 const orderIds = ordersData.map(o => o.id);
                 if (orderIds.length > 0) {
                    const { data: itemsData, error: itemsError } = await supabase
                        .from('pedido_items')
                        .select('*')
                        .in('idPedido', orderIds);

                    if (itemsError) {
                        console.error('Error fetching order items:', itemsError.message, itemsError);
                    } else {
                        const ordersWithItems: OrderWithItems[] = ordersData.map(order => ({
                            ...order,
                            items: itemsData?.filter(item => item.idPedido === order.id) || []
                        }));
                        setOrders(ordersWithItems.sort((a,b) => a.id - b.id));
                    }
                 } else {
                     setOrders([]);
                 }
            } else {
                setOrders([]);
            }

            if (productsError) {
                console.error('Error fetching products', productsError.message, productsError);
            } else {
                setProducts(productsData || []);
            }
            
            setLoading(false);
        };

        fetchData();
    }, [user, version]);

    const handleBack = () => {
        setSelectedOrder(null);
        setVersion(v => v + 1); // Increment version to trigger a re-fetch
    }

    if (loading) return <div className="text-center p-4">Cargando pedidos...</div>;
    
    if (selectedOrder) {
        return <PackingView order={selectedOrder} onBack={handleBack} products={products} />;
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
