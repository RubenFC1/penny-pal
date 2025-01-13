import React, { useEffect, useState } from "react";
import { getTransaccionesFiltradas } from "../../api/api2";
import * as XLSX from "xlsx";

const CsvGenerator = ({ fechaInicio, fechaFinal }) => {
  const [transacciones, setTransacciones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (fechaInicio && fechaFinal) {
      const fetchData = async () => {
        try {
          const data = await getTransaccionesFiltradas(fechaInicio, fechaFinal);
          setTransacciones(data);
        } catch (error) {
          console.error("Error al filtrar las transacciones: ", error);
          setError("Hubo un problema al obtener los datos.");
        }
      };
      fetchData();
    }
  }, [fechaInicio, fechaFinal]);

  const handleExportCsv = () => {
    const transaccionesSinIds = transacciones.map(({ id, categoria_id, ...rest }) => rest); // Omitir id y categoria_id

    const worksheet = XLSX.utils.json_to_sheet(transaccionesSinIds);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    
    // Crear archivo blob
    const blob = new Blob([csvOutput], { type: "text/csv" });

    // Crear enlace de descarga
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transaccionesCSV.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <h3>Generar CSV de Transacciones Filtradas</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleExportCsv}>Exportar a CSV</button>
    </div>
  );
};

export default CsvGenerator;
