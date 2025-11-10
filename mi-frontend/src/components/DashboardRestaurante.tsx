// En: src/components/DashboardRestaurante.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns'; // Asegúrate de haber hecho: npm install date-fns

// --- 1. URLs ACTUALIZADAS ---
// Apuntamos al nuevo endpoint del backend
const API_RESERVAS_POR_FECHA = 'http://localhost:3000/reservas/por-fecha';
const API_MESAS = 'http://localhost:3000/mesas';
const API_RESERVAS = 'http://localhost:3000/reservas'; // Para el botón Cancelar

// --- 2. Interfaces (sin cambios) ---
interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  ubicacion: string;
}
interface Cliente {
  id: number;
  nombre: string;
  email: string;
}
interface Reserva {
  id: number;
  fecha_hora: string;
  numero_personas: number;
  estado: string;
  cliente: Cliente; // Anidado
  mesa: Mesa; // Anidado
}

export function DashboardRestaurante() {
  // --- 3. ESTADO MODIFICADO ---
  const [reservasMostradas, setReservasMostradas] = useState<Reserva[]>([]);
  const [todasLasMesas, setTodasLasMesas] = useState<Mesa[]>([]);
  const [error, setError] = useState('');
  
  // ¡NUEVO! Estado para la fecha (inicia en 'hoy' con formato YYYY-MM-DD)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(format(new Date(), 'yyyy-MM-dd'));

  // --- 4. FUNCIÓN fetchData MODIFICADA ---
  // Ahora acepta una fecha y llama al nuevo API
  const fetchData = (fecha: string) => {
    Promise.all([
      axios.get(API_RESERVAS_POR_FECHA, { params: { fecha: fecha } }),
      axios.get(API_MESAS)
    ]).then(([responseReservas, responseMesas]) => {
      // Filtramos las canceladas para no mostrarlas
      setReservasMostradas(responseReservas.data.filter((r: Reserva) => r.estado === 'confirmada'));
      setTodasLasMesas(responseMesas.data);
      setError('');
    }).catch((error: any) => {
      console.error('Error cargando datos del dashboard:', error);
      setError('Error al cargar datos.');
    });
  };

  // --- 5. useEffect MODIFICADO ---
  // Se ejecuta al inicio Y cada vez que 'fechaSeleccionada' cambia
  useEffect(() => {
    fetchData(fechaSeleccionada);
    
    // El intervalo ahora refresca la fecha que esté seleccionada
    const intervalId = setInterval(() => fetchData(fechaSeleccionada), 30000);
    return () => clearInterval(intervalId);
  }, [fechaSeleccionada]); // <-- Dependencia clave

  // --- 6. FUNCIÓN CANCELAR (Con tu mensaje personalizado) ---
  const handleCancelarReserva = async (id: number) => {
    // ¡Tu mensaje personalizado!
    const mensaje = '¿Deseas anular esta reserva? Esta acción marcará la reserva como "cancelada" y liberará la mesa.';
    
    if (window.confirm(mensaje)) {
      try {
        await axios.delete(`${API_RESERVAS}/${id}`);
        // Refresca los datos de la fecha actual
        fetchData(fechaSeleccionada);
      } catch (err: any) {
        console.error('Error al cancelar reserva:', err);
        setError(`Error al cancelar la reserva: ${err.response?.data?.message}`);
      }
    }
  };

  // --- Funciones de formato (sin cambios) ---
  const formatHora = (fechaString: string) => {
    return format(new Date(fechaString), 'HH:mm');
  };

  const mesasOcupadasIds = new Set(reservasMostradas.map(r => r.mesa.id));
  const esHoy = format(new Date(), 'yyyy-MM-dd') === fechaSeleccionada;

  return (
    // --- 7. HTML/JSX ACTUALIZADO ---
    <div>
      {/* Selector de Fecha */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="fecha-dashboard" className="font-bold">Seleccionar Fecha:</label>
        <input
          type="date"
          id="fecha-dashboard"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        />
      </div>

      {/* Título dinámico */}
      <h2 className="mt-4">Reservas {esHoy ? 'del Día' : `para el ${fechaSeleccionada}`} (Confirmadas)</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {reservasMostradas.length === 0 ? (
        <p>No hay reservas confirmadas {esHoy ? 'para hoy' : `para el ${fechaSeleccionada}`}.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Mesa #</th>
              <th>Personas</th>
              <th>Acciones</th> {/* <-- Columna de Cancelar */}
            </tr>
          </thead>
          <tbody>
            {reservasMostradas.map((reserva: Reserva) => (
              <tr key={reserva.id}>
                <td>{formatHora(reserva.fecha_hora)}</td>
                <td>{reserva.cliente.nombre}</td>
                <td>{reserva.mesa.numero}</td>
                <td>{reserva.numero_personas}</td>
                <td>
                  {/* Botón de Cancelar */}
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs"
                    onClick={() => handleCancelarReserva(reserva.id)}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Título dinámico */}
      <h3 className="mt-8">Estado de Mesas {esHoy ? '(Hoy)' : `para el ${fechaSeleccionada}`}</h3>
      <table>
        <thead>
          <tr>
            <th>Mesa #</th>
            <th>Capacidad</th>
            <th>Ubicación</th>
            <th>Estado (para esta fecha)</th>
          </tr>
        </thead>
        <tbody>
          {todasLasMesas.map((mesa: Mesa) => (
            <tr key={mesa.id}>
              <td>{mesa.numero}</td>
              <td>{mesa.capacidad}</td>
              <td>{mesa.ubicacion}</td>
              <td style={{ 
                color: mesasOcupadasIds.has(mesa.id) ? '#ff9b9b' : '#a1ffb2' 
              }}>
                {mesasOcupadasIds.has(mesa.id) ? 'Reservada' : 'Libre'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}