const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // Importa la conexión a la base de datos

// Obtener ahorros
router.get('/obtenerAhorros', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ahorros');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Registrar un ahorro
router.post('/registrarAhorro', async (req, res) => {
  const client = await pool.connect();
  try {
    const { descripcion, monto, fecha_ahorro, id_categoria, id_usuario } = req.body;
    
    await client.query('BEGIN');

    // 1. Registrar el ahorro
    const resultAhorro = await client.query(
      'INSERT INTO ahorros (descripcion, monto, fecha_ahorro, id_categoria, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING id_ahorro',
      [descripcion, monto, fecha_ahorro, id_categoria, id_usuario]
    );
    
    // 2. Registrar la transacción correspondiente
    const resultTransaccion = await client.query(
      'INSERT INTO transacciones (tipo, id_categoria, monto, fecha, id_ahorro) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      ['ahorro', id_categoria, monto, fecha_ahorro, resultAhorro.rows[0].id_ahorro]
    );

    await client.query('COMMIT');
    res.json({
      ahorro: resultAhorro.rows[0],
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

// Obtener un ahorro por su id
router.get('/obtenerAhorro/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL (por ejemplo, /obtenerAhorro/1)

  try {
    // Consulta SQL para obtener el ahorro por su id
    const result = await pool.query('SELECT * FROM ahorros WHERE id_ahorro = $1', [id]);

    // Verificar si el ahorro existe
    if (result.rows.length === 0) {
      return res.status(404).send('Ahorro no encontrado');
    }

    // Devolver el ahorro encontrado
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Editar un ahorro por su id
router.put('/editarAhorro/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL (por ejemplo, /editarAhorro/1)
  const { descripcion, monto, fecha_ahorro, id_categoria } = req.body;

  const client = await pool.connect(); // Usamos un cliente para manejar la transacción
  try {
    await client.query('BEGIN'); // Iniciamos la transacción

    // Verificar si el ahorro existe
    const result = await client.query('SELECT * FROM ahorros WHERE id_ahorro = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Ahorro no encontrado');
    }

    // Actualizar el ahorro con los nuevos datos
    const updateResult = await client.query(
      'UPDATE ahorros SET descripcion = $1, monto = $2, fecha_ahorro = $3, id_categoria = $4 WHERE id_ahorro = $5 RETURNING *',
      [descripcion, monto, fecha_ahorro, id_categoria, id]
    );

    // Verificar si la actualización fue exitosa
    if (updateResult.rows.length === 0) {
      return res.status(400).send('Error al actualizar el ahorro');
    }

    // Actualizar la transacción relacionada
    const updateTransaccion = await client.query(
      'UPDATE transacciones SET monto = $1, fecha = $2 WHERE id_ahorro = $3 RETURNING *',
      [monto, fecha_ahorro, id]
    );

    // Si no se encontró la transacción relacionada
    if (updateTransaccion.rows.length === 0) {
      return res.status(404).send('Transacción asociada no encontrada');
    }

    await client.query('COMMIT'); // Confirmamos la transacción

    // Devolver el ahorro y la transacción actualizados
    res.json({
      ahorro: updateResult.rows[0],
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

// Borrar un ahorro
router.delete('/borrarAhorro/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    // 1. Eliminar las transacciones asociadas con el ahorro
    await client.query(
      'DELETE FROM transacciones WHERE id_ahorro = $1',
      [id]
    );

    // 2. Eliminar el ahorro
    await client.query(
      'DELETE FROM ahorros WHERE id_ahorro = $1',
      [id]
    );

    await client.query('COMMIT');
    res.send('Ahorro y transacciones eliminados exitosamente');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  } finally {
    client.release();
  }
});

module.exports = router;
