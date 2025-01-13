import React, { useState, useEffect } from "react";
import { getResumenTransacciones } from "../../api/api2";
import { Pie } from "react-chartjs-2";
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

ChartJS.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale, ChartDataLabels);

const General = ({ fechaInicio, fechaFinal }) => {
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (fechaInicio && fechaFinal) {
      const fetchData = async () => {
        try {
          const data = await getResumenTransacciones(fechaInicio, fechaFinal);
          setResumen(data);
        } catch (error) {
          console.error("Error al obtener el resumen de transacciones: ", error);
          setError("Error al obtener los datos.");
        }
      };
      fetchData();
    }
  }, [fechaInicio, fechaFinal]);

  return (
    <div>
      <h3>Comparativa de Gastos, Ingresos y Ahorros</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {resumen ? (
        <Pie
          data={{
            labels: ["Gastos", "Ingresos", "Ahorros"],
            datasets: [
              {
                data: [resumen.gastos, resumen.ingresos, resumen.ahorros],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Comparativa de Gastos, Ingresos y Ahorros",
              },
              datalabels: {
                display: true,
                color: "#fff",
                formatter: (value) => {
                  return `$${value.toFixed(2)}`;
                },
                font: {
                  weight: "bold",
                },
              },
            },
          }}
        />
      ) : (
        <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default General;