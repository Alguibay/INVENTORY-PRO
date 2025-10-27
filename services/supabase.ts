import { User, UserRole, Product, ProductType, Inventory, Order, OrderStatus, Warehouse, WarehouseLocation } from '../types';

// --- MOCK DATA ---

export const mockUsers: User[] = [
    { id: 1, idBodega: 1, nombre: 'Juan', apellido: 'Pérez', tipo: UserRole.Admin, bodegaAsignada: 'Bodega Central', direccionEnvio: 'Av. Siempre Viva 123', comuna: 'Springfield', region: 'Metropolitana', pais: 'Chile', rut: '1', password: '111' },
    { id: 2, idBodega: 1, nombre: 'Ana', apellido: 'García', tipo: UserRole.Technician, bodegaAsignada: 'Bodega Central', direccionEnvio: 'Calle Falsa 456', comuna: 'Santiago', region: 'Metropolitana', pais: 'Chile', rut: '2', password: '222' },
    { id: 3, idBodega: 1, nombre: 'Carlos', apellido: 'López', tipo: UserRole.Warehouse, bodegaAsignada: 'Bodega Central', direccionEnvio: 'N/A', comuna: 'Santiago', region: 'Metropolitana', pais: 'Chile', rut: '3', password: '333' },
    { id: 4, idBodega: 2, nombre: 'Maria', apellido: 'Martinez', tipo: UserRole.Technician, bodegaAsignada: 'Bodega Norte', direccionEnvio: 'El Peral 789', comuna: 'Antofagasta', region: 'Antofagasta', pais: 'Chile', rut: '4', password: '444' },
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

interface MockDbClient<T extends { id: any }> {
    select(filter?: (item: T) => boolean): Promise<{ data: T[]; error: any }>;
    insert(item: Omit<T, 'id'>): Promise<{ data: T[]; error: any }>;
    insertBulk(items: Omit<T, 'id'>[]): Promise<{ data: T[]; error: any }>;
    update(id: any, updates: Partial<T>): Promise<{ data: T[]; error: any }>;
}

const createMockDb = <T extends { id: any }>(data: T[]): MockDbClient<T> => ({
    select: async (filter?: (item: T) => boolean): Promise<{ data: T[]; error: any }> => {
        await new Promise(res => setTimeout(res, 300)); // Simulate network latency
        if (filter) {
            return { data: data.filter(filter), error: null };
        }
        return { data, error: null };
    },
    insert: async (item: Omit<T, 'id'>): Promise<{ data: T[]; error: any }> => {
        await new Promise(res => setTimeout(res, 300));
        const maxId = Math.max(0, ...data.map(d => d.id));
        const newItem = { ...item, id: maxId + 1 } as T;
        data.push(newItem);
        return { data: [newItem], error: null };
    },
    insertBulk: async (items: Omit<T, 'id'>[]): Promise<{ data: T[]; error: any }> => {
        await new Promise(res => setTimeout(res, 300));
        let maxId = Math.max(0, ...data.map(d => d.id));
        const newItems = items.map((item) => {
            maxId++;
            return { ...item, id: maxId } as T;
        });
        data.push(...newItems);
        return { data: newItems, error: null };
    },
    update: async (id: any, updates: Partial<T>): Promise<{ data: T[]; error: any }> => {
        await new Promise(res => setTimeout(res, 300));
        const itemIndex = data.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            data[itemIndex] = { ...data[itemIndex], ...updates };
            return { data: [data[itemIndex]], error: null };
        }
        return { data: [], error: { message: 'Item not found' } };
    },
});

interface SupabaseMock {
    from(tableName: 'usuarios'): MockDbClient<User>;
    from(tableName: 'productos'): MockDbClient<Product>;
    from(tableName: 'inventario'): MockDbClient<Inventory>;
    from(tableName: 'pedidos'): MockDbClient<Order>;
    from(tableName: 'bodegas'): MockDbClient<Warehouse>;
    from(tableName: 'mapping_bodega'): MockDbClient<WarehouseLocation>;
    from(tableName: string): any;
}

interface SupabaseAuthMock {
    signInWithPassword: (credentials: { rut: string; password: string; }) => Promise<{ data: { user: User | null }; error: { message: string } | null; }>;
}


export const supabase: SupabaseMock & { auth: SupabaseAuthMock } = {
    from: ((tableName: string) => {
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
    }) as any,
    auth: {
        signInWithPassword: async ({ rut, password }: { rut: string, password: string }) => {
            await new Promise(res => setTimeout(res, 300));
            // This is for mock purposes only. Passwords would be hashed in a real app.
            const user = mockUsers.find(u => u.rut === rut && u.password === password);
            if (user) {
                return { data: { user }, error: null };
            }
            return { data: { user: null }, error: { message: 'Usuario o contraseña incorrectos.' } };
        }
    }
};