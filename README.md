# Margarita - E-Commerce MERN Stack con Cierre por WhatsApp 🛍️📲

Margarita es una plataforma de comercio electrónico "Full Stack" desarrollada completamente desde cero utilizando el stack MERN. Este proyecto fue diseñado con un enfoque en la alta conversión y la fricción cero para el usuario, reemplazando las pasarelas de pago tradicionales con un sistema de cierre de ventas automatizado directo a WhatsApp.

## 🚀 Características Principales

- **Carrito Inteligente hacia WhatsApp:** Los usuarios agregan productos a un carrito lateral (Slide-over). Al finalizar, el sistema compila la orden, calcula totales (incluyendo descuentos por ofertas) y genera un mensaje pre-formateado directamente al WhatsApp del administrador.
- **Panel de Administración Integral (CMS):** Rutas protegidas mediante JWT que permiten al administrador gestionar el inventario completo sin tocar una sola línea de código.
- **Gestión de Inventario en Tiempo Real:** \* CRUD completo de Categorías y Productos.
  - Control de Stock y sistema de "Ofertas" destacadas.
  - Integración con Cloudinary para el manejo eficiente de imágenes.
- **Configuración Dinámica de la Tienda:** El frontend reacciona a los cambios en la base de datos para actualizar instantáneamente los Banners, el Slider de Productos Destacados, las Redes Sociales, el Texto de "Sobre Nosotros" y los datos de contacto.
- **Diseño UI/UX Premium:** Interfaz limpia, responsiva y moderna construida con Tailwind CSS, con animaciones fluidas y modales profesionales.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React (Vite), React Router Dom, Tailwind CSS, Redux Toolkit (Autenticación), Context API (Carrito y Configuración Global), React Icons.
- **Backend:** Node.js, Express.js.
- **Base de Datos:** MongoDB (Mongoose).
- **Autenticación y Seguridad:** JSON Web Tokens (JWT) y encriptación de contraseñas con bcrypt.
- **Almacenamiento en la Nube:** Cloudinary (Imágenes).
- **Despliegue:** Vercel (Frontend) y Render (Backend).

## 💡 Motivación y UX

En el mercado latinoamericano, la inmediatez y la atención personalizada superan a las pasarelas de pago automatizadas. Este e-commerce elimina la barrera del registro obligatorio para comprar y el abandono de carritos por fallos en tarjetas, derivando una intención de compra altamente cualificada directamente al canal de comunicación más usado: WhatsApp.
