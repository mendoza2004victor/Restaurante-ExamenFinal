// En: src/components/GestionMesas.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ya lo instalamos antes

// La URL de tu API de NestJS
const API_URL = 'http://localhost:3000/mesas';

export function GestionMesas() {
  const [mesas, setMesas] = useState([]); // Lista de mesas de la DB
  const [error, setError] = useState('');

  // Datos para el formulario de nueva mesa
  const [numero, setNumero] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  // Función para cargar las mesas (GET)
  const fetchMesas = () => {
    axios.get(API_URL)
      .then(response => {
        setMesas(response.data);
        setError('');
      })
      .catch(error => {
        console.error('Error cargando mesas:', error);
        setError('Error al cargar mesas. ¿El backend está funcionando?');
      });
  };

  // Cargar las mesas cuando el componente se monta
  useEffect(() => {
    fetchMesas();
  }, []); // El array vacío [] significa que solo se ejecuta una vez

  // Función para manejar el envío del formulario (POST)
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const nuevaMesa = {
      numero: parseInt(numero), // Convertimos a número
      capacidad: parseInt(capacidad),
      ubicacion: ubicacion,
    };

    // Petición POST para crear la mesa
    axios.post(API_URL, nuevaMesa)
      .then(response => {
        // Éxito: Limpiamos formulario y recargamos la lista
        setNumero('');
        setCapacidad('');
        setUbicacion('');
        setError('');
        fetchMesas(); // Volvemos a cargar la lista de mesas
      })
      .catch(error => {
        console.error('Error al crear la mesa:', error.response.data);
        // Mostrar el error de validación del backend (ej. mesa duplicada)
        setError(`Error al crear mesa: ${error.response.data.message}`);
      });
  };

  return (
    // DIV principal SIN estilos inline
    <div>
      <h2>Gestión de Mesas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Formulario para agregar mesas SIN estilos inline */}
      <form onSubmit={handleSubmit}>
        <h3>Agregar Nueva Mesa</h3>
        <input
          type="number"
          placeholder="Número de Mesa"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Capacidad"
          value={capacidad}
          onChange={(e) => setCapacidad(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Ubicación (Ej: Ventana)"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          required
        />
        <button type="submit">Agregar Mesa</button>
      </form>

      <hr />

      {/* Lista de mesas existentes */}
      <h3>Mesas Actuales</h3>
      {/* Tabla SIN estilos inline (App.css se encarga) */}
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
          {mesas.map(mesa => (
            <tr key={mesa.id}>
              <td>{mesa.id}</td>
              <td>{mesa.numero}</td>
              <td>{mesa.capacidad}</td>
              <td>{mesa.ubicacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}