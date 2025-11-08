// 1. Importamos las herramientas de React Router (¡Ahora con NavLink!)
import { Routes, Route, NavLink } from 'react-router-dom';

// 2. Importamos TODAS tus "pantallas" (con las rutas corregidas)
import { GestionMesas } from './components/GestionMesas';
import { DashboardRestaurante } from './components/DashboardRestaurante';
import { FormularioReserva } from './components/FormularioReserva';
import { HistorialCliente } from './components/HistorialCliente';

// 3. Importamos los estilos
import './App.css';

function App() {
  return (
    // Ahora 'App' es un contenedor flex
    <div className="App-layout">

      {/* --- BARRA LATERAL DE NAVEGACIÓN --- */}
      <nav className="sidebar">
        <h1>Restaurante</h1>
        <ul>
          <li>
            {/* Usamos NavLink en lugar de Link.
              Esto nos permite añadir una clase 'active' dinámicamente
              cuando la ruta coincide.
            */}
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Crear Reserva
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Estado de Mesas (Hoy)
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mesas"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Gestión de Mesas
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/historial"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Historial Clientes
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* --- ÁREA DE CONTENIDO PRINCIPAL --- */}
      <main className="content">
        {/* 'Routes' define dónde cambiará el contenido.
            Coincide con los 'to' de los <NavLink> de arriba.
        */}
        <Routes>
          {/* La ruta "raíz" (/) mostrará el formulario de reserva */}
          <Route path="/" element={<FormularioReserva />} />
          <Route path="/dashboard" element={<DashboardRestaurante />} />
          <Route path="/mesas" element={<GestionMesas />} />
          <Route path="/historial" element={<HistorialCliente />} />
        </Routes>
      </main>

    </div>
  );
}

export default App;