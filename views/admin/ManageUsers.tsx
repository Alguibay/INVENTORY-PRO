import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { supabase } from '../../services/supabase';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import EditUserForm from './EditUserForm';
import AddUserForm from './AddUserForm';
import { isUserArray, downloadAsXLSX } from '../../utils/fileHelpers';
import UploadDataForm from './UploadDataForm';
import { CloudArrowDownIcon } from '../../components/icons/Icons';

const ManageUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('profiles').select();
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
        const { id, password, ...userData } = updatedUser;
        const { error } = await supabase.from('profiles').update(userData).eq('id', id);
        if (error) {
            alert(`Error al actualizar usuario: ${error.message}`);
        } else {
            alert('Usuario actualizado con éxito.');
            setEditModalOpen(false);
            setSelectedUser(null);
            setVersion(v => v + 1);
        }
    };
    
    const handleAddUser = async (newUser: Omit<User, 'id'>) => {
        if (!newUser.password) {
            alert('La contraseña es obligatoria para crear un nuevo usuario.');
            return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: newUser.email,
            password: newUser.password,
        });

        if (authError) {
            alert(`Error al crear la autenticación del usuario: ${authError.message}`);
            return;
        }

        if (authData.user) {
            const { password, ...profileData } = newUser;
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{ ...profileData, id: authData.user.id }]);

            if (profileError) {
                alert(`Error al crear el perfil de usuario: ${profileError.message}`);
                // Consider rolling back user creation
            } else {
                alert('Usuario creado con éxito. Se ha enviado un correo de confirmación.');
                setAddModalOpen(false);
                setVersion(v => v + 1);
            }
        }
    };
    
    const handleUploadUsers = async (data: Partial<User>[]) => {
        alert('La carga masiva de usuarios no está implementada en esta versión por su complejidad. Por favor, agregue los usuarios manualmente.');
        setUploadModalOpen(false);
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
                    <button onClick={() => downloadAsXLSX(users.map(({password, ...u}) => u), 'usuarios')} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center">
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
                    templateColumns={['email', 'password', 'nombre', 'apellido', 'rut', 'tipo', 'id_bodega', 'bodega_asignada', 'direccion_envio', 'comuna', 'region', 'pais']}
                    title="Cargar Usuarios desde Excel"
                />
            </Modal>
        </div>
    );
};

export default ManageUsers;
