import React, { useState } from 'react';
import Modal from '../../components/Modal';
import { supabase } from '../../services/supabase';
import { downloadMultiSheetXLSX } from '../../utils/fileHelpers';

const TABLE_DEFINITIONS = {
    Usuarios: 'profiles',
    Productos: 'productos',
    Inventario: 'inventario',
    Bodegas: 'bodegas',
    Ubicaciones: 'mapping_bodega',
};

type TableKey = keyof typeof TABLE_DEFINITIONS;

const UtilitiesView: React.FC = () => {
    const [isExportModalOpen, setExportModalOpen] = useState(false);
    const [selectedTables, setSelectedTables] = useState<Record<TableKey, boolean>>(
        Object.keys(TABLE_DEFINITIONS).reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<TableKey, boolean>)
    );
    const [exporting, setExporting] = useState(false);

    const handleCheckboxChange = (table: TableKey) => {
        setSelectedTables(prev => ({ ...prev, [table]: !prev[table] }));
    };

    const handleExport = async () => {
        const tablesToExport = Object.entries(selectedTables)
            .filter(([, isSelected]) => isSelected)
            .map(([key]) => key as TableKey);

        if (tablesToExport.length === 0) {
            alert('Por favor, seleccione al menos una tabla para exportar.');
            return;
        }

        setExporting(true);
        try {
            const promises = tablesToExport.map(async (key) => {
                const tableName = TABLE_DEFINITIONS[key];
                const { data, error } = await supabase.from(tableName as any).select();
                if (error) {
                    throw new Error(`Error al cargar datos de ${key}: ${error.message}`);
                }
                // Omit password from users export for security
                if (key === 'Usuarios' && Array.isArray(data)) {
                    return { sheetName: key, data: data.map(({ password, ...user }) => user) };
                }
                return { sheetName: key, data: data || [] };
            });

            const sheets = await Promise.all(promises);
            downloadMultiSheetXLSX(sheets, 'exportacion_masiva');
            
        } catch (error: any) {
            alert(error.message);
        } finally {
            setExporting(false);
            setExportModalOpen(false);
        }
    };

    return (
        <>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Utilidades de la Aplicación</h2>

                <div className="space-y-6">
                    <div className="p-6 border border-green-200 bg-green-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Exportar Datos</h3>
                        <p className="text-green-700">
                            Exporte datos de usuarios, productos, inventario y más en formato Excel.
                        </p>
                        <button
                            onClick={() => setExportModalOpen(true)}
                            className="mt-3 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
                        >
                            Iniciar Exportación
                        </button>
                    </div>

                    <div className="p-6 border border-yellow-200 bg-yellow-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Limpieza de Datos</h3>
                        <p className="text-yellow-700">
                            Ejecute herramientas para verificar la consistencia y eliminar registros duplicados o inactivos.
                        </p>
                        <button className="mt-3 bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600">
                            Ejecutar Limpieza
                        </button>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Logs del Sistema</h3>
                        <p className="text-gray-600">
                            Visualice los logs de actividad y errores de la aplicación para diagnóstico.
                        </p>
                        <button className="mt-3 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700">
                            Ver Logs
                        </button>
                    </div>
                </div>
            </div>

            <Modal isOpen={isExportModalOpen} onClose={() => setExportModalOpen(false)} title="Seleccionar Tablas para Exportar">
                <div className="space-y-3">
                    <p className="text-sm text-gray-600">Marque las tablas que desea incluir en el archivo de Excel. Cada tabla se exportará en una hoja separada.</p>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(TABLE_DEFINITIONS).map((key) => (
                             <label key={key} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedTables[key as TableKey]}
                                    onChange={() => handleCheckboxChange(key as TableKey)}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span>{key}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button onClick={() => setExportModalOpen(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button onClick={handleExport} disabled={exporting} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-secondary disabled:bg-gray-400">
                            {exporting ? 'Exportando...' : 'Exportar'}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default UtilitiesView;