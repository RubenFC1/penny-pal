import api from './api';

// Función para obtener gastos
export const obtenerGasto = async () => {
  try {
    const response = await api.get('/obtenerGastos');
    return response.data;
  } catch (error) {
    console.error('Error al obtener los gastos:', error);
    throw error; 
  }
};

// Función para registrar un gasto
export const registrarGasto = async (gastoData) => {
  try {
    const response = await api.post('/registrarGasto', gastoData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar el gasto:', error);
    throw error; 
  }
};

// Función para obtener un gasto por su id
export const obtenerGastoPorId = async (id) => {
  try {
    const response = await api.get(`/obtenerGasto/${id}`); // Llamada a la API con el id
    return response.data; // Retorna el gasto encontrado
  } catch (error) {
    console.error('Error al obtener el gasto:', error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};

// Función para editar el gasto
export const editarGasto = async (gastoData) => {
  try {
    const response = await api.put(`/editarGasto/${gastoData.idGasto}`, gastoData); // Usamos PUT para editar
    return response.data;
  } catch (error) {
    console.error('Error al editar el gasto:', error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

// Función para borrar un gasto por su id
export const borrarGasto = async (id) => {
  try {
    const response = await api.delete(`/borrarGasto/${id}`); // Llamada a la API para eliminar el gasto
    return response.data; // Retorna un mensaje indicando que fue eliminado
  } catch (error) {
    console.error('Error al borrar el gasto:', error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};
