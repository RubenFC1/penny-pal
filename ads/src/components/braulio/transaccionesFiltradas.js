import React, { useState, useEffect } from "react";
import { getTransaccionesFiltradas } from "../../api/api2";

const TransaccionesFiltradas = ({ fechaInicio, fechaFinal }) => {
  const [transacciones, setTransacciones] = useState([]);
  const [error, setError] = useState(null); // Añadimos el estado de error

  useEffect(() => {
    if (fechaInicio && fechaFinal) {
      const fetchData = async () => {
        try {
          const data = await getTransaccionesFiltradas(fechaInicio, fechaFinal);
          setTransacciones(data);
        } catch (error) {
          console.error("Error al filtrar las transacciones: ", error);
          setError("Hubo un problema al obtener los datos."); // Manejo de error
        }
      };
      fetchData();
    }
  }, [fechaInicio, fechaFinal]);

  return (
    <div>
      <h3>Resultados de Transacciones Filtradas</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {transacciones.length > 0 ? (
          transacciones.map((transaccion) => (
            <li key={transaccion.id}>
              {transaccion.tipo} - ${transaccion.monto} - {transaccion.fecha} - {transaccion.categoria}
            </li>
          ))
        ) : (
          <p>No se encontraron transacciones en el rango seleccionado.</p>
        )}
      </ul>
    </div>
  );
};

export default TransaccionesFiltradas;
