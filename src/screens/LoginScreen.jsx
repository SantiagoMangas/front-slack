import React, { useState, useContext } from 'react';
import useForm from '../hooks/useForm';
import ENVIROMENT from '../utils/constants/enviroment';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import '../styles/auth.css';
import useValidation from '../hooks/useValidation';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginScreen = () => {
  const { login, isAuthenticatedState } = useContext(AuthContext);
  console.log('Authenticated:', isAuthenticatedState);
  const navigate = useNavigate();
  const { form_state, handleChangeInput } = useForm({ email: '', password: '' });

  const { errors, validate } = useValidation(form_state);
  
  const url = new URLSearchParams(window.location.search);
  if (url.get('verified')) {
    alert('Cuenta verificada');
  }

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const validationErrors = validate();

    // Si hay errores de validación, no enviar formulario
    if (Object.values(validationErrors).some((err) => err.length > 0)) {
      return;
    }

    try {
      const response = await fetch(ENVIROMENT.API_URL + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ENVIROMENT.API_KEY,
        },
        body: JSON.stringify(form_state),
      });

      const data = await response.json();

      login(data.data.access_token);
      navigate('/home');
    } catch (error) {
      console.error('Error al loguear', error);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="auth-screen">
      <form onSubmit={handleSubmitForm} className="auth-form">
        <h1 className="title">Login</h1>
  
        <div className="input-container">
          <label htmlFor="email">Ingresa tu email:</label>
          <div className="input-with-icon">
            <FaEnvelope className="input-icon" />
            <input
              name="email"
              id="email"
              placeholder="ejemplo@dominio.com"
              value={form_state.email}
              onChange={handleChangeInput}
              required
            />
          </div>
          {errors.email.map((error, index) => (
            <p key={index} className="error">
              {error}
            </p>
          ))}
        </div>
  
        <div className="input-container">
          <label htmlFor="password">Ingresa tu contraseña:</label>
          <div className="input-with-icon">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              value={form_state.password}
              onChange={handleChangeInput}
              required
            />
            <button type="button" className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password.map((error, index) => (
            <p key={index} className="error">
              {error}
            </p>
          ))}
        </div>
  
        <button
          type="submit"
          disabled={
            errors.email.length ||
            errors.password.length ||
            !form_state.email ||
            !form_state.password
          }
        >
          Iniciar sesión
        </button>
  
        <span>
          Aún no tienes cuenta? <Link to={'/register'}>Regístrate</Link>
        </span>
        <Link to={'/forgot-password'}>Olvidé mi contraseña</Link>
      </form>
    </main>
  );
};

export default LoginScreen;