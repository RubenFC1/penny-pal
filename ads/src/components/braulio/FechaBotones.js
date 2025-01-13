import React, { useState } from "react";

const FechaBotones = ({ onFiltrar, setVisibleComponent }) => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [error, setError] = useState(null);
  const [validado, setValidado] = useState(false);

  const handleFiltrar = () => {
    if (!fechaInicio || !fechaFinal) {
      setError("Por favor, selecciona ambas fechas.");
      setValidado(false);
      return;
    }

    if (new Date(fechaFinal) < new Date(fechaInicio)) {
      setError("La fecha final no puede ser anterior a la fecha de inicio.");
      setValidado(false);
      return;
    }

    setError(null);
    setValidado(true);
    onFiltrar(fechaInicio, fechaFinal);
  };

  return (
    <div>
      <label>
        Fecha de Inicio:
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
      </label>
      <label>
        Fecha Final:
        <input
          type="date"
          value={fechaFinal}
          onChange={(e) => setFechaFinal(e.target.value)}
        />
      </label>
      <button onClick={handleFiltrar}>Filtrar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <button onClick={() => setVisibleComponent("categoriaIngresos")} disabled={!validado}>
          Ver Ingresos por Categoría
        </button>
        <button onClick={() => setVisibleComponent("categoriaGastos")} disabled={!validado}>
          Ver Gastos por Categoría
        </button>
        <button onClick={() => setVisibleComponent("categoriaAhorros")} disabled={!validado}>
          Ver Ahorros por Categoría
        </button>
        <button onClick={() => setVisibleComponent("usoCategoria")} disabled={!validado}>
          Ver Uso de Categorías
        </button>
        <button onClick={() => setVisibleComponent("transaccionesFiltradas")} disabled={!validado}>
          Ver Transacciones Filtradas
        </button>
        <button onClick={() => setVisibleComponent("general")} disabled={!validado}>
          Ver Comparativa de Gastos vs Ingresos vs Ahorros
        </button>
        <button onClick={() => setVisibleComponent("generarPdf")} disabled={!validado}>
          Generar PDF
        </button>
        <button onClick={() => setVisibleComponent("generarExcel")} disabled={!validado}>
          Exportar a Excel
        </button>
        <button onClick={() => setVisibleComponent("generarCsv")} disabled={!validado}>
          Exportar a CSV
        </button>
      </div>
    </div>
  );
};

export default FechaBotones;