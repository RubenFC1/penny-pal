import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/register', { nombre, correo, contraseña });
      setMensaje('Usuario registrado exitosamente');
    } catch (error) {
      setMensaje('Error al registrar el usuario');
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Correo:</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
      <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
    </div>
  );
}

export default Register;