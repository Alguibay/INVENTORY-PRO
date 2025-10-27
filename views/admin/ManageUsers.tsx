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
    const [version, setVersion] = useState(0); // To trigger re-fetch

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('usuarios').select();
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
        const { error } = await supabase.from('usuarios').update(updatedUser.id, updatedUser);
        if (error) {
            alert('Error al actualizar usuario.');
        } else {
            setEditModalOpen(false);
            setSelectedUser(null);
            setVersion(v => v + 1); // Refresh data
        }
    };

    const handleAddUser = async (newUser: Omit<User, 'id'>) => {
        const { error } = await supabase.from('usuarios').insert(newUser);
        if (error) {
            alert('Error al agregar usuario.');
        } else {
            setAddModalOpen(false);
            setVersion(v => v + 1);
        }
    };
    
    const handleUploadUsers = async (data: Partial<User>[]) => {
        // Here you would typically validate and transform the data
        const usersToInsert = data.map(u => ({...u, password: 'temp-password'} as Omit<User, 'id'>))
        const { error } = await supabase.from('usuarios').insertBulk(usersToInsert);
        if(error) {
            alert(`Error al cargar usuarios: ${error.message}`);
        } else {
            alert('Usuarios cargados exitosamente.');
            setUploadModalOpen(false);
            setVersion(v => v + 1);
        }
    };
    
    const handleDownload = () => {
        const dataToDownload = users.map(({ password, ...user }) => user); // Omit password for security
        downloadAsXLSX(dataToDownload, 'usuarios');
    };

    const columns = [
        { key: 'id', header: 'ID' },
        { key: 'nombre', header: 'Nombre' },
        { key: 'apellido', header: 'Apellido' },
        { key: 'rut', header: 'RUT' },
        { key: 'tipo', header: 'Rol' },
        { key: 'bodegaAsignada', header: 'Bodega' },
    ] as { key: keyof User; header: string }[];

    if (loading) return <div>Cargando usuarios...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={handleDownload} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center">
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
                    templateColumns={['rut', 'nombre', 'apellido', 'tipo', 'idBodega', 'bodegaAsignada', 'direccionEnvio', 'comuna', 'region', 'pais']}
                    title="Cargar Usuarios desde Excel"
                />
            </Modal>
        </div>
    );
};

export default ManageUsers;