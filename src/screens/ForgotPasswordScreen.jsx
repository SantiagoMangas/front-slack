import React from 'react'
import useForm from '../hooks/useForm'
import ENVIROMENT from '../utils/constants/enviroment'

const ForgotPasswordScreen = () => {
    const { form_state, handleChangeInput } = useForm({ email: '' })

    const handleSubmitForgotPassword = async (e) => {
        try {
            e.preventDefault()
            const response = await fetch(ENVIROMENT.API_URL + '/api/auth/forgot-password', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ENVIROMENT.API_KEY
                },
                body: JSON.stringify(form_state)
            })
            const data = await response.json()
            if (data.ok) {
                alert('Se envio el mail de verificacion')
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main className='auth-screen'>
            <form onSubmit={handleSubmitForgotPassword} className='auth-form'>
                <img src='/Slack-logo.png' alt='Logo de la app' className='logo' />

                <h1 className='title'>Restablecer contraseña</h1>
                <p className='description'>
                    Vamos a enviarte un correo electrónico con los pasos a seguir para restablecer tu contraseña.
                </p>

                <div className='input-container'>
                    <label htmlFor="email">Ingresa el mail con el que te registraste:</label>
                    <input
                        placeholder='joedoe@email.com'
                        name='email'
                        id='email'
                        onChange={handleChangeInput}
                    />
                </div>

                <button type="submit" disabled={!form_state.email}>
                    Enviar correo
                </button>
            </form>
        </main>
    )
}

export default ForgotPasswordScreen