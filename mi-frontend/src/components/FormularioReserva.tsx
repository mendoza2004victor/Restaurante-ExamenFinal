// En: src/components/FormularioReserva.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API_CLIENTES_URL = 'http://localhost:3000/clientes';
const API_MESAS_URL = 'http://localhost:3000/mesas';
const API_RESERVAS_URL = 'http://localhost:3000/reservas';

export function FormularioReserva() {
  // --- Estado para todos los campos del formulario ---
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState(''); // Ej: "14:30"
  const [personas, setPersonas] = useState(1);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  // --- Estado para el flujo ---
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- PASO 1: Buscar Mesas Disponibles ---
  const handleBuscarDisponibilidad = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setMesasDisponibles([]);
    setMesaSeleccionada(null);

    // Combinamos fecha y hora en formato ISO (que el backend espera)
    const fecha_hora_iso = new Date(`${fecha}T${hora}`).toISOString();

    try {
      // Usamos el endpoint que creamos: GET /mesas/disponibles
      const response = await axios.get(`${API_MESAS_URL}/disponibles`, {
        params: {
          fecha_hora: fecha_hora_iso,
          numero_personas: parseInt(personas),
        },
      });

      if (response.data.length === 0) {
        setError('No hay mesas disponibles para ese horario o capacidad.');
      } else {
        setMesasDisponibles(response.data);
      }
    } catch (err) {
      console.error('Error al buscar disponibilidad:', err.response?.data);
      setError(`Error: ${err.response?.data?.message || 'No se pudo conectar'}`);
    }
  };

  // --- PASO 2: Confirmar la Reserva ---
  const handleConfirmarReserva = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!mesaSeleccionada) {
      setError('Por favor, seleccione una mesa de la lista.');
      return;
    }

    try {
      // 1. Crear (o encontrar) al cliente
      let clienteId;
      try {
        const clienteResponse = await axios.post(API_CLIENTES_URL, {
          nombre,
          email,
          telefono,
        });
        clienteId = clienteResponse.data.id;
      } catch (err) {
        // Si el cliente ya existe (error de email único), lo buscamos
        if (err.response && err.response.status === 400 && err.response.data.message.includes('unique constraint')) {
          const clientes = await axios.get(API_CLIENTES_URL);
          const clienteExistente = clientes.data.find(c => c.email === email);
          if (clienteExistente) {
            clienteId = clienteExistente.id;
          } else {
            throw new Error('Error al procesar el cliente.');
          }
        } else {
          throw err; // Lanzar otro tipo de error
        }
      }

      // 2. Crear la reserva
      const fecha_hora_iso = new Date(`${fecha}T${hora}`).toISOString();
      
      await axios.post(API_RESERVAS_URL, {
        fecha_hora: fecha_hora_iso,
        numero_personas: parseInt(personas),
        clienteId: clienteId,
        mesaId: mesaSeleccionada,
      });

      // 3. ¡Éxito!
      setSuccess('¡Reserva confirmada con éxito!');
      // Limpiar formulario
      setFecha('');
      setHora('');
      setPersonas(1);
      setNombre('');
      setEmail('');
      setTelefono('');
      setMesasDisponibles([]);
      setMesaSeleccionada(null);

    } catch (err) {
      console.error('Error al confirmar reserva:', err.response?.data);
      setError(`Error al reservar: ${err.response?.data?.message || 'No se pudo completar la reserva'}`);
    }
  };

  return (
    // DIV principal SIN estilos inline
    <div>
      <h2>Crear Nueva Reserva</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Usamos un solo formulario que maneja ambos pasos */}
      <form onSubmit={handleConfirmarReserva}>
        
        {/* --- SECCIÓN 1: DATOS DE RESERVA --- */}
        <fieldset>
          <legend>Paso 1: Detalles de la Reserva</legend>
          <label>Fecha: </label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          
          <label>Hora: </label>
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required step="1800" />
          
          <label>Personas: </label>
          <input type="number" value={personas} min="1" onChange={(e) => setPersonas(e.target.value)} required />
          
          <button type="button" onClick={handleBuscarDisponibilidad}>
            Buscar Mesas
          </button>
        </fieldset>

        {/* --- SECCIÓN 2: MESAS DISPONIBLES (Aparece después de buscar) --- */}
        {mesasDisponibles.length > 0 && (
          <fieldset>
            <legend>Paso 2: Seleccione una Mesa</legend>
            {mesasDisponibles.map(mesa => (
              <div key={mesa.id}>
                <input
                  type="radio"
                  name="mesa"
                  id={`mesa-${mesa.id}`}
                  value={mesa.id}
                  onChange={(e) => setMesaSeleccionada(parseInt(e.target.value))}
                />
                <label htmlFor={`mesa-${mesa.id}`}>
                  Mesa #{mesa.numero} (Capacidad: {mesa.capacidad}, Ubicación: {mesa.ubicacion})
                </label>
              </div>
            ))}
          </fieldset>
        )}

        {/* --- SECCIÓN 3: DATOS DEL CLIENTE (Aparece si hay mesa seleccionada) --- */}
        {mesaSeleccionada && (
          <fieldset>
            <legend>Paso 3: Sus Datos</legend>
            <label>Nombre: </label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            
            <label>Email: </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            
            <label>Teléfono (Opcional): </label>
            <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />

            <button type="submit">
              Confirmar Reserva
            </button>
          </fieldset>
        )}
      </form>
    </div>
  );
}