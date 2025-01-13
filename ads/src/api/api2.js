import axios from "axios";

// Direccion del backend
const API_URL = "http://localhost:3001";

//Funcion para las categorias
export const getCategorias = async () => {
    try {
        const response = await axios.get(`${API_URL}/categorias`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las categorias: ", error);
        throw error;
    }
};

export const getTransacciones = async () => {
    try {
        const response = await axios.get(`${API_URL}/transacciones`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las transacciones: ", error);
        throw error;
    }
};

export const getTransaccionesFiltradas = async (fechaInicio, fechaFinal) => {
    try {
        const response = await axios.get(`${API_URL}/transaccionesFiltradas`, {
            params: { fechaInicio, fechaFinal },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener las transacciones filtradas: ", error);
        throw error;
    }
};

export const getResumenTransacciones = async (fechaInicio, fechaFinal) => {
    try {
        const response = await axios.get(`${API_URL}/resumenTransacciones`, {
            params: { fechaInicio, fechaFinal },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener el resumen de transacciones: ", error);
        throw error;
    }
};

export const getGastosPorCategoria = async (fechaInicio, fechaFinal) => {
    try {
        const response = await axios.get(`${API_URL}/gastosPorCategoria`, {
            params: { fechaInicio, fechaFinal },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los gastos por categoría: ", error);
        throw error;
    }
};

export const getIngresosPorCategoria = async (fechaInicio, fechaFinal) => {
    try {
        const response = await axios.get(`${API_URL}/ingresosPorCategoria`, {
            params: { fechaInicio, fechaFinal }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener ingresos por categoría:", error);
        throw error;
    }
};

export const getUsoCategoriasFiltrado = async (fechaInicio, fechaFinal) => {
    try {
        const response = await axios.get(`${API_URL}/usoCategoriasFiltrado`, {
            params: { fechaInicio, fechaFinal }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener el uso de categorías filtrado:", error);
        throw error;
    }
};

export const getAhorrosPorCategoria = async (fechaInicio, fechaFinal) => {
    try {
        const response = await axios.get(`${API_URL}/ahorrosPorCategoria`, {
            params: { fechaInicio, fechaFinal }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener ahorros por categoría:", error);
        throw error;
    }
};