
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
    id: number;
    idBodega: number;
    nombre: string;
    apellido: string;
    tipo: UserRole;
    bodegaAsignada: string;
    direccionEnvio: string;
    comuna: string;
    region: string;
    pais: string;
    rut: string;
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
    sku: string;
    cantidad: number;
    comentario: string;
    productDetails?: Product;
}

export interface Order {
    id: number;
    idUsuarioSolicitante: number;
    nombreUsuarioSolicitante: string;
    idBodega: number;
    items: OrderItem[];
    fecha: string;
    estado: OrderStatus;
    numeroGuia?: string;
    odt?: string;
    fechaRetiro?: string;
    rejectionReason?: string;
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
