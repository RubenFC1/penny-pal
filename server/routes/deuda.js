const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // Importa la conexión a la base de datos

// Obtener deudas
router.get('/obtenerDeudas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM deudas');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Registrar una deuda
router.post('/registrarDeuda', async (req, res) => {
  try {
    const { descripcion, monto, fecha_vencimiento, id_categoria, id_usuario, entidad_acreedora } = req.body;
    const result = await pool.query(
      'INSERT INTO deudas (descripcion, monto, fecha_vencimiento, id_categoria, id_usuario, entidad_acreedora) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [descripcion, monto, fecha_vencimiento, id_categoria, id_usuario, entidad_acreedora]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Obtener una deuda por su id
router.get('/obtenerDeuda/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL (por ejemplo, /obtenerDeuda/1)

  try {
    // Consulta SQL para obtener la deuda por su id
    const result = await pool.query('SELECT * FROM deudas WHERE id_deuda = $1', [id]);

    // Verificar si la deuda existe
    if (result.rows.length === 0) {
      return res.status(404).send('Deuda no encontrada');
    }

    // Devolver la deuda encontrada
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Editar una deuda por su id
router.put('/editarDeuda/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL (por ejemplo, /editarDeuda/1)
  const { descripcion, monto, fecha_vencimiento, id_categoria, pagado, entidad_acreedora } = req.body;

  try {
    // Verificar si la deuda existe
    const result = await pool.query('SELECT * FROM deudas WHERE id_deuda = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Deuda no encontrada');
    }

    // Actualizar la deuda con los nuevos datos
    const updateResult = await pool.query(
      'UPDATE deudas SET descripcion = $1, monto = $2, fecha_vencimiento = $3, id_categoria = $4, pagado = $5, entidad_acreedora = $6 WHERE id_deuda = $7 RETURNING *',
      [descripcion, monto, fecha_vencimiento, id_categoria, pagado, entidad_acreedora, id]
    );

    // Verificar si la actualización fue exitosa
    if (updateResult.rows.length === 0) {
      return res.status(400).send('Error al actualizar la deuda');
    }

    // Devolver la deuda actualizada
    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Borrar una deuda por su id
router.delete('/borrarDeuda/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL (por ejemplo, /borrarDeuda/1)

  try {
    // Verificar si la deuda existe antes de intentar eliminarla
    const result = await pool.query('SELECT * FROM deudas WHERE id_deuda = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Deuda no encontrada');
    }

    // Eliminar la deuda por su id
    const deleteResult = await pool.query('DELETE FROM deudas WHERE id_deuda = $1 RETURNING *', [id]);

    // Verificar si la eliminación fue exitosa
    if (deleteResult.rowCount === 0) {
      return res.status(400).send('Error al eliminar la deuda');
    }

    // Responder que la deuda fue eliminada
    res.send('Deuda eliminada correctamente');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
