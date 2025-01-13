import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap
//import './GestionGasto.css'; 
import { obtenerGasto, borrarGasto } from '../../api/gastos'; // Cambié la importación para gastos
import { obtenerCategoria } from '../../api/categorias'; // Asumiendo que tienes una API para obtener categorías

export const GestionGasto = () => {
  // Estado para manejar la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  // Función para obtener las categorías
  const cargarCategorias = async () => {
    try {
      const categoriasData = await obtenerCategoria(); // Trae las categorías de la API
      setCategorias(categoriasData); // Establece las categorías en el estado
    } catch (error) {
      setMensaje('Error al cargar las categorías.');
      console.error('Error al obtener las categorías:', error);
    }
  };

  // Función para obtener los gastos
  const cargarGastos = async () => {
    try {
      const gastosData = await obtenerGasto(); // Trae los gastos de la API
      setGastos(gastosData); // Establece los gastos en el estado
    } catch (error) {
      setMensaje('Error al cargar los gastos.');
      console.error('Error al obtener los gastos:', error);
    }
  };

  // Llamada a la API al cargar el componente
  useEffect(() => {
    cargarCategorias();
    cargarGastos();
  }, []);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES'); // Formato de fecha en español (día/mes/año)
  };

  // Filtrar los gastos por categoría seleccionada
  const filteredData = selectedCategory
    ? gastos.filter(item => item.id_categoria === parseInt(selectedCategory)) // Convierte el valor de selectedCategory a número
    : gastos; // Si no hay filtro, mostrar todos

  // Función para obtener el nombre de la categoría basado en el id_categoria
  const getCategoriaNombre = (idCategoria) => {
    const categoria = categorias.find(categoria => categoria.id_categoria === idCategoria);
    return categoria ? categoria.nombre : 'Desconocida'; // Retorna el nombre de la categoría o 'Desconocida' si no se encuentra
  };

  const navigate = useNavigate(); // Usamos useNavigate en lugar de useHistory

  const handleEdit = (idGasto) => {
    navigate(`/editar-gasto/${idGasto}`); // Redirige usando navigate
  };

  // Función para manejar la eliminación de un gasto
  const handleDelete = async (idGasto) => {
    // Confirmación antes de eliminar
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este gasto?');
    
    if (confirmDelete) {
      try {
        // Llama a la función de eliminar desde la API (asegúrate de tener esta función implementada en tu API)
        await borrarGasto(idGasto);
        setMensaje('Gasto eliminado con éxito');
        cargarGastos(); // Vuelve a cargar los gastos para actualizar la lista
      } catch (error) {
        setMensaje('Error al eliminar el gasto, intenta nuevamente.');
        console.error(error);
      }
    }
  };

  return (
    <div className="page-content page-container" id="page-content">
      <div className="padding">
        <div className="row container d-flex justify-content-center">
          <div className="col-lg-8 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Gastos</h4>
                {mensaje && <div className="alert alert-info">{mensaje}</div>}
                <div className="mb-3">
                  <label htmlFor="categoria">Filtrar por categoría:</label>
                  <select 
                    id="categoria" 
                    className="form-select" 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">-- Todos --</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id_categoria} value={categoria.id_categoria}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th>Monto</th>
                        <th>Fecha de Gasto</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.descripcion}</td>
                          <td>${item.monto}</td>
                          <td>{formatDate(item.fecha_gasto)}</td>
                          <td>{getCategoriaNombre(item.id_categoria)}</td>
                          <td>
                            <button type="button" className="btn btn-success btn-just-icon btn-sm" onClick={() => handleEdit(item.id_gasto)}>
                              <i className="material-icons">edit</i>
                            </button>
                            <button type="button" className="btn btn-danger btn-just-icon btn-sm" onClick={() => handleDelete(item.id_gasto)}>
                              <i className="material-icons">delete</i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
