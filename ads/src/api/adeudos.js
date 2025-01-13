import api from './api';

// Función para obtener adeudos
export const obtenerAdeudo = async () => {
    try {
      const response = await api.get('/obtenerAdeudos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los adeudos:', error);
      throw error; 
    }
};

// Función para registrar un adeudo
export const registrarAdeudo = async (adeudoData) => {
  try {
    const response = await api.post('/registrarAdeudo', adeudoData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar el adeudo:', error);
    throw error; 
  }
};

// Función para obtener un adeudo por su id
export const obtenerAdeudoPorId = async (id) => {
  try {
    const response = await api.get(`/obtenerAdeudo/${id}`); // Llamada a la API con el id
    return response.data; // Retorna el adeudo encontrado
  } catch (error) {
    console.error('Error al obtener el adeudo:', error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};

// Función para editar el adeudo
export const editarAdeudo = async (adeudoData) => {
  try {
    const response = await api.put(`/editarAdeudo/${adeudoData.idAdeudo}`, adeudoData); // Usamos PUT para editar
    return response.data;
  } catch (error) {
    console.error('Error al editar el adeudo:', error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

// Función para borrar un adeudo por su id
export const borrarAdeudo = async (id) => {
  try {
    const response = await api.delete(`/borrarAdeudo/${id}`); // Llamada a la API para eliminar el adeudo
    return response.data; // Retorna un mensaje indicando que fue eliminado
  } catch (error) {
    console.error('Error al borrar el adeudo:', error);
    throw error; // Lanza el error para que el componente lo maneje
  }
};
