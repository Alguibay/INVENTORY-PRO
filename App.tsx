import React, { useState, useEffect, createContext } from 'react';
import { supabase } from './services/supabase';
import { User, UserRole } from './types';
import Login from './views/Login';
import AdminView from './views/admin/AdminView';
import TechnicianView from './views/technician/TechnicianView';
import WarehouseView from './views/warehouse/WarehouseView';

interface AppContextType {
    user: User | null;
}

export const UserContext = createContext<AppContextType>({ user: null });

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                console.error("Error getting session:", sessionError);
                setLoading(false);
                return;
            }

            if (session?.user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                
                if (error) {
                    console.error("Error fetching user profile:", error);
                    // This could happen if an auth user exists but their profile was deleted.
                    // Log them out to prevent a broken state.
                    await supabase.auth.signOut();
                    setUser(null);
                } else if (profile) {
                    setUser(profile);
                } else {
                    // This case is important: user is authenticated but has no profile.
                    // This can lead to a login loop if not handled.
                    alert('Su perfil no se encontró. Por favor, contacte a un administrador.');
                    await supabase.auth.signOut();
                    setUser(null);
                }
            }
            setLoading(false);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    setUser(profile);
                } else {
                    setUser(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (credentials: { email: string; password: string }) => {
        const { data, error } = await supabase.auth.signInWithPassword(credentials);

        if (error) {
             if (error.message.includes("Email not confirmed")) {
                 throw new Error("Aún no ha confirmado su correo electrónico. Por favor, revise su bandeja de entrada.");
            }
            throw error;
        }

        if (data.user) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileError || !profile) {
                 await supabase.auth.signOut();
                 throw new Error("No se pudo encontrar el perfil del usuario. Contacte al administrador.");
            }
            
            if (!profile.tipo) {
                await supabase.auth.signOut();
                throw new Error("Su perfil está incompleto, no tiene un rol asignado. Contacte al administrador.");
            }

            setUser(profile);
        }
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error logging out:', error);
        setUser(null);
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
    }

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
                return (
                    <div className="p-4 text-center">
                        <p className="text-red-600">Rol no reconocido o perfil incompleto.</p>
                        <p className="text-gray-600 mt-2">Por favor, contacte a un administrador para que le asigne un rol válido.</p>
                        <button onClick={handleLogout} className="mt-4 w-full max-w-xs mx-auto bg-error text-white font-bold py-2 px-4 rounded-lg">Cerrar Sesión</button>
                    </div>
                );
        }
    };
    
    return (
        <UserContext.Provider value={{ user }}>
            {renderView()}
        </UserContext.Provider>
    );
};

export default App;
