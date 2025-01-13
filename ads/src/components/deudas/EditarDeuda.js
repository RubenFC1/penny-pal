import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams para obtener los parámetros de la URL
import { editarDeuda, obtenerDeudaPorId } from '../../api/deudas'; // Modificado para usar deudas
import { obtenerCategoria } from '../../api/categorias';

export const EditarDeuda = () => {
  const { idDeuda } = useParams(); // El nombre debe coincidir con el parámetro definido en la ruta
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [pagado, setPagado] = useState(false);
  const [entidadAcreedora, setEntidadAcreedora] = useState(''); // Nuevo campo para entidad acreedora
  const [mensaje, setMensaje] = useState(''); // Para mostrar mensajes de éxito o error
  const [idUsuario, setIdUsuario] = useState('');

  // Función para obtener la deuda por ID
  const cargarDeuda = async () => {
    try {
      const data = await obtenerDeudaPorId(idDeuda); // Llama a la API con el ID
      // Actualiza los estados con los datos de la deuda
      setDescripcion(data.descripcion);
      setMonto(data.monto);
      setIdCategoria(data.id_categoria);
      setFechaVencimiento(new Date(data.fecha_vencimiento).toISOString().split('T')[0]);
      setPagado(data.pagado);
      setEntidadAcreedora(data.entidad_acreedora); // Asignamos la entidad acreedora
      setIdUsuario(data.id_usuario); // Asegúrate de que el campo id_usuario esté presente
    } catch (error) {
      setMensaje('Error al cargar la deuda.');
      console.error('Error al obtener la deuda:', error);
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

  // Cargar la deuda cuando el componente se monte
  useEffect(() => {
    cargarCategorias();
    cargarDeuda();
  }, [idDeuda]); // Recarga los datos si el ID cambia

  const handleSubmit = async (event) => {
    event.preventDefault();

    const deudaData = {
      idDeuda, // Debes enviar el ID de la deuda para que la API sepa qué editar
      descripcion,
      monto: parseFloat(monto), 
      id_categoria: parseInt(idCategoria, 10),
      fecha_vencimiento: fechaVencimiento,
      id_usuario: idUsuario, 
      pagado,
      entidad_acreedora: entidadAcreedora, // Enviar la entidad acreedora
    };

    try {
      // Llama a la API para editar la deuda
      const response = await editarDeuda(deudaData);
      setMensaje('Deuda editada con éxito');
    } catch (error) {
      setMensaje('Error al editar la deuda, intenta nuevamente.');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Modificación de deuda</h1>
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
          <label htmlFor="entidad_acreedora">Entidad acreedora</label>
          <input
            type="text"
            id="entidad_acreedora"
            placeholder="Ingresa la entidad acreedora"
            value={entidadAcreedora} // Usa el estado local para el valor
            onChange={(e) => setEntidadAcreedora(e.target.value)}
            required
          />
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
        <button type="submit">Actualizar deuda</button>
      </form>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
    </div>
  );
};
