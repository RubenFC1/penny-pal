import api from './api';

// Función para obtener ingresos
export const obtenerIngreso = async () => {
    try {
      const response = await api.get('/obtenerIngresos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los ingresos:', error);
      throw error; 
    }
};

// Función para registrar un ingreso
export const registrarIngreso = async (ingresoData) => {
  try {
    const response = await api.post('/registrarIngreso', ingresoData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar el ingreso:', error);
    throw error; 
  }
};

// Función para obtener un ingreso por su id
export const obtenerIngresoPorId = async (id) => {
  try {
    const response = await api.get(`/obtenerIngreso/${id}`); // Llamada a la API con el id
    return response.data; // Retorna el ingreso encontrado
  } catch (error) {
    console.error('Error al obtener el ingreso:', error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};

// Función para editar el ingreso
export const editarIngreso = async (ingresoData) => {
  try {
    const response = await api.put(`/editarIngreso/${ingresoData.idIngreso}`, ingresoData); // Usamos PUT para editar
    return response.data;
  } catch (error) {
    console.error('Error al editar el ingreso:', error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

// Función para borrar un ingreso por su id
export const borrarIngreso = async (id) => {
  try {
    const response = await api.delete(`/borrarIngreso/${id}`); // Llamada a la API para eliminar el ingreso
    return response.data; // Retorna un mensaje indicando que fue eliminado
  } catch (error) {
    console.error('Error al borrar el ingreso:', error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};
