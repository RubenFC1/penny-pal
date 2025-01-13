import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { getIngresosPorCategoria } from "../../api/api2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Registrar todos los elementos de Chart.js necesarios
ChartJS.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale, ChartDataLabels);

const CategoriaIngresos = ({ fechaInicio, fechaFinal }) => {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (fechaInicio && fechaFinal) {
      const fetchData = async () => {
        try {
          const ingresos = await getIngresosPorCategoria(fechaInicio, fechaFinal);
          setDatos(ingresos);
        } catch (error) {
          console.error("Error al obtener los datos de ingresos: ", error);
          setError("Hubo un problema al obtener los datos.");
        }
      };
      fetchData();
    }
  }, [fechaInicio, fechaFinal]);

  const chartData = {
    labels: datos ? datos.map((d) => d.categoria) : [],
    datasets: [
      {
        data: datos ? datos.map((d) => d.total) : [],
        backgroundColor: [
          "#4BC0C0", "#36A2EB", "#FF9F40", "#9966FF", "#FF6384", "#FFCE56",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ingresos por Categoría",
      },
      datalabels: {
        display: true,
        color: "#fff",
        formatter: (value) => {
          if (typeof value === "number" && !isNaN(value)) {
            return `$${value.toFixed(2)}`;
          }
          return value;
        },
        font: {
          weight: "bold",
        },
      },
    },
  };

  return (
    <div>
      <h3>Ingresos por Categoría</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {datos ? (
        <Pie
          data={chartData}
          options={chartOptions}
          ref={(chartRef) => {
            if (chartRef && chartRef.chart) {
              if (chartInstance) {
                chartInstance.destroy();
              }
              setChartInstance(chartRef.chart);
            }
          }}
        />
      ) : (
        <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default CategoriaIngresos;
