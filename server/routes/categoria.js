const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // Importa la conexión a la base de datos

// Obtener categorias
router.get('/obtenerCategoria', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
