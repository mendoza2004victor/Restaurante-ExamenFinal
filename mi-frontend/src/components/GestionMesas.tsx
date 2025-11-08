// En: src/components/GestionMesas.tsx
import React, { useState, useEffect } from 'react'; // <-- 1. IMPORTAR
import axios from 'axios';

const API_URL = 'http://localhost:3000/mesas';

// 2. Definir la "forma" de una Mesa
interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  ubicacion: string;
}

export function GestionMesas() {
  const [mesas, setMesas] = useState<Mesa[]>([]); // <-- 3. Añadir tipo
  const [error, setError] = useState('');
  const [numero, setNumero] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const fetchMesas = () => {
    axios.get(API_URL)
      .then(response => {
        setMesas(response.data);
        setError('');
      })
      .catch((error: any) => { // <-- 4. Añadir tipo
        console.error('Error cargando mesas:', error);
        setError('Error al cargar mesas. ¿El backend está funcionando?');
      });
  };

  useEffect(() => {
    fetchMesas();
  }, []); 

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => { // <-- 5. Añadir tipo
    e.preventDefault(); 

    const nuevaMesa = {
      numero: parseInt(numero), 
      capacidad: parseInt(capacidad),
      ubicacion: ubicacion,
    };

    axios.post(API_URL, nuevaMesa)
      .then(() => { // <-- ¡Listo!
        setNumero('');
        setCapacidad('');
        setUbicacion('');
        setError('');
        fetchMesas(); 
      })
      .catch((error: any) => { // <-- 6. Añadir tipo
        console.error('Error al crear la mesa:', error.response.data);
        setError(`Error al crear mesa: ${error.response.data.message}`);
      });
  };

  return (
    <div>
      <h2>Gestión de Mesas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <h3>Agregar Nueva Mesa</h3>
        <input
          type="number"
          placeholder="Número de Mesa"
          value={numero}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumero(e.target.value)} // <-- Tipo
          required
        />
        <input
          type="number"
          placeholder="Capacidad"
          value={capacidad}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCapacidad(e.target.value)} // <-- Tipo
          required
        />
        <input
          type="text"
          placeholder="Ubicación (Ej: Ventana)"
          value={ubicacion}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUbicacion(e.target.value)} // <-- Tipo
          required
        />
        <button type="submit">Agregar Mesa</button>
      </form>

      <hr />

      <h3>Mesas Actuales</h3>
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
          {mesas.map((mesa: Mesa) => ( // <-- 7. Añadir tipo
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