import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { getUsoCategoriasFiltrado } from "../../api/api2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const UsoCategoriasFiltrado = ({ fechaInicio, fechaFinal }) => {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (fechaInicio && fechaFinal) {
      const fetchData = async () => {
        try {
          const resultado = await getUsoCategoriasFiltrado(fechaInicio, fechaFinal);
          if (resultado.length === 0) {
            setError("No hay datos para el rango de fechas seleccionado.");
          } else {
            setDatos(resultado);
            setError("");
          }
        } catch (error) {
          setError("Error al obtener los datos.");
        }
      };
      fetchData();
    }
  }, [fechaInicio, fechaFinal]);

  const chartData = {
    labels: datos.map((d) => d.categoria),
    datasets: [
      {
        label: "Cantidad de usos",
        data: datos.map((d) => d.cantidad),
        backgroundColor: "#36A2EB",
        borderColor: "#1E88E5",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Uso de Categorías por Fecha" },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Cantidad de Usos" },
      },
      x: {
        title: { display: true, text: "Categorías" },
      },
    },
  };

  return (
    <div>
      <h3>Uso de Categorías</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {datos.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p>No hay datos para mostrar.</p>
      )}
    </div>
  );
};

export default UsoCategoriasFiltrado;
