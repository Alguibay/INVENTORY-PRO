import React, { useState } from 'react';
import { parseExcelFile } from '../../utils/fileHelpers';

interface UploadDataFormProps<T> {
    onUpload: (data: T[]) => Promise<void>;
    onCancel: () => void;
    dataValidator: (data: any[]) => data is T[];
    templateColumns: string[];
    title: string;
}

const UploadDataForm = <T extends {}>({
    onUpload,
    onCancel,
    dataValidator,
    templateColumns,
    title
}: UploadDataFormProps<T>) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Por favor, seleccione un archivo.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await parseExcelFile<any>(file);
            if (!dataValidator(data)) {
                throw new Error('El formato del archivo no es correcto. Verifique que las columnas coincidan con la plantilla.');
            }
            await onUpload(data);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al procesar el archivo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-gray-600">
                Seleccione un archivo Excel (.xlsx) para cargar los datos. Asegúrese de que el archivo tenga las siguientes columnas: <br/>
                <code className="text-xs bg-gray-100 p-1 rounded">{templateColumns.join(', ')}</code>
            </p>
            <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Archivo</label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary"
                />
            </div>

            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                    {error}
                </div>
            )}

            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className="bg-success text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                >
                    {loading ? 'Cargando...' : 'Cargar Datos'}
                </button>
            </div>
        </div>
    );
};

export default UploadDataForm;
