const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // Importa la conexión a la base de datos

// Obtener usuarios
router.get('/obtenerUsuario', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Crear un usuario
router.post('/insertarUsuario', async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contraseña) VALUES ($1, $2, $3) RETURNING *',
      [nombre, correo, contraseña]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
