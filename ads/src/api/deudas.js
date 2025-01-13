import api from './api';

// Función para obtener deudas
export const obtenerDeuda = async () => {
  try {
    const response = await api.get('/obtenerDeudas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener las deudas:', error);
    throw error; 
  }
};

// Función para registrar una deuda
export const registrarDeuda = async (deudaData) => {
  try {
    const response = await api.post('/registrarDeuda', deudaData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar la deuda:', error);
    throw error; 
  }
};

// Función para obtener una deuda por su id
export const obtenerDeudaPorId = async (id) => {
  try {
    const response = await api.get(`/obtenerDeuda/${id}`); // Llamada a la API con el id
    return response.data; // Retorna la deuda encontrada
  } catch (error) {
    console.error('Error al obtener la deuda:', error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};

// Función para editar una deuda
export const editarDeuda = async (deudaData) => {
  try {
    const response = await api.put(`/editarDeuda/${deudaData.idDeuda}`, deudaData); // Usamos PUT para editar
    return response.data;
  } catch (error) {
    console.error('Error al editar la deuda:', error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

// Función para borrar una deuda por su id
export const borrarDeuda = async (id) => {
  try {
    const response = await api.delete(`/borrarDeuda/${id}`); // Llamada a la API para eliminar la deuda
    return response.data; // Retorna un mensaje indicando que fue eliminada
  } catch (error) {
    console.error('Error al borrar la deuda:', error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};
