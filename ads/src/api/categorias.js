import api from './api';

// Función para obtener categorías
export const obtenerCategoria = async () => {
    try {
      const response = await api.get('/obtenerCategoria');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      throw error; 
    }
};
