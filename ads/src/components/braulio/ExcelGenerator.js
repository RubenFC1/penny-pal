import React, { useEffect, useState } from "react";
import { getTransaccionesFiltradas } from "../../api/api2";
import * as XLSX from "xlsx";

const ExcelGenerator = ({ fechaInicio, fechaFinal }) => {
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

  const handleExportExcel = () => {
    const transaccionesSinIds = transacciones.map(({ id, categoria_id, ...rest }) => rest); // Omitir id y categoria_id

    const worksheet = XLSX.utils.json_to_sheet(transaccionesSinIds);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transacciones");

    // Generar buffer
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    
    // Crear archivo blob
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Crear enlace de descarga
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transaccionesExcel.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <h3>Generar Excel de Transacciones Filtradas</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleExportExcel}>Exportar a Excel</button>
    </div>
  );
};

export default ExcelGenerator;
