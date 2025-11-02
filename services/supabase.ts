import { createClient } from '@supabase/supabase-js';
// Los tipos se importarán ahora desde los componentes que los necesiten
// o se definirán en un archivo de tipos centralizado (ej: '../types')
// Esta línea es del código de ejemplo, asegúrate de que la ruta a 'types' sea correcta.
import { UserRole, Order, OrderItem, Product, Warehouse, WarehouseLocation, User, Inventory } from '../types';

// Pega aquí las credenciales que copiaste en el Paso 3
const supabaseUrl = 'https://mutkokfjlkbnupgmjslu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11dGtva2ZqbGtibnVwZ21qc2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzgxNDUsImV4cCI6MjA3NzYxNDE0NX0.F7-L2_iaUZqS1Qs_2i4JdBVsd2sAsiVK43UczVrSWP8';

// ¡Asegúrate de reemplazar los valores de arriba con los de tu proyecto!
// FIX: This check causes a TypeScript error because the variables are constants
// and will never equal the placeholder strings. Since the credentials appear to be
// set, this developer check is no longer necessary.
/* if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.error("Error: Debes configurar tus credenciales de Supabase en services/supabase.ts");
} */

// Exporta el cliente de Supabase para usarlo en toda la aplicación
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// NOTA: Hemos eliminado todos los mock data y el cliente mock.
// La aplicación ahora dependerá de la base de datos real.