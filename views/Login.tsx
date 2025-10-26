
import React from 'react';
import { UserRole } from '../types';
import { BriefcaseIcon, UserIcon, BuildingStorefrontIcon } from '../components/icons/Icons';

interface LoginProps {
    onLogin: (role: UserRole) => void;
}

const RoleButton: React.FC<{ role: UserRole; label: string; icon: React.ReactNode; onClick: (role: UserRole) => void; }> = ({ role, label, icon, onClick }) => (
    <button
        onClick={() => onClick(role)}
        className="flex flex-col items-center justify-center w-full p-6 space-y-3 bg-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1"
    >
        {icon}
        <span className="text-lg font-semibold text-gray-700">{label}</span>
    </button>
);


const Login: React.FC<LoginProps> = ({ onLogin }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-4xl p-8 mx-4 space-y-8 bg-white rounded-2xl shadow-2xl text-center">
                <h1 className="text-4xl font-bold text-gray-800">Bienvenido a Gestor de Bodega Pro</h1>
                <p className="text-xl text-gray-500">Por favor, seleccione su rol para continuar</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                    <RoleButton role={UserRole.Technician} label="Técnico" icon={<UserIcon className="w-16 h-16 text-primary"/>} onClick={onLogin} />
                    <RoleButton role={UserRole.Warehouse} label="Bodeguero" icon={<BuildingStorefrontIcon className="w-16 h-16 text-primary"/>} onClick={onLogin} />
                    <RoleButton role={UserRole.Admin} label="Administrador" icon={<BriefcaseIcon className="w-16 h-16 text-primary"/>} onClick={onLogin} />
                </div>
            </div>
        </div>
    );
};

export default Login;
