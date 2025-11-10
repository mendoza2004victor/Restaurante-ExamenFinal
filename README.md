Restaurante - Examen Final

Proyecto full-stack (NestJS + React) para la gestión de reservas de un restaurante. Esta aplicación moderniza el sistema manual de un restaurante, permitiendo la gestión digital de mesas, clientes y reservas en tiempo real.

Características Principales

Backend (NestJS):

API RESTful para la gestión (CRUD) de Mesas, Clientes y Reservas.

Validaciones avanzadas para prevenir doble-reserva, sobrecupo y reservas fuera de horario.

Endpoints especiales para consultas complejas (ej. mesas disponibles, reservas por fecha).

Lógica de "Buscar o Crear" para el registro de clientes.

Frontend (React):

Dashboard con barra lateral de navegación (SPA - Single Page Application).

Formulario de reserva multi-paso.

Dashboard de "Estado de Mesas" con selector de fecha para ver reservas pasadas, presentes y futuras.

Gestión de mesas (Crear, Eliminar) con un desplegable de ubicaciones.

Notificaciones "Toast" (éxito/error) para una mejor experiencia de usuario.

Tecnologías Utilizadas

Backend (mi-backend)

Node.js

NestJS (Framework de TypeScript)

TypeScript

TypeORM (ORM para la base de datos)

PostgreSQL (Base de datos relacional)

class-validator y class-transformer para validaciones de DTOs.

Frontend (mi-frontend)

React.js (con Vite)

TypeScript (con archivos .tsx)

React Router DOM (Para navegación y rutas)

Axios (Para peticiones a la API)

react-toastify (Para notificaciones "Toast")

date-fns (Para formateo de fechas)

CSS Personalizado (con variables CSS para theming)

Guía de Instalación y Ejecución

Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina local.

Pre-requisitos

Node.js (v18 o superior)

Git

PostgreSQL (Tener el servicio corriendo en tu máquina)

1. Clonar el Repositorio

git clone [https://github.com/mendoza2004victor/Restaurante-ExamenFinal.git](https://github.com/mendoza2004victor/Restaurante-ExamenFinal.git)
cd Restaurante-ExamenFinal


2. Configuración de la Base de Datos

Abre tu herramienta de gestión de PostgreSQL (como pgAdmin o DBeaver).

Crea una nueva base de datos. El proyecto está configurado para buscar una base de datos llamada prueba_examen.

CREATE DATABASE prueba_examen;


3. Configurar el Backend

Navega a la carpeta del backend:

cd mi-backend


Instala las dependencias:

npm install


¡IMPORTANTE! Configura tu conexión. Abre el archivo src/app.module.ts.

Modifica la sección TypeOrmModule.forRoot({...}) con tus credenciales de PostgreSQL:

// En: src/app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,

  // CAMBIA ESTAS LÍNEAS 
  username: 'tu_usuario_de_postgres', // Ej: 'postgres'
  password: 'tu_password_de_postgres', // Tu contraseña
  // CAMBIA ESTAS LÍNEAS 

  database: 'prueba_examen',
  entities: [Mesa, Cliente, Reserva],
  synchronize: true,
}),


4. Configurar el Frontend

Regresa a la carpeta raíz: cd ..

Navega a la carpeta del frontend:

cd mi-frontend


Instala las dependencias:

npm install


Cómo Ejecutar la Aplicación

Necesitarás dos terminales abiertas.

Terminal 1: Ejecutar el Backend

(Estando en la carpeta 'mi-backend')
npm run start:dev


El backend estará corriendo en http://localhost:3000

Terminal 2: Ejecutar el Frontend

# (Estando en la carpeta 'mi-frontend')
npm run dev


La aplicación se abrirá automáticamente en tu navegador en http://localhost:5173
