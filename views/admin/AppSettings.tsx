
import React from 'react';

const AppSettings: React.FC = () => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Configuración de la Aplicación</h2>
            
            <div className="space-y-6">
                <div className="p-6 border border-blue-200 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Credenciales de Supabase</h3>
                    <p className="text-blue-700">
                        Por motivos de seguridad, las credenciales de conexión a la base de datos (Supabase URL y Anon Key) se configuran a través de variables de entorno en el servidor.
                    </p>
                    <p className="mt-2 text-sm text-blue-600">
                        Esto previene la exposición de información sensible en el código del cliente y es una práctica recomendada para la seguridad de la aplicación. No se requiere ninguna acción aquí.
                    </p>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Notificaciones</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Habilitar notificaciones por correo</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Tema de la Aplicación</h3>
                     <div className="flex items-center space-x-4">
                        <button className="px-4 py-2 bg-primary text-white rounded-md">Modo Claro</button>
                        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">Modo Oscuro (Próximamente)</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppSettings;
