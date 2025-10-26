import { User, UserRole, Product, ProductType, Inventory, Order, OrderStatus, Warehouse, WarehouseLocation } from '../types';

// --- MOCK DATA ---

export const mockUsers: User[] = [
    { id: 1, idBodega: 1, nombre: 'Juan', apellido: 'Pérez', tipo: UserRole.Admin, bodegaAsignada: 'Bodega Central', direccionEnvio: 'Av. Siempre Viva 123', comuna: 'Springfield', region: 'Metropolitana', pais: 'Chile', rut: '11.111.111-1' },
    { id: 2, idBodega: 1, nombre: 'Ana', apellido: 'García', tipo: UserRole.Technician, bodegaAsignada: 'Bodega Central', direccionEnvio: 'Calle Falsa 456', comuna: 'Santiago', region: 'Metropolitana', pais: 'Chile', rut: '22.222.222-2' },
    { id: 3, idBodega: 1, nombre: 'Carlos', apellido: 'López', tipo: UserRole.Warehouse, bodegaAsignada: 'Bodega Central', direccionEnvio: 'N/A', comuna: 'Santiago', region: 'Metropolitana', pais: 'Chile', rut: '33.333.333-3' },
    { id: 4, idBodega: 2, nombre: 'Maria', apellido: 'Martinez', tipo: UserRole.Technician, bodegaAsignada: 'Bodega Norte', direccionEnvio: 'El Peral 789', comuna: 'Antofagasta', region: 'Antofagasta', pais: 'Chile', rut: '44.444.444-4' },
];

export const mockProducts: Product[] = [
    { id: 1, sku: 'FIB-001', nombre: 'Fibra Óptica 1m', nombreLargo: 'Cable de Fibra Óptica Monomodo 1 metro', descripcion: 'Cable para conexiones de alta velocidad.', tipo: ProductType.Material, ubicacionBodega: 'A1-01', estado: true },
    { id: 2, sku: 'MOD-002', nombre: 'Modem VDSL', nombreLargo: 'Modem Router VDSL2 para alta velocidad', descripcion: 'Equipo terminal para cliente.', tipo: ProductType.Product, ubicacionBodega: 'B2-05', estado: true },
    { id: 3, sku: 'CON-003', nombre: 'Conector RJ45', nombreLargo: 'Conector de red RJ45 Cat 6', descripcion: 'Paquete de 100 unidades.', tipo: ProductType.Material, ubicacionBodega: 'C1-10', estado: true },
    { id: 4, sku: 'CAB-004', nombre: 'Cable UTP 50m', nombreLargo: 'Rollo de Cable UTP Cat 6 50 metros', descripcion: 'Cable de red para instalaciones.', tipo: ProductType.Material, ubicacionBodega: 'A1-02', estado: false },
];

export const mockInventory: Inventory[] = [
    { id: 1, sku: 'FIB-001', cantidad: 500, idBodega: 1, fecha: '2023-10-27', estado: true },
    { id: 2, sku: 'MOD-002', cantidad: 150, idBodega: 1, fecha: '2023-10-27', estado: true },
    { id: 3, sku: 'CON-003', cantidad: 10000, idBodega: 1, fecha: '2023-10-27', estado: true },
    { id: 4, sku: 'CAB-004', cantidad: 0, idBodega: 1, fecha: '2023-10-26', estado: false },
    { id: 5, sku: 'FIB-001', cantidad: 200, idBodega: 2, fecha: '2023-10-27', estado: true },
];

export const mockOrders: Order[] = [
    { id: 1001, idUsuarioSolicitante: 2, nombreUsuarioSolicitante: 'Ana García', idBodega: 1, items: [{id: 1, sku: 'FIB-001', cantidad: 20, comentario: 'Urgente para instalación'}, {id: 2, sku: 'MOD-002', cantidad: 2, comentario: ''}], fecha: '2023-10-26', estado: OrderStatus.Requested },
    { id: 1002, idUsuarioSolicitante: 2, nombreUsuarioSolicitante: 'Ana García', idBodega: 1, items: [{id: 3, sku: 'CON-003', cantidad: 50, comentario: ''}], fecha: '2023-10-25', estado: OrderStatus.Received },
    { id: 1003, idUsuarioSolicitante: 4, nombreUsuarioSolicitante: 'Maria Martinez', idBodega: 2, items: [{id: 4, sku: 'FIB-001', cantidad: 10, comentario: ''}], fecha: '2023-10-27', estado: OrderStatus.Preparing },
    { id: 1004, idUsuarioSolicitante: 2, nombreUsuarioSolicitante: 'Ana García', idBodega: 1, items: [{id: 5, sku: 'CAB-004', cantidad: 1, comentario: 'No hay stock'}], fecha: '2023-10-24', estado: OrderStatus.Rejected, rejectionReason: 'Producto sin stock.' },
    { id: 1005, idUsuarioSolicitante: 4, nombreUsuarioSolicitante: 'Maria Martinez', idBodega: 2, items: [{id: 6, sku: 'MOD-002', cantidad: 5, comentario: ''}], fecha: '2023-10-28', estado: OrderStatus.ReadyForPickup, numeroGuia: ' Starken 778899', odt: 'OT-5566', fechaRetiro: '2023-10-30' },
];

export const mockWarehouses: Warehouse[] = [
    { id: 1, nombre: 'Bodega Central', direccion: 'Av. Principal 100, Santiago' },
    { id: 2, nombre: 'Bodega Norte', direccion: 'Calle Industrial 200, Antofagasta' }
];

export const mockWarehouseLocations: WarehouseLocation[] = [
    {id: 1, idUbicacion: 'A1-01', numeroOrden: 1, estado: true},
    {id: 2, idUbicacion: 'A1-02', numeroOrden: 2, estado: true},
    {id: 3, idUbicacion: 'B2-05', numeroOrden: 3, estado: true},
]

// --- MOCK API CLIENT ---

// In a real app, these would be your Supabase client and environment variables.
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const createMockDb = <T,>(data: T[]) => ({
    select: async (filter?: (item: T) => boolean): Promise<{ data: T[]; error: any }> => {
        await new Promise(res => setTimeout(res, 300)); // Simulate network latency
        if (filter) {
            return { data: data.filter(filter), error: null };
        }
        return { data, error: null };
    },
    insert: async (item: Omit<T, 'id'>): Promise<{ data: T[]; error: any }> => {
        await new Promise(res => setTimeout(res, 300));
        const newItem = { ...item, id: Math.max(...data.map((d: any) => d.id)) + 1 } as T;
        data.push(newItem);
        return { data: [newItem], error: null };
    },
    update: async (id: number, updates: Partial<T>): Promise<{ data: T[]; error: any }> => {
        await new Promise(res => setTimeout(res, 300));
        const itemIndex = data.findIndex((item: any) => item.id === id);
        if (itemIndex > -1) {
            data[itemIndex] = { ...data[itemIndex], ...updates };
            return { data: [data[itemIndex]], error: null };
        }
        return { data: [], error: { message: 'Item not found' } };
    },
});

// Fix: Add strong typing to the mocked `supabase.from` method to ensure correct type inference.
type MockDbClient<T> = ReturnType<typeof createMockDb<T>>;

interface SupabaseMock {
    from(tableName: 'usuarios'): MockDbClient<User>;
    from(tableName: 'productos'): MockDbClient<Product>;
    from(tableName: 'inventario'): MockDbClient<Inventory>;
    from(tableName: 'pedidos'): MockDbClient<Order>;
    from(tableName: 'bodegas'): MockDbClient<Warehouse>;
    from(tableName: 'mapping_bodega'): MockDbClient<WarehouseLocation>;
    from(tableName: string): any;
}

export const supabase: SupabaseMock = {
    from: (tableName: string) => {
        switch (tableName) {
            case 'usuarios':
                return createMockDb(mockUsers);
            case 'productos':
                return createMockDb(mockProducts);
            case 'inventario':
                return createMockDb(mockInventory);
            case 'pedidos':
                return createMockDb(mockOrders);
            case 'bodegas':
                return createMockDb(mockWarehouses);
            case 'mapping_bodega':
                return createMockDb(mockWarehouseLocations);
            default:
                throw new Error(`Unknown table: ${tableName}`);
        }
    },
};
