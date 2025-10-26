
import React, { useState, useMemo } from 'react';
import AdminView from './views/admin/AdminView';
import TechnicianView from './views/technician/TechnicianView';
import WarehouseView from './views/warehouse/WarehouseView';
import Login from './views/Login';
import { User, UserRole } from './types';
import { mockUsers } from './services/supabase';

export const UserContext = React.createContext<{ user: User | null; setUser: React.Dispatch<React.SetStateAction<User | null>> }>({ user: null, setUser: () => {} });

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const handleLogin = (role: UserRole) => {
        const foundUser = mockUsers.find(u => u.tipo === role);
        setUser(foundUser || null);
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
