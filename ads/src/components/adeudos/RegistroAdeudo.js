import React, { useState, useEffect } from 'react';
import './RegistroAdeudo.css';
import { registrarAdeudo } from '../../api/adeudos'; // Importa la función de API
import { obtenerCategoria } from '../../api/categorias';

export const RegistroAdeudo = () => {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
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

    const adeudoData = {
      descripcion,
      monto: parseFloat(monto), 
      id_categoria:  parseInt(idCategoria, 10),
      fecha_vencimiento: fechaVencimiento,
      id_usuario: idUsuario, 
    };

    try {
      // Llama a la API para registrar el adeudo
      const response = await registrarAdeudo(adeudoData);
      setMensaje('Adeudo registrado con éxito');
      
      // Reinicia el formulario
      setDescripcion('');
      setMonto('');
      setIdCategoria('');
      setFechaVencimiento('');
    } catch (error) {
      setMensaje('Error al registrar el adeudo, intenta nuevamente.');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Registro de adeudo</h1>
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
          <label htmlFor="fecha_vencimiento">Fecha de vencimiento</label>
          <input
            type="date"
            id="fecha_vencimiento"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            required
          />
        </div>
        <input type="hidden" name="id_usuario" value={idUsuario} />
        <button type="submit">Registrar adeudo</button>
      </form>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
    </div>
  );
};
