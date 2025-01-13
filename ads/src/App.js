import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importa los componentes
import { RegistroAdeudo, GestionAdeudo, EditarAdeudo } from './components/adeudos';
import { RegistroIngreso, GestionIngreso, EditarIngreso } from './components/ingresos';
import { RegistroDeuda, GestionDeuda, EditarDeuda } from './components/deudas';
import { GestionGasto, EditarGasto, RegistroGasto } from './components/gastos';
import { GestionAhorro, EditarAhorro, RegistroAhorro } from './components/ahorros';
import { CategoriaIngresos, CategoriaGastos, CategoriaAhorros, UsoCategoriasFiltrado, TransaccionesFiltradas, General, PdfGenerator, ExcelGenerator, CsvGenerator, FechaBotones } from './components/braulio';

import { FaCog, FaDollarSign, FaChartBar } from 'react-icons/fa'; // Para iconos

function App() {
  const [visibleComponent, setVisibleComponent] = useState(""); // Estado inicial vacío
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  const handleFiltrar = (inicio, final) => {
    setFechaInicio(inicio);
    setFechaFinal(final);
    setVisibleComponent(""); // Reset visible component
  };

  // Función renderComponent
  const renderComponent = () => {
    switch (visibleComponent) {
      case "categoriaIngresos":
        return <CategoriaIngresos fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "categoriaGastos":
        return <CategoriaGastos fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "categoriaAhorros":
        return <CategoriaAhorros fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "usoCategoria":
        return <UsoCategoriasFiltrado fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "transaccionesFiltradas":
        return <TransaccionesFiltradas fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "general":
        return <General fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "generarPdf":
        return <PdfGenerator fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "generarExcel":
        return <ExcelGenerator fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      case "generarCsv":
        return <CsvGenerator fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
      default:
        return <h2>Selecciona una opción para mostrar</h2>; // Mensaje predeterminado
    }
  };

  return (
    <div className="App">
      <Router>
        <div className="layout">
          {/* Menú lateral */}
          <div className="sidebar">
            <h2>Penny pal</h2>
            <ul>
            <li>
                <Link to="/registro-adeudo">Registro de Adeudo</Link>
              </li>
              <li>
                <Link to="/gestion-adeudo">Gestión de Adeudos</Link>
              </li>
              <li>
                <Link to="/registro-ingreso">Registro de Ingreso</Link>
              </li>
              <li>
                <Link to="/gestion-ingreso">Gestión de Ingresos</Link>
              </li>
              <li>
                <Link to="/registro-gasto">Registro de Gasto</Link>
              </li>
              <li>
                <Link to="/gestion-gasto">Gestión de Gastos</Link>
              </li>
              <li>
                <Link to="/registro-ahorro">Registro de Ahorro</Link>
              </li>
              <li>
                <Link to="/gestion-ahorro">Gestión de Ahorros</Link>
              </li>
              <li>
                <Link to="/registro-deuda">Registro de Deuda</Link>
              </li>
              <li>
                <Link to="/gestion-deuda">Gestión de Deudas</Link>
              </li>
              <li>
                <Link to="/fecha-botones">Tendenias Financieras</Link>
              </li>
              {/* Más enlaces para los demás componentes */}
            </ul>
          </div>

          {/* Contenido principal */}
          <div className="content">
            <Routes>
              {/* Rutas para componentes específicos */}
              <Route path="/gestion-adeudo" element={<GestionAdeudo />} />
              <Route path="/registro-adeudo" element={<RegistroAdeudo />} />
              <Route path="/editar-adeudo/:idAdeudo" element={<EditarAdeudo />} />

              <Route path="/gestion-ingreso" element={<GestionIngreso />} />
              <Route path="/registro-ingreso" element={<RegistroIngreso />} />
              <Route path="/editar-ingreso/:idIngreso" element={<EditarIngreso />} />

              <Route path="/gestion-gasto" element={<GestionGasto />} />
              <Route path="/registro-gasto" element={<RegistroGasto />} />
              <Route path="/editar-gasto/:idGasto" element={<EditarGasto />} />

              <Route path="/gestion-ahorro" element={<GestionAhorro />} />
              <Route path="/registro-ahorro" element={<RegistroAhorro />} />
              <Route path="/editar-ahorro/:idAhorro" element={<EditarAhorro />} />

              <Route path="/gestion-deuda" element={<GestionDeuda />} />
              <Route path="/registro-deuda" element={<RegistroDeuda />} />
              <Route path="/editar-deuda/:idDeuda" element={<EditarDeuda />} />

              {/* Ruta para FechaBotones */}
              <Route path="/fecha-botones" element={<FechaBotones onFiltrar={handleFiltrar} setVisibleComponent={setVisibleComponent} />} />
            </Routes>

            {/* Componente visible dependiendo de la selección */}
            <div>{visibleComponent ? renderComponent() : <h2></h2>}</div>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
