import React, { useState, useEffect } from 'react';
import useForm from '../hooks/useForm';
import ENVIROMENT from '../utils/constants/enviroment';
import '../styles/auth.css';
import { MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md';

const RegisterScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false); // Inicializa el estado para la visibilidad de la contraseña
  const { form_state, handleChangeInput } = useForm({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({ username: [], email: [], password: [] });

  // Función de validación
  const validateFields = () => {
    let newErrors = { username: [], email: [], password: [] };

    // Validación de username
    if (form_state.username.length > 30) newErrors.username.push("El límite de caracteres es 30");
    if (form_state.username.length < 5) newErrors.username.push("El mínimo de caracteres es 5");

    // Validación de email
    if (form_state.email.length > 30) newErrors.email.push("El límite de caracteres es 30");
    if (form_state.email.length < 5) newErrors.email.push("El mínimo de caracteres es 5");

    // Validación de password
    if (form_state.password.length > 30) newErrors.password.push("El máximo de caracteres es 30");
    if (form_state.password.length < 5) newErrors.password.push("El mínimo de caracteres es 5");

    setErrors(newErrors);
  };

  // Llamamos a la validación cada vez que cambia el estado del formulario
  useEffect(() => {
    validateFields();
  }, [form_state]);

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(ENVIROMENT.API_URL + "/api/auth/register", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ENVIROMENT.API_KEY
        },
        body: JSON.stringify(form_state)
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error al crear usuario", error);
    }
  };

  return (
    <main className='auth-screen'>
      <form className='auth-form' onSubmit={handleSubmitForm}>
        <img src='/Slack-logo.png' alt='Logo de la app' className='logo' />

        <h1 className='title'>Registro</h1>

        <div className='input-container'>
          <label htmlFor='username'>
            Ingresa tu nombre de usuario:
          </label>
          <div className="input-icon-container">
			<MdPerson className="icon icon-left" size={20} />
			<input
			name='username'
			id='username'
			placeholder='Tu nombre de usuario'
			value={form_state.username}
			onChange={handleChangeInput}
			/>
			</div>
		{errors.username.length > 0 && <p className="error-text">{errors.username[0]}</p>}
        </div>

        <div className="input-container">
          <label htmlFor="email">Correo electrónico</label>
          <div className="input-icon-container">
            <MdEmail className="icon icon-left" size={20} />
            <input
              name="email"
              id="email"
              type="email"
              placeholder="ejemplo@email.com"
              value={form_state.email}
              onChange={handleChangeInput}
            />
          </div>
          {errors.email.length > 0 && <p className="error-text">{errors.email[0]}</p>}
        </div>

        <div className="input-container">
          <label htmlFor="password">Contraseña</label>
          <div className="input-icon-container">
            <MdLock className="icon icon-left" size={20} />
            <input
              name="password"
              id="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="********"
              value={form_state.password}
              onChange={handleChangeInput}
            />
            <span onClick={() => setPasswordVisible(!passwordVisible)} className="icon icon-right">
              {passwordVisible ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </span>
          </div>
          {errors.password.length > 0 && <p className="error-text">{errors.password[0]}</p>}
        </div>

        <button type="submit" disabled={!form_state.username || !form_state.email || !form_state.password || errors.username.length || errors.email.length || errors.password.length}>
          Crear cuenta
        </button>
      </form>
    </main>
  );
};

export default RegisterScreen;