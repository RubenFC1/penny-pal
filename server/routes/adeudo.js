const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // Importa la conexión a la base de datos

// Obtener adeudos
router.get('/obtenerAdeudos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM adeudos');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Registrar un adeudo
router.post('/registrarAdeudo', async (req, res) => {
  try {
    const { descripcion, monto, fecha_vencimiento, id_categoria, id_usuario } = req.body;
    const result = await pool.query(
      'INSERT INTO adeudos (descripcion, monto, fecha_vencimiento, id_categoria, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [descripcion, monto, fecha_vencimiento, id_categoria, id_usuario]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Obtener un adeudo por su id
router.get('/obtenerAdeudo/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL (por ejemplo, /obtenerAdeudo/1)

  try {
    // Consulta SQL para obtener el adeudo por su id
    const result = await pool.query('SELECT * FROM adeudos WHERE id_adeudo = $1', [id]);

    // Verificar si el adeudo existe
    if (result.rows.length === 0) {
      return res.status(404).send('Adeudo no encontrado');
    }

    // Devolver el adeudo encontrado
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});


// Editar un adeudo por su id
router.put('/editarAdeudo/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL (por ejemplo, /editarAdeudo/1)
  const { descripcion, monto, fecha_vencimiento, id_categoria, pagado } = req.body;

  try {
    // Verificar si el adeudo existe
    const result = await pool.query('SELECT * FROM adeudos WHERE id_adeudo = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Adeudo no encontrado');
    }

    // Actualizar el adeudo con los nuevos datos
    const updateResult = await pool.query(
      'UPDATE adeudos SET descripcion = $1, monto = $2, fecha_vencimiento = $3, id_categoria = $4, pagado = $5 WHERE id_adeudo = $6 RETURNING *',
      [descripcion, monto, fecha_vencimiento, id_categoria, pagado, id]
    );

    // Verificar si la actualización fue exitosa
    if (updateResult.rows.length === 0) {
      return res.status(400).send('Error al actualizar el adeudo');
    }

    // Devolver el adeudo actualizado
    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Borrar un adeudo por su id
router.delete('/borrarAdeudo/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL (por ejemplo, /borrarAdeudo/1)

  try {
    // Verificar si el adeudo existe antes de intentar eliminarlo
    const result = await pool.query('SELECT * FROM adeudos WHERE id_adeudo = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Adeudo no encontrado');
    }

    // Eliminar el adeudo por su id
    const deleteResult = await pool.query('DELETE FROM adeudos WHERE id_adeudo = $1 RETURNING *', [id]);

    // Verificar si la eliminación fue exitosa
    if (deleteResult.rowCount === 0) {
      return res.status(400).send('Error al eliminar el adeudo');
    }

    // Responder que el adeudo fue eliminado
    res.send('Adeudo eliminado correctamente');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});


module.exports = router;
