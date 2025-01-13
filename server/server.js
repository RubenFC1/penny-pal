const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Variables de entorno

const pool = require('./db/pool');


const usuarioRoutes = require('./routes/usuario');
const categoriaRoutes = require('./routes/categoria');
const adeudoRoutes = require('./routes/adeudo');
const deudaRoutes = require('./routes/deuda');
const ingresoRoutes = require('./routes/ingreso');
const gastoRoutes = require('./routes/gasto');
const ahorroRoutes = require('./routes/ahorro');
/*
const tarjetaRoutes = require('./routes/tarjeta');*/

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', usuarioRoutes);
app.use('/api', categoriaRoutes);
app.use('/api', adeudoRoutes);
app.use('/api', deudaRoutes);
app.use('/api', ingresoRoutes);
app.use('/api', gastoRoutes);
app.use('/api', ahorroRoutes);
/*
app.use('/api', tarjetaRoutes);*/

app.get("/categorias", async(req, res) =>{
  try {
      const result = await pool.query("SELECT * FROM categorias");
      res.json(result.rows);
  } catch (err) {
      console.error("Error al obtener los datos; ", err.message);
      res.status(500).json({error: "Ocurrio un error"});
  }
})

app.get("/transacciones", async(req, res) =>{
  try {
      const result = await pool.query("SELECT * FROM transacciones");
  
      // Formatear la fecha en formato YYYY-MM-DD antes de enviarla
      const transacciones = result.rows.map((transaccion) => ({
      ...transaccion,
      fecha: transaccion.fecha.toISOString().split("T")[0], // Solo 'YYYY-MM-DD'
      }));

      res.json(transacciones);
  } catch (err) {
      console.error("Error al obtener los datos; ", err.message);
      res.status(500).json({error: "Ocurrio un error"});
  }
})

app.get("/transaccionesFiltradas", async (req, res) => {
  try {
      const { fechaInicio, fechaFinal } = req.query;

      let query = ` SELECT t.*, c.nombre AS categoria FROM transacciones t INNER JOIN categorias c ON t.id_categoria = c.id_categoria `;
      const values = [];

      // Si hay fechas, ajustamos la consulta
      if (fechaInicio && fechaFinal) {
          query += " WHERE fecha BETWEEN $1 AND $2";
          values.push(fechaInicio, fechaFinal);
      }

      const result = await pool.query(query, values);

      // Formatear la fecha en formato YYYY-MM-DD antes de enviarla
      const transacciones = result.rows.map((transaccion) => ({
          ...transaccion,
          fecha: transaccion.fecha.toISOString().split("T")[0], // Solo 'YYYY-MM-DD'
      }));

      res.json(transacciones);
  } catch (err) {
      console.error("Error al obtener los datos; ", err.message);
      res.status(500).json({ error: "Ocurrió un error" });
  }
});

app.get("/resumenTransacciones", async (req, res) => {
  try {
      const {fechaInicio, fechaFinal} = req.query;

      if (!fechaInicio || !fechaFinal) {
          return res.status(400).json({error: "Faltan las fechas de inicio o final"});
      }

      const query = `
          SELECT tipo, SUM(monto) AS total
          FROM transacciones
          WHERE fecha BETWEEN $1 AND $2
          GROUP BY tipo
      `;

      const values = [fechaInicio, fechaFinal];
      const result = await pool.query(query, values);

      const resumen = result.rows.reduce(
          (acc, row) => {
              if(row.tipo.toLowerCase() === "gasto"){
                  acc.gastos += parseFloat(row.total);
              }else if(row.tipo.toLowerCase() === "ingreso"){
                  acc.ingresos += parseFloat(row.total);
              }else if(row.tipo.toLowerCase() === "ahorro"){
                acc.ahorros += parseFloat(row.total);
            }
              return acc;
          },
          {ingresos: 0, gastos: 0, ahorros: 0}
      );

      res.json(resumen);
  } catch (error) {
      console.error("Error al obtener el resumen de transacciones:", err.message);
      res.status(500).json({ error: "Ocurrió un error" });
  }
})

app.get("/gastosPorCategoria", async (req, res) => {
  try {
      const { fechaInicio, fechaFinal } = req.query;

      let query = `
          SELECT c.nombre AS categoria, SUM(t.monto) AS total
          FROM transacciones t
          INNER JOIN categorias c ON t.id_categoria = c.id_categoria
          WHERE t.tipo = 'gasto'
      `;

      const values = [];

      if (fechaInicio && fechaFinal) {
          query += " AND t.fecha BETWEEN $1 AND $2";
          values.push(fechaInicio, fechaFinal);
      }

      query += " GROUP BY c.nombre ORDER BY total DESC;";

      const result = await pool.query(query, values);
      res.json(result.rows);
  } catch (err) {
      console.error("Error al obtener los gastos por categoría: ", err.message);
      res.status(500).json({ error: "Ocurrió un error" });
  }
});

app.get("/ingresosPorCategoria", async (req, res) => {
  try {
      const { fechaInicio, fechaFinal } = req.query;

      let query = `
          SELECT c.nombre AS categoria, SUM(t.monto) AS total
          FROM transacciones t
          INNER JOIN categorias c ON t.id_categoria = c.id_categoria
          WHERE t.tipo = 'ingreso'
      `;

      const values = [];

      if (fechaInicio && fechaFinal) {
          query += " AND t.fecha BETWEEN $1 AND $2";
          values.push(fechaInicio, fechaFinal);
      }

      query += " GROUP BY c.nombre ORDER BY total DESC;";

      const result = await pool.query(query, values);
      res.json(result.rows);
  } catch (err) {
      console.error("Error al obtener los ingresos por categoría: ", err.message);
      res.status(500).json({ error: "Ocurrió un error" });
  }
});

app.get("/usoCategoriasFiltrado", async (req, res) => {
  try {
      const { fechaInicio, fechaFinal } = req.query;
      const query = `
          SELECT c.nombre AS categoria, COUNT(t.id) AS cantidad
          FROM transacciones t
          INNER JOIN categorias c ON t.id_categoria = c.id_categoria
          WHERE t.fecha BETWEEN $1 AND $2
          GROUP BY c.nombre
          ORDER BY cantidad DESC;
      `;

      const result = await pool.query(query, [fechaInicio, fechaFinal]);
      res.json(result.rows);
  } catch (err) {
      console.error("Error al obtener el uso de categorías filtrado: ", err.message);
      res.status(500).json({ error: "Ocurrió un error al obtener los datos" });
  }
});

app.get("/ahorrosPorCategoria", async (req, res) => {
    try {
        const { fechaInicio, fechaFinal } = req.query;

        let query = `
            SELECT c.nombre AS categoria, SUM(t.monto) AS total
            FROM transacciones t
            INNER JOIN categorias c ON t.id_categoria = c.id_categoria
            WHERE t.tipo = 'ahorro'
        `;

        const values = [];

        if (fechaInicio && fechaFinal) {
            query += " AND t.fecha BETWEEN $1 AND $2";
            values.push(fechaInicio, fechaFinal);
        }

        query += " GROUP BY c.nombre ORDER BY total DESC;";

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener los ahorros por categoría: ", err.message);
        res.status(500).json({ error: "Ocurrió un error" });
    }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

