// En: src/components/FormularioReserva.tsx
import React, { useState } from 'react'; // <-- ¡Listo!
import axios from 'axios';

const API_CLIENTES_URL = 'http://localhost:3000/clientes';
const API_MESAS_URL = 'http://localhost:3000/mesas';
const API_RESERVAS_URL = 'http://localhost:3000/reservas';

// 2. Definir Interface
interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  ubicacion: string;
}

export function FormularioReserva() {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [personas, setPersonas] = useState(1);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const [mesasDisponibles, setMesasDisponibles] = useState<Mesa[]>([]); // <-- 3. Tipo
  const [mesaSeleccionada, setMesaSeleccionada] = useState<number | null>(null); // <-- 3. Tipo
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBuscarDisponibilidad = async (e: React.MouseEvent<HTMLButtonElement>) => { // <-- 4. Tipo
    e.preventDefault();
    setError('');
    setSuccess('');
    setMesasDisponibles([]);
    setMesaSeleccionada(null);

    const fecha_hora_iso = new Date(`${fecha}T${hora}`).toISOString();

    try {
      const response = await axios.get(`${API_MESAS_URL}/disponibles`, {
        params: {
          fecha_hora: fecha_hora_iso,
          numero_personas: parseInt(personas.toString()),
        },
      });

      if (response.data.length === 0) {
        setError('No hay mesas disponibles para ese horario o capacidad.');
      } else {
        setMesasDisponibles(response.data);
      }
    } catch (err: any) { // <-- 5. Tipo
      console.error('Error al buscar disponibilidad:', err.response?.data);
      setError(`Error: ${err.response?.data?.message || 'No se pudo conectar'}`);
    }
  };

  const handleConfirmarReserva = async (e: React.FormEvent<HTMLFormElement>) => { // <-- 4. Tipo
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!mesaSeleccionada) {
      setError('Por favor, seleccione una mesa de la lista.');
      return;
    }

    try {
      let clienteId;
      try {
        const clienteResponse = await axios.post(API_CLIENTES_URL, {
          nombre,
          email,
          telefono,
        });
        clienteId = clienteResponse.data.id;
      } catch (err: any) { // <-- 5. Tipo
        if (err.response && err.response.status === 400 && err.response.data.message.includes('unique constraint')) {
          const clientes = await axios.get(API_CLIENTES_URL);
          const clienteExistente = clientes.data.find((c: any) => c.email === email); // <-- Tipo
          if (clienteExistente) {
            clienteId = clienteExistente.id;
          } else {
            throw new Error('Error al procesar el cliente.');
          }
        } else {
          throw err;
        }
      }

      const fecha_hora_iso = new Date(`${fecha}T${hora}`).toISOString();
      
      await axios.post(API_RESERVAS_URL, {
        fecha_hora: fecha_hora_iso,
        numero_personas: parseInt(personas.toString()),
        clienteId: clienteId,
        mesaId: mesaSeleccionada,
      });

      setSuccess('¡Reserva confirmada con éxito!');
      setFecha('');
      setHora('');
      setPersonas(1);
      setNombre('');
      setEmail('');
      setTelefono('');
      setMesasDisponibles([]);
      setMesaSeleccionada(null);

    } catch (err: any) { // <-- 5. Tipo
      console.error('Error al confirmar reserva:', err.response?.data);
      setError(`Error al reservar: ${err.response?.data?.message || 'No se pudo completar la reserva'}`);
    }
  };

  return (
    <div>
      <h2>Crear Nueva Reserva</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleConfirmarReserva}>
        <fieldset>
          <legend>Paso 1: Detalles de la Reserva</legend>
          <label>Fecha: </label>
          <input type="date" value={fecha} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFecha(e.target.value)} required />
          <label>Hora: </label>
          <input type="time" value={hora} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHora(e.target.value)} required step="1800" />
          <label>Personas: </label>
          <input type="number" value={personas} min="1" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPersonas(parseInt(e.target.value))} required />
          <button type="button" onClick={handleBuscarDisponibilidad}>
            Buscar Mesas
          </button>
        </fieldset>

        {mesasDisponibles.length > 0 && (
          <fieldset>
            <legend>Paso 2: Seleccione una Mesa</legend>
            {mesasDisponibles.map((mesa: Mesa) => ( // <-- 6. Tipo
              <div key={mesa.id}>
                <input
                  type="radio"
                  name="mesa"
                  id={`mesa-${mesa.id}`}
                  value={mesa.id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMesaSeleccionada(parseInt(e.target.value))}
                />
                <label htmlFor={`mesa-${mesa.id}`}>
                  Mesa #{mesa.numero} (Capacidad: {mesa.capacidad}, Ubicación: {mesa.ubicacion})
                </label>
              </div>
            ))}
          </fieldset>
        )}

        {mesaSeleccionada && (
          <fieldset>
            <legend>Paso 3: Sus Datos</legend>
            <label>Nombre: </label>
            <input type="text" value={nombre} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)} required />
            <label>Email: </label>
            <input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
            <label>Teléfono (Opcional): </label>
            <input type="tel" value={telefono} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefono(e.target.value)} />
            <button type="submit">
              Confirmar Reserva
            </button>
          </fieldset>
        )}
      </form>
    </div>
  );
}