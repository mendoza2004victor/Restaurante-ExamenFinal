// En: src/components/DashboardRestaurante.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Este es el endpoint especial que creamos
const API_URL = 'http://localhost:3000/reservas/hoy';

export function DashboardRestaurante() {
  const [reservasHoy, setReservasHoy] = useState([]);
  const [error, setError] = useState('');

  // Función para cargar las reservas del día
  const fetchReservasHoy = () => {
    axios.get(API_URL)
      .then(response => {
        // El backend ya nos da las reservas ordenadas por hora
        setReservasHoy(response.data);
        setError('');
      })
      .catch(error => {
        console.error('Error cargando reservas:', error);
        setError('Error al cargar las reservas del día.');
      });
  };

  // Cargar las reservas cuando el componente se monta
  useEffect(() => {
    fetchReservasHoy();

    // Opcional: Refrescar la lista cada 30 segundos
    const intervalId = setInterval(fetchReservasHoy, 30000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []); // El array vacío [] significa que solo se ejecuta una vez al inicio

  // Función para formatear la hora (ej. "14:30")
  const formatHora = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    // DIV principal SIN estilos inline
    <div>
      <h2>Dashboard: Reservas del Día</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {reservasHoy.length === 0 ? (
        <p>No hay reservas para hoy por el momento.</p>
      ) : (
        // Tabla SIN estilos inline
        <table>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Mesa #</th>
              <th>Personas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservasHoy.map(reserva => (
              <tr key={reserva.id}>
                <td>{formatHora(reserva.fecha_hora)}</td>
                <td>{reserva.cliente.nombre}</td>
                <td>{reserva.cliente.email}</td>
                <td>{reserva.mesa.numero}</td>
                <td>{reserva.numero_personas}</td>
                <td>{reserva.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}