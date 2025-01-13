import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams para obtener los parámetros de la URL
import { editarIngreso, obtenerIngresoPorId } from '../../api/ingresos'; // Cambié las funciones para ingresos
import { obtenerCategoria } from '../../api/categorias';

export const EditarIngreso = () => {
  const { idIngreso } = useParams(); // El nombre debe coincidir con el parámetro definido en la ruta
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [mensaje, setMensaje] = useState(''); // Para mostrar mensajes de éxito o error
  const [idUsuario, setIdUsuario] = useState('');

  // Función para obtener el ingreso por ID
  const cargarIngreso = async () => {
    try {
      const data = await obtenerIngresoPorId(idIngreso); // Llama a la API con el ID
      // Actualiza los estados con los datos del ingreso
      setDescripcion(data.descripcion);
      setMonto(data.monto);
      setIdCategoria(data.id_categoria);
      // Convierte la fecha al formato YYYY-MM-DD
      const fechaFormateada = new Date(data.fecha_ingreso).toISOString().split('T')[0];
      setFechaIngreso(fechaFormateada);
      setIdUsuario(data.id_usuario); // Asegúrate de que el campo id_usuario esté presente
    } catch (error) {
      setMensaje('Error al cargar el ingreso.');
      console.error('Error al obtener el ingreso:', error);
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

  // Cargar el ingreso cuando el componente se monte
  useEffect(() => {
    cargarCategorias();
    cargarIngreso();
  }, [idIngreso]); // Recarga los datos si el ID cambia

  const handleSubmit = async (event) => {
    event.preventDefault();

    const ingresoData = {
      idIngreso, // Debes enviar el ID del ingreso para que la API sepa qué editar
      descripcion,
      monto: parseFloat(monto),
      id_categoria: parseInt(idCategoria, 10),
      fecha_ingreso: fechaIngreso,
      id_usuario: idUsuario,
    };

    try {
      // Llama a la API para editar el ingreso
      const response = await editarIngreso(ingresoData);
      setMensaje('Ingreso editado con éxito');
      
      // No es necesario reiniciar todos los estados, solo muestra el mensaje
    } catch (error) {
      setMensaje('Error al editar el ingreso, intenta nuevamente.');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Modificación de ingreso</h1>
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
          <label htmlFor="fecha_ingreso">Fecha de ingreso</label>
          <input
            type="date"
            id="fecha_ingreso"
            value={fechaIngreso} // Usa el estado local para el valor
            onChange={(e) => setFechaIngreso(e.target.value)}
            required
          />
        </div>
        <button type="submit">Actualizar ingreso</button>
      </form>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
    </div>
  );
};
