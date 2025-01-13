import React, { useEffect, useState } from "react";
import { getTransacciones } from "../../api/api2";

const Transacciones = () => {
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    const fetchTransacciones = async () => {
      try {
        const data = await getTransacciones();
        setTransacciones(data);
      } catch (error) {
        console.error("Error cargando transacciones:", error);
      }
    };

    fetchTransacciones();
  }, []);

  return (
    <div>
      <h1>Transacciones</h1>
      <ul>
        {transacciones.map((transaccion) => (
          <li key={transaccion.id}>
            {transaccion.tipo} - ${transaccion.monto} - {transaccion.fecha}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transacciones;
