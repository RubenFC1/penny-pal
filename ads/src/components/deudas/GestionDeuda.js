import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap

import { obtenerDeuda, borrarDeuda } from '../../api/deudas'; // Importamos las funciones para trabajar con deudas
import { obtenerCategoria } from '../../api/categorias'; // Asumiendo que tienes una API para obtener categorías

export const GestionDeuda = () => {
  // Estado para manejar la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [deudas, setDeudas] = useState([]);
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

  // Función para obtener las deudas
  const cargarDeudas = async () => {
    try {
      const deudasData = await obtenerDeuda(); // Trae las deudas de la API
      setDeudas(deudasData); // Establece las deudas en el estado
    } catch (error) {
      setMensaje('Error al cargar las deudas.');
      console.error('Error al obtener las deudas:', error);
    }
  };

  // Llamada a la API al cargar el componente
  useEffect(() => {
    cargarCategorias();
    cargarDeudas();
  }, []);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES'); // Formato de fecha en español (día/mes/año)
  };
  
  // Filtrar las deudas por categoría seleccionada
  const filteredData = selectedCategory
    ? deudas.filter(item => item.id_categoria === parseInt(selectedCategory)) // Convierte el valor de selectedCategory a número
    : deudas; // Si no hay filtro, mostrar todas

  // Función para obtener el nombre de la categoría basado en el id_categoria
  const getCategoriaNombre = (idCategoria) => {
    const categoria = categorias.find(categoria => categoria.id_categoria === idCategoria);
    return categoria ? categoria.nombre : 'Desconocida'; // Retorna el nombre de la categoría o 'Desconocida' si no se encuentra
  };

  const navigate = useNavigate(); // Usamos useNavigate en lugar de useHistory

  const handleEdit = (idDeuda) => {
    navigate(`/editar-deuda/${idDeuda}`); // Redirige usando navigate
  };

  // Función para manejar la eliminación de una deuda
  const handleDelete = async (idDeuda) => {
    // Confirmación antes de eliminar
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta deuda?');
    
    if (confirmDelete) {
      try {
        // Llama a la función de eliminar desde la API (asegúrate de tener esta función implementada en tu API)
        await borrarDeuda(idDeuda);
        setMensaje('Deuda eliminada con éxito');
        cargarDeudas(); // Vuelve a cargar las deudas para actualizar la lista
      } catch (error) {
        setMensaje('Error al eliminar la deuda, intenta nuevamente.');
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
                <h4 className="card-title">Deudas</h4>
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
                        <th>Fecha pago</th>
                        <th>Categoría</th>
                        <th>Entidad Acreedora</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.descripcion}</td>
                          <td>${item.monto}</td>
                          <td>{formatDate(item.fecha_vencimiento)}</td>
                          <td>{getCategoriaNombre(item.id_categoria)}</td>
                          <td>{item.entidad_acreedora}</td>
                          <td>
                            <label className={`badge ${item.pagado ? "badge-success" : "badge-danger"}`}>
                              {item.pagado ? "Pagada" : "Pendiente"}
                            </label>
                          </td>
                          <td>
                            <button type="button" className="btn btn-success btn-just-icon btn-sm" onClick={() => handleEdit(item.id_deuda)}>
                              <i className="material-icons">edit</i>
                            </button>
                            <button type="button" className="btn btn-danger btn-just-icon btn-sm" onClick={() => handleDelete(item.id_deuda)}>
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
