import React, { useState, useEffect } from 'react';
import { registrarDeuda } from '../../api/deudas'; // Importa la función de API
import { obtenerCategoria } from '../../api/categorias';

export const RegistroDeuda = () => {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [entidadAcreedora, setEntidadAcreedora] = useState(''); // Campo adicional para la entidad acreedora
  const [mensaje, setMensaje] = useState(''); // Para mostrar mensajes de éxito o error
  const [idUsuario, setIdUsuario] = useState(''); 

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

  // Llamada a la API al cargar el componente
  useEffect(() => {
    cargarCategorias();
    setIdUsuario('1');
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const deudaData = {
      descripcion,
      monto: parseFloat(monto),
      id_categoria: parseInt(idCategoria, 10),
      fecha_vencimiento: fechaVencimiento,
      entidad_acreedora: entidadAcreedora, // Incluyendo el nuevo campo de entidad acreedora
      id_usuario: idUsuario,
    };

    try {
      // Llama a la API para registrar la deuda
      const response = await registrarDeuda(deudaData);
      setMensaje('Deuda registrada con éxito');
      
      // Reinicia el formulario
      setDescripcion('');
      setMonto('');
      setIdCategoria('');
      setFechaVencimiento('');
      setEntidadAcreedora('');
    } catch (error) {
      setMensaje('Error al registrar la deuda, intenta nuevamente.');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Registro de deuda</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="descripcion">Descripción</label>
          <input
            type="text"
            id="descripcion"
            placeholder="Ingresa una descripción"
            value={descripcion}
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
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="categoria">Categoría</label>
          <select
            id="id_categoria"
            value={idCategoria}
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
          <label htmlFor="fecha_vencimiento">Fecha de pago</label>
          <input
            type="date"
            id="fecha_vencimiento"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="entidad_acreedora">Entidad Acreedora</label>
          <input
            type="text"
            id="entidad_acreedora"
            placeholder="Ingresa la entidad acreedora"
            value={entidadAcreedora}
            onChange={(e) => setEntidadAcreedora(e.target.value)}
            required
          />
        </div>
        <input type="hidden" name="id_usuario" value={idUsuario} />
        <button type="submit">Registrar deuda</button>
      </form>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
    </div>
  );
};
