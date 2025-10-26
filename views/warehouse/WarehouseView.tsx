
import React, { useState, useContext } from 'react';
import { UserContext } from '../../App';
import RequestQueue from './RequestQueue';
import { ClipboardDocumentListIcon, BoxIcon, WarehouseIcon, UserIcon } from '../../components/icons/Icons';

interface WarehouseViewProps {
    onLogout: () => void;
}

const WarehouseView: React.FC<WarehouseViewProps> = ({ onLogout }) => {
    const { user } = useContext(UserContext);
    const [activeView, setActiveView] = useState('queue');

    const renderContent = () => {
        switch (activeView) {
            case 'stock':
                return <div className="p-4"><h2 className="text-xl font-bold">Gestionar Stock</h2><p>Interfaz para ingresar productos...</p></div>;
            case 'layout':
                return <div className="p-4"><h2 className="text-xl font-bold">Gestionar Layout</h2><p>Interfaz para crear/desactivar posiciones...</p></div>;
            case 'profile':
                 return (
                    <div className="p-4 text-center">
                        <h2 className="text-xl font-bold">{user?.nombre} {user?.apellido}</h2>
                        <p className="text-gray-500">{user?.tipo} - {user?.bodegaAsignada}</p>
                        <button onClick={onLogout} className="mt-8 bg-error text-white font-bold py-2 px-4 rounded-lg w-full">
                            Cerrar Sesión
                        </button>
                    </div>
                );
            case 'queue':
            default:
                return <RequestQueue />;
        }
    };

    const NavItem: React.FC<{ view: string; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
                activeView === view ? 'text-primary' : 'text-gray-500 hover:text-primary'
            }`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );

    return (
        <div className="w-full max-w-md mx-auto h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white shadow-md p-4 text-center">
                <h1 className="text-xl font-bold text-gray-800">Portal de Bodega</h1>
            </header>
            
            <main className="flex-grow overflow-y-auto pb-20">
                {renderContent()}
            </main>

            <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white border-t border-gray-200 shadow-t">
                <div className="flex justify-around">
                    <NavItem view="queue" label="Pedidos" icon={<ClipboardDocumentListIcon className="w-7 h-7" />} />
                    <NavItem view="stock" label="Stock" icon={<BoxIcon className="w-7 h-7" />} />
                    <NavItem view="layout" label="Layout" icon={<WarehouseIcon className="w-7 h-7" />} />
                    <NavItem view="profile" label="Perfil" icon={<UserIcon className="w-7 h-7" />} />
                </div>
            </footer>
        </div>
    );
};

export default WarehouseView;
