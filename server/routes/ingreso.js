const express = require('express');
const router = express.Router();
const pool = require('../db/pool'); // Importa la conexión a la base de datos

// Obtener ingresos
router.get('/obtenerIngresos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ingresos');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Registrar un ingreso
router.post('/registrarIngreso', async (req, res) => {
  const client = await pool.connect();
  try {
    const { descripcion, monto, fecha_ingreso, id_categoria, id_usuario } = req.body;
    
    await client.query('BEGIN');

    // 1. Registrar el ingreso
    const resultIngreso = await client.query(
      'INSERT INTO ingresos (descripcion, monto, fecha_ingreso, id_categoria, id_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING id_ingreso',
      [descripcion, monto, fecha_ingreso, id_categoria, id_usuario]
    );
    
    // 2. Registrar la transacción correspondiente
    const resultTransaccion = await client.query(
      'INSERT INTO transacciones (tipo, id_categoria, monto, fecha, id_ingreso) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      ['ingreso', id_categoria, monto, fecha_ingreso, resultIngreso.rows[0].id_ingreso]
    );

    await client.query('COMMIT');
    res.json({
      ingreso: resultIngreso.rows[0],
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


// Obtener un ingreso por su id
router.get('/obtenerIngreso/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL (por ejemplo, /obtenerIngreso/1)

  try {
    // Consulta SQL para obtener el ingreso por su id
    const result = await pool.query('SELECT * FROM ingresos WHERE id_ingreso = $1', [id]);

    // Verificar si el ingreso existe
    if (result.rows.length === 0) {
      return res.status(404).send('Ingreso no encontrado');
    }

    // Devolver el ingreso encontrado
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

// Editar un ingreso por su id
router.put('/editarIngreso/:id', async (req, res) => {
  const { id } = req.params; // Obtener el id desde la URL (por ejemplo, /editarIngreso/1)
  const { descripcion, monto, fecha_ingreso, id_categoria } = req.body;

  const client = await pool.connect(); // Usamos un cliente para manejar la transacción
  try {
    await client.query('BEGIN'); // Iniciamos la transacción

    // Verificar si el ingreso existe
    const result = await client.query('SELECT * FROM ingresos WHERE id_ingreso = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Ingreso no encontrado');
    }

    // Actualizar el ingreso con los nuevos datos
    const updateResult = await client.query(
      'UPDATE ingresos SET descripcion = $1, monto = $2, fecha_ingreso = $3, id_categoria = $4 WHERE id_ingreso = $5 RETURNING *',
      [descripcion, monto, fecha_ingreso, id_categoria, id]
    );

    // Verificar si la actualización fue exitosa
    if (updateResult.rows.length === 0) {
      return res.status(400).send('Error al actualizar el ingreso');
    }

    // Actualizar la transacción relacionada
    const updateTransaccion = await client.query(
      'UPDATE transacciones SET monto = $1, fecha = $2 WHERE id_ingreso = $3 RETURNING *',
      [monto, fecha_ingreso, id]
    );

    // Si no se encontró la transacción relacionada
    if (updateTransaccion.rows.length === 0) {
      return res.status(404).send('Transacción asociada no encontrada');
    }

    await client.query('COMMIT'); // Confirmamos la transacción

    // Devolver el ingreso y la transacción actualizados
    res.json({
      ingreso: updateResult.rows[0],
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


// Borrar un ingreso
router.delete('/borrarIngreso/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');

    // 1. Eliminar las transacciones asociadas con el ingreso
    await client.query(
      'DELETE FROM transacciones WHERE id_ingreso = $1',
      [id]
    );

    // 2. Eliminar el ingreso
    await client.query(
      'DELETE FROM ingresos WHERE id_ingreso = $1',
      [id]
    );

    await client.query('COMMIT');
    res.send('Ingreso y transacciones eliminados exitosamente');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  } finally {
    client.release();
  }
});

module.exports = router;
