# Documentación del Proyecto: Gestor de Bodega Pro

## 1. Descripción General

**Gestor de Bodega Pro** es una aplicación web diseñada para optimizar el flujo de solicitud y despacho de materiales entre técnicos de campo y bodegas. La aplicación proporciona interfaces especializadas para tres roles de usuario principales:

-   **Técnico:** Puede buscar productos, crear solicitudes de materiales y hacer seguimiento del estado de sus pedidos.
-   **Bodeguero:** Recibe y gestiona las solicitudes de los técnicos, prepara los pedidos y los despacha.
-   **Administrador:** Tiene una vista global para gestionar usuarios, productos, inventario, bodegas y la configuración general de la aplicación.

---

## 2. Guía de Usuario

Esta guía explica cómo utilizar la aplicación según tu rol, el flujo de trabajo principal y las funcionalidades disponibles.

### 2.1. Tipos de Usuario y Funcionalidades

La aplicación cuenta con tres roles, cada uno con una interfaz y permisos específicos:

#### a) Administrador
El administrador tiene control total sobre la configuración y los datos de la aplicación. Su panel está diseñado para escritorio y permite:
-   **Gestión de Usuarios:** Crear, editar y ver todos los usuarios del sistema (técnicos, bodegueros, otros administradores).
-   **Gestión de Productos:** Añadir nuevos productos o materiales, editar sus detalles (SKU, nombre, descripción) y activarlos/desactivarlos.
-   **Gestión de Inventario:** Ajustar las cantidades de stock de cada producto en las diferentes bodegas.
-   **Gestión de Bodegas:** Crear y editar las bodegas existentes y sus ubicaciones internas (layout para picking).
-   **Carga y Descarga Masiva:** Utilizar archivos Excel para añadir o exportar grandes cantidades de datos (usuarios, productos, etc.) de forma eficiente.
-   **Utilidades:** Acceder a herramientas para exportar backups completos o realizar tareas de mantenimiento.

#### b) Técnico de Campo
La interfaz del técnico está optimizada para dispositivos móviles y se centra en la solicitud de materiales:
-   **Ver Mis Pedidos:** Consultar el historial de todas las solicitudes realizadas y ver su estado actual (Solicitado, En Preparación, Listo para retiro, etc.).
-   **Crear Nuevo Pedido:** Navegar por el catálogo de productos, buscarlos por nombre o SKU, añadirlos a un carrito y enviar la solicitud a la bodega asignada.
-   **Seguimiento:** Recibir información de despacho, como el número de guía de transporte, una vez que el pedido está listo.
-   **Chat y Perfil:** Acceder a funciones de comunicación y gestión de su perfil.

#### c) Bodeguero
La interfaz del bodeguero también es de estilo móvil y está diseñada para gestionar eficientemente las solicitudes entrantes:
-   **Cola de Pedidos:** Ver una lista de todos los pedidos pendientes de preparación solicitados por los técnicos.
-   **Preparación de Pedidos (Picking):** Seleccionar un pedido para ver los detalles de los productos solicitados, sus cantidades y su ubicación en la bodega para facilitar la recolección.
-   **Despacho de Pedidos:** Una vez preparado el pedido, puede marcarlo como "Listo para retiro", ingresando información clave como el número de guía o la fecha de retiro.
-   **Gestión de Stock y Layout:** Acceder a herramientas para ajustes rápidos de inventario y consulta de ubicaciones.

### 2.2. Flujo de Trabajo: De la Solicitud a la Entrega

El proceso principal de la aplicación sigue estos pasos:

1.  **Inicio de Sesión:** Cada usuario ingresa con sus credenciales (Email y contraseña) y es dirigido automáticamente a la vista correspondiente a su rol.

2.  **Creación de la Solicitud (Técnico):**
    -   El técnico navega a la sección "Nuevo Pedido".
    -   Busca los materiales que necesita y los añade a su carrito de compras virtual.
    -   Una vez completada la selección, envía el pedido. El estado del pedido se establece como `Solicitado`.

3.  **Gestión en Bodega (Bodeguero):**
    -   El bodeguero ve el nuevo pedido aparecer en su "Cola de Pedidos".
    -   Selecciona el pedido para empezar a prepararlo. En este punto, el estado cambia a `En Preparación`.
    -   El bodeguero utiliza la lista detallada (picking list) para recolectar los artículos.

4.  **Despacho y Notificación (Bodeguero):**
    -   Con todos los artículos listos, el bodeguero selecciona la opción "Marcar como Listo y Despachar".
    -   Completa un formulario con los detalles del envío (ej. número de guía, empresa de transporte, fecha de retiro).
    -   El estado del pedido se actualiza a `Listo para retiro` o `En Tránsito`.

5.  **Seguimiento y Recepción (Técnico):**
    -   El técnico ve en "Mis Pedidos" que el estado de su solicitud ha cambiado.
    -   Puede consultar los detalles del despacho para hacer seguimiento.
    -   Una vez que recibe los materiales, confirma la recepción en la aplicación, cambiando el estado final a `Recepcionado`.

---

## 3. Tecnologías y Arquitectura

### Frontend

-   **React 19:** Biblioteca principal para la construcción de la interfaz de usuario.
-   **TypeScript:** Para un tipado estático que mejora la robustez y mantenibilidad del código.
-   **Tailwind CSS:** Framework de CSS "utility-first" para un diseño rápido y responsivo.
-   **React Context API:** Para la gestión del estado global del usuario autenticado.

### Backend (BaaS - Backend as a Service)

-   **Supabase:** Plataforma open-source que proporciona una base de datos PostgreSQL, autenticación, APIs y almacenamiento.
    -   **Base de Datos:** Se utiliza una base de datos PostgreSQL gestionada por Supabase para la persistencia de todos los datos (usuarios, productos, pedidos, etc.).
    -   **Autenticación:** Se utiliza el servicio de autenticación de Supabase para gestionar los inicios de sesión, la seguridad de las contraseñas y la gestión de usuarios.
    -   **API:** La aplicación interactúa con la base de datos a través de la librería cliente `@supabase/supabase-js`, que proporciona una interfaz fluida para realizar operaciones CRUD.

### Herramientas y Complementos (CDN)

-   **SheetJS (XLSX):** Utilizada para la funcionalidad de importación y exportación masiva de datos desde y hacia archivos Excel. Se carga a través de un CDN.
-   **Tailwind CSS CDN:** Para una configuración rápida sin necesidad de un proceso de build.

---

## 4. Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

-   **/ (raíz):**
    -   `index.html`: Punto de entrada de la aplicación. Carga React, Tailwind CSS y SheetJS.
    -   `index.tsx`: Monta la aplicación React en el DOM.
    -   `App.tsx`: Componente principal que maneja el enrutamiento basado en el rol del usuario y el estado de autenticación.
    -   `types.ts`: Define todas las interfaces y enums de TypeScript utilizados en la aplicación (User, Product, Order, etc.).
    -   `metadata.json`: Metadatos de la aplicación.
-   **/components:**
    -   Contiene componentes reutilizables como `Table.tsx`, `Modal.tsx`, y el set de iconos SVG en `icons/Icons.tsx`.
-   **/services:**
    -   `supabase.ts`: Inicializa y exporta el cliente de Supabase, configurado con las credenciales del proyecto.
-   **/utils:**
    -   `fileHelpers.ts`: Funciones de utilidad para parsear y descargar archivos Excel, así como type guards para validar los datos importados.
-   **/views:**
    -   Contiene los componentes principales que representan las diferentes pantallas o "vistas" de la aplicación. Está sub-dividido por rol:
        -   `Login.tsx`: Pantalla de inicio de sesión.
        -   **/admin:** Vistas del panel de administración (`ManageUsers`, `ManageProducts`, etc.).
        -   **/technician:** Vistas para el rol de técnico (`RequestList`, `NewRequestForm`).
        -   **/warehouse:** Vistas para el rol de bodeguero (`RequestQueue`).

---

## 5. Estilo y Diseño (UI/UX)

-   **Paleta de Colores:** La paleta de colores principal está definida en la configuración de Tailwind dentro de `index.html`.
    -   `primary`: `#1E40AF` (Azul oscuro)
    -   `secondary`: `#1D4ED8`
    -   `accent`: `#3B82F6`
    -   `success`: `#16A34A` (Verde)
    -   `error`: `#DC2626` (Rojo)
-   **Responsividad:**
    -   Las vistas de **Técnico** y **Bodeguero** están diseñadas con un enfoque "mobile-first", simulando una experiencia de aplicación móvil en un contenedor de ancho máximo.
    -   La vista de **Administrador** está diseñada para pantallas de escritorio, con una barra lateral de navegación y un área de contenido principal.
-   **Iconografía:** Se utiliza un conjunto de iconos SVG personalizados (`components/icons/Icons.tsx`) para mejorar la claridad visual y la usabilidad de la interfaz.

---

## 6. Futuras Mejoras Funcionales

-   **Confirmación de Recepción:** Implementar el botón para que el técnico pueda marcar un pedido como `Recepcionado`, cerrando el ciclo del flujo de trabajo.
-   **Chat en Tiempo Real:** Desarrollar la funcionalidad de chat para que un técnico pueda comunicarse directamente con el bodeguero sobre un pedido específico.
-   **Gestión de Devoluciones:** Crear un nuevo flujo que permita a los técnicos solicitar la devolución de materiales sobrantes o incorrectos.
-   **Notificaciones:** Integrar un sistema de notificaciones (push en la app o por email) para alertar a los usuarios sobre cambios importantes, como "Pedido despachado" o "Nuevo pedido recibido".
-   **Dashboard de Administrador:** Añadir una vista principal en el panel de administrador con gráficos y métricas clave (ej. tiempo promedio de despacho, productos más solicitados, etc.).
-   **Escaneo de Códigos de Barras:** Permitir que los bodegueros usen la cámara de su dispositivo para escanear SKUs, agilizando el picking y la gestión de inventario.
