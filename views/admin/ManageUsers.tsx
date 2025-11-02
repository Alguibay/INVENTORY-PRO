import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { supabase } from '../../services/supabase';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import EditUserForm from './EditUserForm';
import AddUserForm from './AddUserForm';
import UploadDataForm from './UploadDataForm';
import { isUserArray, downloadAsXLSX } from '../../utils/fileHelpers';
import { CloudArrowDownIcon } from '../../components/icons/Icons';

const ManageUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [version, setVersion] = useState(0); // To trigger re-fetch

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('profiles').select('*');
            if (error) {
                console.error("Error fetching users", error);
                alert('Error al cargar usuarios.');
            } else {
                setUsers(data || []);
            }
            setLoading(false);
        };
        fetchUsers();
    }, [version]);

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    const handleUpdateUser = async (updatedUser: User) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, password, ...userData } = updatedUser;
        const { error } = await supabase.from('profiles').update(userData).eq('id', id);
        if (error) {
            alert(`Error al actualizar usuario: ${error.message}`);
        } else {
            setEditModalOpen(false);
            setSelectedUser(null);
            setVersion(v => v + 1);
        }
    };

    const handleAddUser = async (newUser: Omit<User, 'id'>) => {
        const { email, password, ...profileData } = newUser;

        if (!email || !password) {
            alert('El email y la contraseña son obligatorios.');
            return;
        }

        // 1. Create user in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError || !authData.user) {
            alert(`Error al crear el usuario en el sistema de autenticación: ${authError?.message}`);
            return;
        }

        // 2. Create profile in 'profiles' table
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({ ...profileData, id: authData.user.id, email });

        if (profileError) {
            alert(`Error al crear el perfil de usuario: ${profileError.message}`);
            // TODO: Consider rolling back the auth user creation
        } else {
            alert('Usuario creado exitosamente. Se ha enviado un correo de confirmación.');
            setAddModalOpen(false);
            setVersion(v => v + 1);
        }
    };
    
    const handleUploadUsers = async (data: Partial<User>[]) => {
        let successCount = 0;
        let errorCount = 0;

        for (const user of data) {
            const { email, password, ...profileData } = user;
            if (!email || !password) {
                console.error('Skipping user due to missing email or password:', user);
                errorCount++;
                continue;
            }

            const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

            if (authError || !authData.user) {
                console.error(`Error creating auth user for ${email}:`, authError?.message);
                errorCount++;
                continue;
            }

            const { error: profileError } = await supabase
                .from('profiles')
                .insert({ ...profileData, id: authData.user.id, email });
            
            if (profileError) {
                console.error(`Error creating profile for ${email}:`, profileError.message);
                errorCount++;
            } else {
                successCount++;
            }
        }

        alert(`Carga masiva completada. ${successCount} usuarios creados, ${errorCount} errores.`);
        setUploadModalOpen(false);
        setVersion(v => v + 1);
    };

    const columns = [
        { key: 'nombre', header: 'Nombre' },
        { key: 'apellido', header: 'Apellido' },
        { key: 'email', header: 'Email' },
        { key: 'tipo', header: 'Rol' },
        { key: 'bodega_asignada', header: 'Bodega' },
    ] as { key: keyof User; header: string }[];

    if (loading) return <div>Cargando usuarios...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={() => downloadAsXLSX(users.map(({ password, ...user }) => user), 'usuarios')} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center">
                        <CloudArrowDownIcon className="w-5 h-5 mr-2" />
                        Descargar Datos
                    </button>
                    <button onClick={() => setUploadModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Carga Masiva</button>
                    <button onClick={() => setAddModalOpen(true)} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary">Añadir Usuario</button>
                </div>
            </div>
            <Table columns={columns} data={users} onEdit={handleEdit} />

            <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Usuario">
                {selectedUser && <EditUserForm user={selectedUser} onSubmit={handleUpdateUser} onCancel={() => setEditModalOpen(false)} />}
            </Modal>
            
            <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Añadir Nuevo Usuario">
                <AddUserForm onSubmit={handleAddUser} onCancel={() => setAddModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} title="Carga Masiva de Usuarios">
                <UploadDataForm
                    onUpload={handleUploadUsers}
                    onCancel={() => setUploadModalOpen(false)}
                    dataValidator={isUserArray}
                    templateColumns={['email', 'password', 'nombre', 'apellido', 'rut', 'tipo', 'id_bodega', 'bodega_asignada']}
                    title="Cargar Usuarios desde Excel"
                />
            </Modal>
        </div>
    );
};

export default ManageUsers;
