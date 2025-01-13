const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // Importa la conexión a la base de datos

// Obtener gastos
router.get('/obtenerGastos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gastos');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Registrar un gasto
router.post('/registrarGasto', async (req, res) => {
  const client = await pool.connect();
  try {
    const { descripcion, monto, fecha_gasto, id_categoria, id_usuario } = req.body;

    await client.query('BEGIN');

    // 1. Registrar el gasto
    const resultGasto = await client.query(
      'INSERT INTO gastos (descripcion, monto, fecha_gasto, id_categoria, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING id_gasto',
      [descripcion, monto, fecha_gasto, id_categoria, id_usuario]
    );
    
    // 2. Registrar la transacción correspondiente
    const resultTransaccion = await client.query(
      'INSERT INTO transacciones (tipo, id_categoria, monto, fecha, id_gasto) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      ['gasto', id_categoria, monto, fecha_gasto, resultGasto.rows[0].id_gasto]
    );

    await client.query('COMMIT');
    res.json({
      gasto: resultGasto.rows[0],
      transaccion: resultTransaccion.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  } finally {
    client.release();
  }
});

// Obtener un gasto por su id
router.get('/obtenerGasto/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL (por ejemplo, /obtenerGasto/1)

  try {
    // Consulta SQL para obtener el gasto por su id
    const result = await pool.query('SELECT * FROM gastos WHERE id_gasto = $1', [id]);

    // Verificar si el gasto existe
    if (result.rows.length === 0) {
      return res.status(404).send('Gasto no encontrado');
    }

    // Devolver el gasto encontrado
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Editar un gasto por su id
router.put('/editarGasto/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL (por ejemplo, /editarGasto/1)
  const { descripcion, monto, fecha_gasto, id_categoria } = req.body;

  const client = await pool.connect(); // Usamos un cliente para manejar la transacción
  try {
    await client.query('BEGIN'); // Iniciamos la transacción

    // Verificar si el gasto existe
    const result = await client.query('SELECT * FROM gastos WHERE id_gasto = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Gasto no encontrado');
    }

    // Actualizar el gasto con los nuevos datos
    const updateResult = await client.query(
      'UPDATE gastos SET descripcion = $1, monto = $2, fecha_gasto = $3, id_categoria = $4 WHERE id_gasto = $5 RETURNING *',
      [descripcion, monto, fecha_gasto, id_categoria, id]
    );

    // Verificar si la actualización fue exitosa
    if (updateResult.rows.length === 0) {
      return res.status(400).send('Error al actualizar el gasto');
    }

    // Actualizar la transacción relacionada
    const updateTransaccion = await client.query(
      'UPDATE transacciones SET monto = $1, fecha = $2 WHERE id_gasto = $3 RETURNING *',
      [monto, fecha_gasto, id]
    );

    // Si no se encontró la transacción relacionada
    if (updateTransaccion.rows.length === 0) {
      return res.status(404).send('Transacción asociada no encontrada');
    }

    await client.query('COMMIT'); // Confirmamos la transacción

    // Devolver el gasto y la transacción actualizados
    res.json({
      gasto: updateResult.rows[0],
      transaccion: updateTransaccion.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK'); // Revertimos ambos cambios si hay algún error
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  } finally {
    client.release(); // Liberamos la conexión
  }
});


// Borrar un gasto
router.delete('/borrarGasto/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    // 1. Eliminar las transacciones asociadas con el gasto
    await client.query(
      'DELETE FROM transacciones WHERE id_gasto = $1',
      [id]
    );

    // 2. Eliminar el gasto
    await client.query(
      'DELETE FROM gastos WHERE id_gasto = $1',
      [id]
    );

    await client.query('COMMIT');
    res.send('Gasto y transacciones eliminados exitosamente');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  } finally {
    client.release();
  }
});

module.exports = router;
