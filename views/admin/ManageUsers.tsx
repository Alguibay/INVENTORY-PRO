
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { supabase } from '../../services/supabase';
import Table from '../../components/Table';

const ManageUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('usuarios').select();
            if (error) {
                console.error('Error fetching users:', error);
            } else {
                setUsers(data || []);
            }
            setLoading(false);
        };

        fetchUsers();
    }, []);

    const columns = [
        { key: 'id' as keyof User, header: 'ID' },
        { key: 'nombre' as keyof User, header: 'Nombre' },
        { key: 'apellido' as keyof User, header: 'Apellido' },
        { key: 'tipo' as keyof User, header: 'Tipo' },
        { key: 'bodegaAsignada' as keyof User, header: 'Bodega' },
        { key: 'rut' as keyof User, header: 'RUT' },
    ];
    
    if (loading) return <div className="text-center p-4">Cargando usuarios...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Gestión de Usuarios</h2>
            <Table<User> 
                columns={columns} 
                data={users}
                onEdit={(user) => alert(`Editando usuario: ${user.nombre}`)}
                onDelete={(user) => alert(`Eliminando usuario: ${user.nombre}`)}
            />
        </div>
    );
};

export default ManageUsers;
