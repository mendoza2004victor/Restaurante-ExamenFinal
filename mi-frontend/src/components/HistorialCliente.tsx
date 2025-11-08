// En: src/components/HistorialCliente.tsx
import { useState } from 'react'; // <-- 1. IMPORTAR useState
import axios from 'axios';
import React from 'react'; // <-- 1. IMPORTAR React para los tipos de Eventos

const API_CLIENTES_URL = 'http://localhost:3000/clientes';

// --- 2. Definir Interfaces (la clave de TypeScript) ---
interface Cliente {
  id: number | string;
  nombre: string;
  email: string;
  telefono?: string; // El '?' significa que es opcional
}

interface Reserva {
  id: number | string;
  fecha_hora: string;
  numero_personas: number;
  estado: string;
  mesa: {
    numero: number | string;
  };
}

export function HistorialCliente() {
  // --- 3. Tipar los Estados ---
  const [emailBusqueda, setEmailBusqueda] = useState<string>('');
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null);
  const [historial, setHistorial] = useState<Reserva[]>([]); // Es un array de Reservas
  const [error, setError] = useState<string>('');

  // --- 4. Tipar Parámetros de Funciones ---
  const handleBuscarCliente = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setClienteEncontrado(null);
    setHistorial([]);

    try {
      // --- 5. Tipar las respuestas de Axios ---
      const response = await axios.get<Cliente[]>(API_CLIENTES_URL);

      // (TypeScript ahora sabe que 'c' es de tipo 'Cliente' gracias al axios.get<Cliente[]>)
      const cliente = response.data.find(c =>
        c.email.toLowerCase() === emailBusqueda.toLowerCase()
      );

      if (!cliente) {
        setError('Cliente no encontrado con ese email.');
        return;
      }

      setClienteEncontrado(cliente);

      // --- 5. Tipar las respuestas de Axios ---
      const historialResponse = await axios.get<Reserva[]>(
        `${API_CLIENTES_URL}/${cliente.id}/historial`
      );
      setHistorial(historialResponse.data);

    } catch (err: any) { // <-- 4. Tipar el error (any es la forma rápida)
      console.error('Error al buscar cliente:', err.response?.data);
      setError('Error al buscar el cliente.');
    }
  };

  // --- 4. Tipar Parámetros de Funciones ---
  const formatFechaHora = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-GT', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    // --- 6. Aplicar Clases CSS Globales ---
    <div className="component-container">
      <h2>Historial de Clientes Frecuentes</h2>
      {error && <p className="error-message">{error}</p>}

      {/* Formulario de Búsqueda */}
      <form onSubmit={handleBuscarCliente}>
        <label>Buscar cliente por Email: </label>
        <input
          type="email"
          placeholder="email@cliente.com"
          value={emailBusqueda}
          // --- 4. Tipar Parámetros de Funciones ---
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailBusqueda(e.target.value)}
          required
        />
        <button type="submit">Buscar</button>
      </form>

      {/* --- Resultados de la Búsqueda --- */}
      {clienteEncontrado && (
        // (No es necesario un .component-container anidado)
        <div>
          <h3>Resultados para: {clienteEncontrado.nombre}</h3>
          <p>Email: {clienteEncontrado.email}</p>
          <p>Teléfono: {clienteEncontrado.telefono || 'N/A'}</p>

          <h4>Historial de Reservas ({historial.length})</h4>
          {historial.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Mesa #</th>
                  <th>Personas</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {/* (TypeScript ahora sabe que 'reserva' es de tipo 'Reserva') */}
                {historial.map(reserva => (
                  <tr key={reserva.id}>
                    <td>{formatFechaHora(reserva.fecha_hora)}</td>
                    <td>{reserva.mesa.numero}</td>
                    <td>{reserva.numero_personas}</td>
                    <td>{reserva.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Este cliente no tiene reservas en su historial.</p>
          )}
        </div>
      )}
    </div>
  );
}