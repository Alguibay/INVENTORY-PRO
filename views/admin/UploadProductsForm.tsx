import React from 'react';
import { Product } from '../../types';
import { isProductArray } from '../../utils/fileHelpers';
import UploadDataForm from './UploadDataForm';

interface UploadProductsFormProps {
    onUpload: (data: Partial<Product>[]) => Promise<void>;
    onCancel: () => void;
}

/**
 * @deprecated This component is a wrapper for UploadDataForm and may be removed in the future.
 * Use UploadDataForm directly for more flexibility.
 */
const UploadProductsForm: React.FC<UploadProductsFormProps> = ({ onUpload, onCancel }) => {
    return (
        <UploadDataForm
            onUpload={onUpload}
            onCancel={onCancel}
            dataValidator={isProductArray}
            templateColumns={['sku', 'nombre', 'nombreLargo', 'descripcion', 'tipo', 'ubicacionBodega', 'estado']}
            title="Cargar Productos desde Excel"
        />
    );
};

export default UploadProductsForm;
