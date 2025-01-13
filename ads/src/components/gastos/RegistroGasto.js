import React, { useState, useEffect } from 'react'; 
import { registrarGasto } from '../../api/gastos'; // Importa la función de API para gastos
import { obtenerCategoria } from '../../api/categorias';

export const RegistroGasto = () => {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [fechaGasto, setFechaGasto] = useState(''); // Cambié el nombre del estado a fechaGasto
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
    setIdUsuario('1'); // Cambia este valor según corresponda en tu aplicación
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const gastoData = {
      descripcion,
      monto: parseFloat(monto), 
      id_categoria: parseInt(idCategoria, 10),
      fecha_gasto: fechaGasto, // Cambié el nombre del campo a fecha_gasto
      id_usuario: idUsuario, 
    };

    try {
      // Llama a la API para registrar el gasto
      const response = await registrarGasto(gastoData);
      setMensaje('Gasto registrado con éxito');
      
      // Reinicia el formulario
      setDescripcion('');
      setMonto('');
      setIdCategoria('');
      setFechaGasto('');
    } catch (error) {
      setMensaje('Error al registrar el gasto, intenta nuevamente.');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>Registro de gasto</h1>
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
          <label htmlFor="fecha_gasto">Fecha de gasto</label> {/* Cambié el nombre del campo a fecha_gasto */}
          <input
            type="date"
            id="fecha_gasto"
            value={fechaGasto}
            onChange={(e) => setFechaGasto(e.target.value)}
            required
          />
        </div>
        <input type="hidden" name="id_usuario" value={idUsuario} />
        <button type="submit">Registrar gasto</button> {/* Cambié el texto del botón a "Registrar gasto" */}
      </form>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
    </div>
  );
};
