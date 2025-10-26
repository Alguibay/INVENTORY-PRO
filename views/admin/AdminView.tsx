
import React, { useState, useContext } from 'react';
import { UserContext } from '../../App';
import { HomeIcon, UsersIcon, BoxIcon, WarehouseIcon, CogIcon, LogoutIcon } from '../../components/icons/Icons';
import ManageUsers from './ManageUsers';
import ManageProducts from './ManageProducts';
import ManageWarehouses from './ManageWarehouses';
import AppSettings from './AppSettings';

interface AdminViewProps {
    onLogout: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onLogout }) => {
    const { user } = useContext(UserContext);
    const [activeView, setActiveView] = useState('dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'users':
                return <ManageUsers />;
            case 'products':
                return <ManageProducts />;
            case 'warehouses':
                return <ManageWarehouses />;
            case 'settings':
                return <AppSettings />;
            case 'dashboard':
            default:
                return (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800">Panel de Administración</h2>
                        <p className="mt-2 text-gray-600">Seleccione una opción del menú para comenzar.</p>
                    </div>
                );
        }
    };

    const NavItem: React.FC<{ view: string; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
        <li
            className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
                activeView === view ? 'bg-secondary text-white shadow-md' : 'text-gray-200 hover:bg-accent hover:text-white'
            }`}
            onClick={() => setActiveView(view)}
        >
            {icon}
            <span className="ml-4 font-medium">{label}</span>
        </li>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white flex flex-col p-4">
                <div className="text-2xl font-bold mb-8 border-b border-blue-400 pb-4">Gestor Pro</div>
                <nav className="flex-grow">
                    <ul>
                        <NavItem view="dashboard" label="Dashboard" icon={<HomeIcon />} />
                        <NavItem view="users" label="Gestionar Usuarios" icon={<UsersIcon />} />
                        <NavItem view="products" label="Gestionar Productos" icon={<BoxIcon />} />
                        <NavItem view="warehouses" label="Gestionar Bodegas" icon={<WarehouseIcon />} />
                        <NavItem view="settings" label="Configuración" icon={<CogIcon />} />
                    </ul>
                </nav>
                <div className="mt-auto">
                    <div
                        className="flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors text-gray-200 hover:bg-red-500 hover:text-white"
                        onClick={onLogout}
                    >
                        <LogoutIcon />
                        <span className="ml-4 font-medium">Cerrar Sesión</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <header className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-700">
                        {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                    </h1>
                    {user && <span className="text-gray-600">Bienvenido, {user.nombre} ({user.tipo})</span>}
                </header>
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminView;
