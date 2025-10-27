
import React, { useState, useMemo } from 'react';
import AdminView from './views/admin/AdminView';
import TechnicianView from './views/technician/TechnicianView';
import WarehouseView from './views/warehouse/WarehouseView';
import Login from './views/Login';
import { User, UserRole } from './types';
import { supabase } from './services/supabase';

export const UserContext = React.createContext<{ user: User | null; setUser: React.Dispatch<React.SetStateAction<User | null>> }>({ user: null, setUser: () => {} });

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const handleLogin = async (credentials: { rut: string, password: string }) => {
        const { data, error } = await supabase.auth.signInWithPassword(credentials);

        if (data.user) {
            setUser(data.user);
        } else if (error) {
            throw new Error(error.message);
        } else {
            throw new Error("Un error inesperado ocurrió durante el inicio de sesión.");
        }
    };

    const handleLogout = () => {
        setUser(null);
    };

    const userContextValue = useMemo(() => ({ user, setUser }), [user]);

    const renderView = () => {
        if (!user) {
            return <Login onLogin={handleLogin} />;
        }

        switch (user.tipo) {
            case UserRole.Admin:
                return <AdminView onLogout={handleLogout} />;
            case UserRole.Technician:
                return <TechnicianView onLogout={handleLogout} />;
            case UserRole.Warehouse:
                return <WarehouseView onLogout={handleLogout} />;
            default:
                // This case should ideally not be reached if login is successful
                return <Login onLogin={handleLogin} />;
        }
    };

    return (
      <UserContext.Provider value={userContextValue}>
        <div className="min-h-screen bg-gray-100">
          {renderView()}
        </div>
      </UserContext.Provider>
    );
};

export default App;
