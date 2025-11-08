// En: src/components/DashboardRestaurante.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const API_RESERVAS_HOY = 'http://localhost:3000/reservas/hoy';
const API_MESAS = 'http://localhost:3000/mesas';

// 2. Definir Interfaces
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
  const [reservasHoy, setReservasHoy] = useState<Reserva[]>([]); // <-- 3. Tipo
  const [todasLasMesas, setTodasLasMesas] = useState<Mesa[]>([]); // <-- 3. Tipo
  const [error, setError] = useState('');

  const fetchData = () => {
    Promise.all([
      axios.get(API_RESERVAS_HOY),
      axios.get(API_MESAS)
    ]).then(([responseReservas, responseMesas]) => {
      setReservasHoy(responseReservas.data);
      setTodasLasMesas(responseMesas.data);
      setError('');
    }).catch((error: any) => { // <-- 4. Tipo
      console.error('Error cargando datos del dashboard:', error);
      setError('Error al cargar datos.');
    });
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const formatHora = (fechaString: string) => { // <-- 5. Tipo
    return format(new Date(fechaString), 'HH:mm');
  };

  const mesasOcupadasHoyIds = new Set(reservasHoy.map(r => r.mesa.id));

  return (
    <div>
      <h2>Reservas del Día</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {reservasHoy.length === 0 ? (
        <p>No hay reservas para hoy por el momento.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Mesa #</th>
              <th>Personas</th>
            </tr>
          </thead>
          <tbody>
            {reservasHoy.map((reserva: Reserva) => ( // <-- 6. Tipo
              <tr key={reserva.id}>
                <td>{formatHora(reserva.fecha_hora)}</td>
                <td>{reserva.cliente.nombre}</td>
                <td>{reserva.mesa.numero}</td>
                <td>{reserva.numero_personas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 className="mt-8">Estado de Mesas (Hoy)</h3>
      <table>
        <thead>
          <tr>
            <th>Mesa #</th>
            <th>Capacidad</th>
            <th>Ubicación</th>
            <th>Estado (Hoy)</th>
          </tr>
        </thead>
        <tbody>
          {todasLasMesas.map((mesa: Mesa) => ( // <-- 7. Tipo
            <tr key={mesa.id}>
              <td>{mesa.numero}</td>
              <td>{mesa.capacidad}</td>
              <td>{mesa.ubicacion}</td>
              <td style={{ 
                color: mesasOcupadasHoyIds.has(mesa.id) ? '#ff9b9b' : '#a1ffb2' 
              }}>
                {mesasOcupadasHoyIds.has(mesa.id) ? 'Reservada (Hoy)' : 'Libre'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}