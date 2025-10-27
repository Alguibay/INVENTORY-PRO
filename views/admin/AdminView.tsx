import React, { useState, useContext } from 'react';
import { UserContext } from '../../App';
import ManageUsers from './ManageUsers';
import ManageProducts from './ManageProducts';
import ManageInventory from './ManageInventory';
import ManageWarehouses from './ManageWarehouses';
import AppSettings from './AppSettings';
import UtilitiesView from './UtilitiesView';
import { UserIcon, BoxIcon, ClipboardDocumentListIcon, WarehouseIcon, Cog6ToothIcon, WrenchScrewdriverIcon, ArrowLeftOnRectangleIcon } from '../../components/icons/Icons';

interface AdminViewProps {
    onLogout: () => void;
}

type AdminViewType = 'users' | 'products' | 'inventory' | 'warehouses' | 'settings' | 'utilities';

const AdminView: React.FC<AdminViewProps> = ({ onLogout }) => {
    const { user } = useContext(UserContext);
    const [activeView, setActiveView] = useState<AdminViewType>('users');

    const renderContent = () => {
        switch (activeView) {
            case 'users': return <ManageUsers />;
            case 'products': return <ManageProducts />;
            case 'inventory': return <ManageInventory />;
            case 'warehouses': return <ManageWarehouses />;
            case 'settings': return <AppSettings />;
            case 'utilities': return <UtilitiesView />;
            default: return <ManageUsers />;
        }
    };

    // Fix: Changed icon prop type to React.ReactElement to provide a more specific type for React.cloneElement.
    const NavItem: React.FC<{ view: AdminViewType; label: string; icon: React.ReactElement }> = ({ view, label, icon }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
                activeView === view ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
            {React.cloneElement(icon, { className: 'w-6 h-6 mr-3' })}
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 border-b">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                    <p className="text-sm text-gray-500">{user?.nombre} {user?.apellido}</p>
                </div>
                <nav className="flex-grow p-4 space-y-2">
                    <NavItem view="users" label="Usuarios" icon={<UserIcon />} />
                    <NavItem view="products" label="Productos" icon={<BoxIcon />} />
                    <NavItem view="inventory" label="Inventario" icon={<ClipboardDocumentListIcon />} />
                    <NavItem view="warehouses" label="Bodegas" icon={<WarehouseIcon />} />
                    <hr className="my-2"/>
                    <NavItem view="utilities" label="Utilidades" icon={<WrenchScrewdriverIcon />} />
                    <NavItem view="settings" label="Configuración" icon={<Cog6ToothIcon />} />
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-100 rounded-lg"
                    >
                        <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminView;