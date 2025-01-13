import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams para obtener los parámetros de la URL
import { editarAdeudo, obtenerAdeudoPorId } from '../../api/adeudos';
//import './RegistroAdeudo.css';
import { obtenerCategoria } from '../../api/categorias';

export const EditarAdeudo = () => {
  const { idAdeudo } = useParams(); // El nombre debe coincidir con el parámetro definido en la ruta
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [pagado, setPagado] = useState(false);
  const [mensaje, setMensaje] = useState(''); // Para mostrar mensajes de éxito o error
  const [idUsuario, setIdUsuario] = useState(''); 

  // Función para obtener el adeudo por ID
  const cargarAdeudo = async () => {
    try {
      const data = await obtenerAdeudoPorId(idAdeudo); // Llama a la API con el ID
      // Actualiza los estados con los datos del adeudo
      setDescripcion(data.descripcion);
      setMonto(data.monto);
      setIdCategoria(data.id_categoria);
      // Convierte la fecha al formato YYYY-MM-DD
    const fechaFormateada = new Date(data.fecha_vencimiento).toISOString().split('T')[0];
    setFechaVencimiento(fechaFormateada);
        setPagado(data.pagado);
      setIdUsuario(data.id_usuario); // Asegúrate de que el campo id_usuario esté presente
    } catch (error) {
      setMensaje('Error al cargar el adeudo.');
      console.error('Error al obtener el adeudo:', error);
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

  // Cargar el adeudo cuando el componente se monte
  useEffect(() => {
    cargarCategorias();
    cargarAdeudo();
  }, [idAdeudo]); // Recarga los datos si el ID cambia

  const handleSubmit = async (event) => {
    event.preventDefault();

    const adeudoData = {
      idAdeudo, // Debes enviar el ID del adeudo para que la API sepa qué editar
      descripcion,
      monto: parseFloat(monto), 
      id_categoria: parseInt(idCategoria, 10),
      fecha_vencimiento: fechaVencimiento,
      id_usuario: idUsuario, 
      pagado,
    };

    try {
      // Llama a la API para editar el adeudo
      const response = await editarAdeudo(adeudoData);
      setMensaje('Adeudo editado con éxito');
      
      // No es necesario reiniciar todos los estados, solo muestra el mensaje
    } catch (error) {
      setMensaje('Error al editar el adeudo, intenta nuevamente.');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Modificación de adeudo</h1>
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
          <label htmlFor="pagado">Marcado como pagado</label>
          <input
            type="checkbox"
            id="pagado"
            checked={pagado} // Usa el estado local para controlar si está marcado o no
            onChange={() => setPagado(!pagado)} // Cambia el valor al hacer clic
          />
        </div>
        <div className="input-group">
          <label htmlFor="fecha_vencimiento">Fecha de vencimiento</label>
          <input
            type="date"
            id="fecha_vencimiento"
            value={fechaVencimiento} // Usa el estado local para el valor
            onChange={(e) => setFechaVencimiento(e.target.value)}
            required
          />
        </div>
        <button type="submit">Actualizar adeudo</button>
      </form>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
    </div>
  );
}
