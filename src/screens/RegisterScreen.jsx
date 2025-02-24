import React from 'react';
import useForm from '../hooks/useForm';
import ENVIROMENT from '../utils/constants/enviroment';
import '../styles/auth.css';
import { MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md'

const RegisterScreen = () => {
	const [passwordVisible, setPasswordVisible] = useState(false); // Inicializa el estado para la visibilidad de la contraseña
    const { form_state, handleChangeInput } = useForm({ username: "", email: "", password: "" });

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
    }

    const errores = {
        username: [],
        email: [],
        password: []
    }

    // Validaciones
    form_state.email && form_state.email.length > 30 && errores.email.push("El límite de caracteres es 30");
    form_state.email && form_state.email.length < 5 && errores.email.push("El mínimo de caracteres es 5");

    form_state.password && form_state.password.length > 30 && errores.password.push("El máximo de caracteres es 30");
    form_state.password && form_state.password.length < 5 && errores.password.push("El mínimo de caracteres es 5");

    form_state.username && form_state.username.length > 30 && errores.username.push("El límite de caracteres es 30");
    form_state.username && form_state.username.length < 5 && errores.username.push("El mínimo de caracteres es 5");

	return (
		<main className='auth-screen'>
		  <form className='auth-form' onSubmit={handleSubmitForm}>
			<img src='../public/Slack-logo.png' alt='Logo de la app' className='logo' />
	
			<h1 className='title'>Registro</h1>
	
			<div className='input-container'>
			  <label htmlFor='username'>
				<MdPerson size={20} style={{ marginRight: '0.5rem' }} /> 
				Ingresa tu nombre de usuario:
			  </label>
			  <input
				name='username'
				id='username'
				placeholder='Tu nombre de usuario'
				value={form_state.username}
				onChange={handleChangeInput}
			  />
			</div>
	
			<div className='input-container'>
			  <label htmlFor='email'>
				<MdEmail size={20} style={{ marginRight: '0.5rem' }} /> 
				Ingresa tu correo:
			  </label>
			  <input
				name='email'
				id='email'
				placeholder='ejemplo@email.com'
				value={form_state.email}
				onChange={handleChangeInput}
			  />
			</div>
	
			<div className='input-container'>
			  <label htmlFor='password'>
				<MdLock size={20} style={{ marginRight: '0.5rem' }} /> 
				Ingresa tu contraseña:
			  </label>
			  <input
				name='password'
				id='password'
				type={passwordVisible ? 'text' : 'password'}
				placeholder='********'
				value={form_state.password}
				onChange={handleChangeInput}
			  />
			  <span
				style={{ position: 'absolute', right: '10px', top: '50%' }}
				onClick={() => setPasswordVisible(!passwordVisible)}
			  >
				{passwordVisible ? (
				  <MdVisibilityOff size={20} />
				) : (
				  <MdVisibility size={20} />
				)}
			  </span>
			</div>
	
			<button type='submit' disabled={!form_state.username || !form_state.email || !form_state.password}>
			  Crear cuenta
			</button>
		  </form>
		</main>
	  )
	}
	
	export default RegisterScreen