import React, { useState, useContext, useEffect } from 'react';
import useForm from '../hooks/useForm';
import useValidation from '../hooks/useValidation';
import ENVIROMENT from '../utils/constants/enviroment';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import '../styles/auth.css';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md'


const LoginScreen = () => {
    const { login, isAuthenticatedState } = useContext(AuthContext);
    const navigate = useNavigate();
    const { form_state, handleChangeInput } = useForm({ email: '', password: '' });
    const { errors, validate } = useValidation(form_state);
    const [passwordVisible, setPasswordVisible] = useState(false); // Inicializa el estado para la visibilidad de la contraseña


    // Aquí agregamos un estado para manejar los errores globales.
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        validate(); // Valida en tiempo real cuando cambia el formulario
    }, [form_state]);

    const handleSubmitForm = async (event) => {
        event.preventDefault();

        if (errors.email.length || errors.password.length) return; // Evita enviar si hay errores

        try {
            const response = await fetch(`${ENVIROMENT.API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'x-api-key': ENVIROMENT.API_KEY
                },
                body: JSON.stringify(form_state)
            });

            const data = await response.json();
            if (!response.ok) {
                // Manejar errores del servidor
                setErrorMessage(data.message || 'Error desconocido');
                return;
            }

            login(data.data.access_token);
            navigate('/home');
        } catch (error) {
            setErrorMessage('Hubo un error al iniciar sesión. Intenta nuevamente.');
            console.error("Error al iniciar sesión", error);
        }
    };

    return (
        <main className='auth-screen'>
          <form className='auth-form' onSubmit={handleSubmitForm}>
            <img src='../public/Slack-logo.png' alt='Logo de la app' className='logo' />
    
            <h1 className='title'>Iniciar sesión</h1>
    
            <div className="input-container">
                <label htmlFor="email">
                    Ingresa tu correo:
                </label>
                <div className="input-icon-container">
                    <MdEmail
                        size={20}
                        style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#fff' // Asegúrate de que el ícono sea blanco
                    }}
                    />
                    <input
                        name="email"
                        id="email"
                        placeholder="ejemplo@email.com"
                        value={form_state.email}
                        onChange={handleChangeInput}
                    />
                </div>
            </div>

    
            <div className="input-container">
                <label htmlFor="password">
                    Ingresa tu contraseña:
                </label>
                <div className="input-icon-container">
                    <MdLock
                    size={20}
                    style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#fff'
                    }}
                    />
                    <input
                    name="password"
                    id="password"
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="********"
                    value={form_state.password}
                    onChange={handleChangeInput}
                    />
                    <span
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                    {passwordVisible ? (
                        <MdVisibilityOff size={20} color="#fff" />
                    ) : (
                        <MdVisibility size={20} color="#fff" />
                    )}
                    </span>
                </div>
            </div>
    
            <button type='submit' disabled={!form_state.email || !form_state.password}>
              Iniciar sesión
            </button>
          </form>
        </main>
      )
    }
    
export default LoginScreen