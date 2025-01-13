import api from './api';

// Función para obtener ahorros
export const obtenerAhorro = async () => {
    try {
      const response = await api.get('/obtenerAhorros');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los ahorros:', error);
      throw error; 
    }
};

// Función para registrar un ahorro
export const registrarAhorro = async (ahorroData) => {
  try {
    const response = await api.post('/registrarAhorro', ahorroData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar el ahorro:', error);
    throw error; 
  }
};

// Función para obtener un ahorro por su id
export const obtenerAhorroPorId = async (id) => {
  try {
    const response = await api.get(`/obtenerAhorro/${id}`); // Llamada a la API con el id
    return response.data; // Retorna el ahorro encontrado
  } catch (error) {
    console.error('Error al obtener el ahorro:', error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};

// Función para editar el ahorro
export const editarAhorro = async (ahorroData) => {
  try {
    const response = await api.put(`/editarAhorro/${ahorroData.idAhorro}`, ahorroData); // Usamos PUT para editar
    return response.data;
  } catch (error) {
    console.error('Error al editar el ahorro:', error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

// Función para borrar un ahorro por su id
export const borrarAhorro = async (id) => {
  try {
    const response = await api.delete(`/borrarAhorro/${id}`); // Llamada a la API para eliminar el ahorro
    return response.data; // Retorna un mensaje indicando que fue eliminado
  } catch (error) {
    console.error('Error al borrar el ahorro:', error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};
