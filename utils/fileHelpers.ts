import { User, Product, Inventory, Warehouse, WarehouseLocation } from '../types';

/**
 * Type guard to check if an array of objects conforms to the User type.
 */
export const isUserArray = (data: any[]): data is Partial<User>[] => {
    if (!Array.isArray(data) || data.length === 0) return true; // Allow empty array
    const first = data[0];
    return typeof first.rut === 'string' && typeof first.nombre === 'string';
};

/**
 * Type guard to check if an array of objects conforms to the Product type.
 */
export const isProductArray = (data: any[]): data is Partial<Product>[] => {
    if (!Array.isArray(data) || data.length === 0) return true;
    const first = data[0];
    return typeof first.sku === 'string' && typeof first.nombre === 'string';
};

/**
 * Type guard to check if an array of objects conforms to the Inventory type.
 */
export const isInventoryArray = (data: any[]): data is Partial<Inventory>[] => {
    if (!Array.isArray(data) || data.length === 0) return true;
    const first = data[0];
    return typeof first.sku === 'string' && typeof first.cantidad === 'number' && typeof first.idBodega === 'number';
};

/**
 * Type guard to check if an array of objects conforms to the Warehouse type.
 */
export const isWarehouseArray = (data: any[]): data is Partial<Warehouse>[] => {
    if (!Array.isArray(data) || data.length === 0) return true;
    const first = data[0];
    return typeof first.nombre === 'string' && typeof first.direccion === 'string';
};

/**
 * Type guard to check if an array of objects conforms to the WarehouseLocation type.
 */
export const isWarehouseLocationArray = (data: any[]): data is Partial<WarehouseLocation>[] => {
    if (!Array.isArray(data) || data.length === 0) return true;
    const first = data[0];
    return typeof first.idUbicacion === 'string' && typeof first.numeroOrden === 'number';
};


/**
 * Parses an Excel file and returns an array of objects.
 */
export const parseExcelFile = <T>(file: File): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        if (!window.XLSX) {
            return reject(new Error('La librería XLSX no está disponible.'));
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = window.XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                // Fix: Cast the result of sheet_to_json instead of passing a generic type argument,
                // as the function is untyped (window.XLSX is 'any').
                const json = window.XLSX.utils.sheet_to_json(worksheet) as T[];
                resolve(json);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsBinaryString(file);
    });
};

/**
 * Downloads data as an XLSX file.
 */
export const downloadAsXLSX = (data: any[], filename: string): void => {
    if (!window.XLSX) {
        alert('La librería XLSX no está disponible.');
        return;
    }
    const worksheet = window.XLSX.utils.json_to_sheet(data);
    const workbook = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    window.XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Downloads multiple data arrays as a single XLSX file with multiple sheets.
 */
export const downloadMultiSheetXLSX = (sheets: { sheetName: string; data: any[] }[], filename: string): void => {
    if (!window.XLSX) {
        alert('La librería XLSX no está disponible.');
        return;
    }
    const workbook = window.XLSX.utils.book_new();
    sheets.forEach(sheet => {
        const worksheet = window.XLSX.utils.json_to_sheet(sheet.data);
        window.XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
    });
    window.XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
};
