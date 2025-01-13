import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams para obtener los parámetros de la URL
import { editarAhorro, obtenerAhorroPorId } from '../../api/ahorros'; // Cambié las funciones para ahorros
import { obtenerCategoria } from '../../api/categorias';

export const EditarAhorro = () => {
  const { idAhorro } = useParams(); // El nombre debe coincidir con el parámetro definido en la ruta
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [fechaAhorro, setFechaAhorro] = useState('');
  const [mensaje, setMensaje] = useState(''); // Para mostrar mensajes de éxito o error
  const [idUsuario, setIdUsuario] = useState('');

  // Función para obtener el ahorro por ID
  const cargarAhorro = async () => {
    try {
      const data = await obtenerAhorroPorId(idAhorro); // Llama a la API con el ID
      // Actualiza los estados con los datos del ahorro
      setDescripcion(data.descripcion);
      setMonto(data.monto);
      setIdCategoria(data.id_categoria);
      // Convierte la fecha al formato YYYY-MM-DD
      const fechaFormateada = new Date(data.fecha_ahorro).toISOString().split('T')[0];
      setFechaAhorro(fechaFormateada);
      setIdUsuario(data.id_usuario); // Asegúrate de que el campo id_usuario esté presente
    } catch (error) {
      setMensaje('Error al cargar el ahorro.');
      console.error('Error al obtener el ahorro:', error);
    }
  };

  // Función para obtener las categorías
  const cargarCategorias = async () => {
    try {
      const categoriasData = await obtenerCategoria();
      setCategorias(categoriasData); // Establece las categorías en el estado
    } catch (error) {
      setMensaje('Error al cargar las categorías.');
      console.error('Error al obtener las categorías:', error);
    }
  };

  // Cargar el ahorro cuando el componente se monte
  useEffect(() => {
    cargarCategorias();
    cargarAhorro();
  }, [idAhorro]); // Recarga los datos si el ID cambia

  const handleSubmit = async (event) => {
    event.preventDefault();

    const ahorroData = {
      idAhorro, // Debes enviar el ID del ahorro para que la API sepa qué editar
      descripcion,
      monto: parseFloat(monto),
      id_categoria: parseInt(idCategoria, 10),
      fecha_ahorro: fechaAhorro,
      id_usuario: idUsuario,
    };

    try {
      // Llama a la API para editar el ahorro
      const response = await editarAhorro(ahorroData);
      setMensaje('Ahorro editado con éxito');
      
      // No es necesario reiniciar todos los estados, solo muestra el mensaje
    } catch (error) {
      setMensaje('Error al editar el ahorro, intenta nuevamente.');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Modificación de ahorro</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="descripcion">Descripción</label>
          <input
            type="text"
            id="descripcion"
            placeholder="Ingresa una descripción"
            value={descripcion} // Usa el estado local para el valor
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="monto">Monto ($)</label>
          <input
            type="number"
            id="monto"
            placeholder="Ingresa el monto"
            value={monto} // Usa el estado local para el valor
            onChange={(e) => setMonto(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="categoria">Categoría</label>
          <select
            id="id_categoria"
            value={idCategoria} // Usa el estado local para el valor
            onChange={(e) => setIdCategoria(e.target.value)}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="fecha_ahorro">Fecha de ahorro</label>
          <input
            type="date"
            id="fecha_ahorro"
            value={fechaAhorro} // Usa el estado local para el valor
            onChange={(e) => setFechaAhorro(e.target.value)}
            required
          />
        </div>
        <button type="submit">Actualizar ahorro</button>
      </form>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
    </div>
  );
};
