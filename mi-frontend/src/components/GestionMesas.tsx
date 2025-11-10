// En: src/components/GestionMesas.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Importamos toast

const API_URL = 'http://localhost:3000/mesas';

const UBICACIONES_POSIBLES = [
  'Ventana',
  'Interior',
  'Terraza',
  'Barra',
  'VIP'
];

interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  ubicacion: string;
}

export function GestionMesas() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  
  // --- 👇 'error' y 'setError' eliminados de aquí 👇 ---
  const [numero, setNumero] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [ubicacion, setUbicacion] = useState(''); 

  const fetchMesas = () => {
    axios.get(API_URL)
      .then(response => setMesas(response.data))
      .catch(() => {
        toast.error("Error al cargar las mesas. ¿El backend está funcionando?");
      });
  };

  useEffect(() => {
    fetchMesas();
  }, []); 

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    
    if (!ubicacion) {
      toast.warn('Por favor, seleccione una ubicación.');
      return;
    }

    const nuevaMesa = {
      numero: parseInt(numero), 
      capacidad: parseInt(capacidad),
      ubicacion: ubicacion,
    };

    axios.post(API_URL, nuevaMesa)
      .then(() => { 
        setNumero('');
        setCapacidad('');
        setUbicacion(''); 
        fetchMesas(); 
        toast.success('¡Mesa agregada con éxito!');
      })
      .catch((error: any) => {
        toast.error(`Error al crear mesa: ${error.response.data.message}`);
      });
  };

  const handleDeleteMesa = async (id: number) => {
    const mensaje = `¿Deseas eliminar la Mesa ID ${id}? 
Esta acción es permanente y la mesa desaparecerá de la lista.`;
    
    if (window.confirm(mensaje)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchMesas(); 
        toast.success('¡Mesa eliminada con éxito!');
      } catch (err: any) {
        toast.error(`Error al eliminar: ${err.response.data.message}`);
      }
    }
  };

  return (
    <div className="component-container">
      <h2>Gestión de Mesas</h2>
      {/* --- El <p> de error fue eliminado de aquí --- */}

      <form onSubmit={handleSubmit}>
        <h3>Agregar Nueva Mesa</h3>
        <input
          type="number"
          placeholder="Número de Mesa"
          value={numero}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumero(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Capacidad"
          value={capacidad}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCapacidad(e.target.value)}
          required
        />
        
        <select
          value={ubicacion}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUbicacion(e.target.value)}
          required
        >
          <option value="" disabled style={{ color: 'gray' }}>Seleccione una ubicación...</option>
          {UBICACIONES_POSIBLES.map(opcion => (
            <option key={opcion} value={opcion}>{opcion}</option>
          ))}
        </select>
        
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
            <th>Acciones</th> 
          </tr>
        </thead>
        <tbody>
          {mesas.map((mesa: Mesa) => (
            <tr key={mesa.id}>
              <td>{mesa.id}</td>
              <td>{mesa.numero}</td>
              <td>{mesa.capacidad}</td>
              <td>{mesa.ubicacion}</td>
              <td>
                <button
                  type="button" 
                  style={{ 
                    backgroundColor: 'var(--danger-color)',
                    fontSize: '0.9em',
                    padding: '5px 10px'
                  }}
                  onClick={() => handleDeleteMesa(mesa.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}