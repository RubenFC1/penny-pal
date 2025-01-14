import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/login', { correo, contraseña });
      localStorage.setItem('token', response.data.token);
      onLogin();
      navigate('/gestion-adeudo'); // Redirigir al usuario después de iniciar sesión
    } catch (error) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Correo:</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Iniciar Sesión</button>
      </form>
      <p>¿Aún no estás registrado? <Link to="/register">Regístrate aquí</Link></p>
    </div>
  );
}

export default Login;