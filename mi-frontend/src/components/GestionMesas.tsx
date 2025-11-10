// En: src/components/GestionMesas.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_MESAS_URL = 'http://localhost:3000/mesas';

// 1. Definir la Interfaz para "Mesa"
interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  ubicacion: string;
  // estado: string; // Puedes descomentar esto si tu API lo envía
}

export function GestionMesas() {
  // --- Estados del Componente ---
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // <-- La variable que daba el error

  // Estados para el formulario de nueva mesa
  const [numero, setNumero] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  // --- Cargar Mesas al Montar (useEffect) ---
  useEffect(() => {
    fetchMesas();
  }, []); // El array vacío [] asegura que se ejecute solo una vez

  const fetchMesas = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Mesa[]>(API_MESAS_URL);
      setMesas(response.data);
      setError(''); // Limpiar errores si la carga es exitosa
    } catch (err: any) {
      console.error("Error al cargar mesas:", err);
      setError('No se pudieron cargar las mesas desde el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // --- Función para Crear Nueva Mesa ---
  const handleCrearMesa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const nuevaMesa = {
        numero: parseInt(numero),
        capacidad: parseInt(capacidad),
        ubicacion: ubicacion,
      };

      const response = await axios.post<Mesa>(API_MESAS_URL, nuevaMesa);
      
      // Actualizar el estado local para reflejar la nueva mesa
      setMesas([...mesas, response.data]);

      // Limpiar formulario
      setNumero('');
      setCapacidad('');
      setUbicacion('');

    } catch (err: any) {
      console.error("Error al crear mesa:", err.response?.data);
      let errorMsg = 'Error al crear la mesa.';
      if (err.response?.data?.message) {
        if (Array.isArray(err.response.data.message)) {
          errorMsg = err.response.data.message.join(', ');
        } else {
          errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
    }
  };

  // --- Renderizado del Componente ---
  return (
    <div className="component-container">
      <h2>Gestión de Mesas</h2>

      {/* --- AQUÍ ESTÁ LA CORRECCIÓN --- */}
      {/* Mostramos el error si existe. Esto "lee" la variable 'error' */}
      {error && <p className="error-message">{error}</p>}

      {/* --- Formulario para Nueva Mesa --- */}
      <form onSubmit={handleCrearMesa}>
        <fieldset>
          <legend>Añadir Nueva Mesa</legend>
          <label>Número:</label>
          <input
            type="number"
            min="1"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
          />
          <label>Capacidad:</label>
          <input
            type="number"
            min="1"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            required
          />
          <label>Ubicación:</label>
          <input
            type="text"
            placeholder="Ej. Ventana, Terraza, Salón"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
          />
          <button type="submit">Crear Mesa</button>
        </fieldset>
      </form>

      <hr />

      {/* --- Lista de Mesas Actuales --- */}
      <h3>Mesas Registradas</h3>
      
      {loading && <p>Cargando mesas...</p>}

      {!loading && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Número</th>
              <th>Capacidad</th>
              <th>Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {mesas.map((mesa) => (
              <tr key={mesa.id}>
                <td>{mesa.id}</td>
                <td>{mesa.numero}</td>
                <td>{mesa.capacidad}</td>
                <td>{mesa.ubicacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}