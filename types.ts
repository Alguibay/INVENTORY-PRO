// Declaración global para la librería XLSX cargada desde el CDN
// Fix: Correctly declare XLSX as a global type. Since this file is a module (due to exports),
// `declare var` is locally scoped. `declare global` makes it available project-wide.
declare global {
    var XLSX: any;
}

export enum UserRole {
    Technician = 'Técnico',
    Warehouse = 'Bodeguero',
    Admin = 'Admin',
    CI = 'CI'
}

export enum OrderStatus {
    Draft = 'Borrador',
    Requested = 'Solicitado',
    Preparing = 'En Preparación',
    ReadyForPickup = 'Listo para retiro',
    InTransit = 'En Tránsito',
    AtDestination = 'En Destino',
    Received = 'Recepcionado',
    Rejected = 'Rechazado'
}

export enum ProductType {
    Product = 'Producto',
    Material = 'Materiales'
}

export interface User {
    id: string; // Changed from number to handle Supabase UUIDs
    id_bodega: number;
    nombre: string;
    apellido: string;
    tipo: UserRole;
    bodega_asignada: string;
    direccion_envio: string;
    comuna: string;
    region: string;
    pais: string;
    rut: string;
    email: string; // Added email field
    password?: string;
}

export interface Product {
    id: number;
    sku: string;
    nombre: string;
    nombreLargo: string;
    descripcion: string;
    tipo: ProductType;
    ubicacionBodega: string;
    estado: boolean; // ON/OFF
}

export interface Inventory {
    id: number;
    sku: string;
    cantidad: number;
    idBodega: number;
    fecha: string;
    estado: boolean; // ON/OFF
}

export interface OrderItem {
    id: number;
    idPedido?: number;
    sku: string;
    cantidad: number;
    comentario: string;
    productDetails?: Product;
}

export interface Order {
    id: number;
    idUsuarioSolicitante: string; // Changed from number to handle Supabase UUIDs
    nombreUsuarioSolicitante: string;
    idBodega: number;
    fecha: string;
    estado: OrderStatus;
    numeroGuia?: string;
    odt?: string;
    fechaRetiro?: string;
    rejectionReason?: string;
}

export interface OrderWithItems extends Order {
    items: OrderItem[];
}


export interface WarehouseLocation {
    id: number;
    idUbicacion: string;
    numeroOrden: number;
    estado: boolean; // ON/OFF
}

export interface Warehouse {
    id: number;
    nombre: string;
    direccion: string;
}

export interface ChatMessage {
    id: number;
    senderId: number;
    receiverId: number;
    senderName: string;
    message: string;
    timestamp: string;
}
