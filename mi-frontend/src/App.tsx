// 1. Importamos las herramientas de React Router (¡Ahora con NavLink!)
import { Routes, Route, NavLink } from 'react-router-dom';
// Importamos el contenedor de notificaciones
import { ToastContainer } from 'react-toastify'; 

// 2. Importamos TODAS tus "pantallas" (con las rutas corregidas)
// --- 👇 ¡AQUÍ ESTÁ LA MODIFICACIÓN! 👇 ---
// Añadimos la extensión .tsx para ayudar al compilador
import { GestionMesas } from './components/GestionMesas.tsx';
import { DashboardRestaurante } from './components/DashboardRestaurante.tsx';
import { FormularioReserva } from './components/FormularioReserva.tsx';
import { HistorialCliente } from './components/HistorialCliente.tsx';
// --- 👆 HASTA AQUÍ 👆 ---


// 3. Importamos los estilos
import './App.css';

function App() {
  return (
    // Ahora 'App' es un contenedor flex
    <div className="App-layout">

      {/* Este componente es invisible, pero mostrará las
          notificaciones (toasts) cuando las llamemos */}
      <ToastContainer
        position="bottom-left" // Posición (parte izquierda)
        autoClose={4000} // Cierre automático en 4 segundos
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Tema claro (combina con tu CSS)
      />

      {/* --- BARRA LATERAL DE NAVEGACIÓN --- */}
      <nav className="sidebar">
        <h1>Restaurante</h1>
        <ul>
          <li>
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
              Estado de Mesas
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
        <Routes>
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