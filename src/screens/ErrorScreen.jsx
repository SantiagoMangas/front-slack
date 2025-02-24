import React from 'react'
import RequestEmailForm from '../Components/RequestEmailForm'

const ErrorScreen = () => {
    const url = new URLSearchParams(window.location.search)
    const error = url.get('error')
    const ERRORS= {
        'RESEND_VERIFY_TOKEN': {
            title: 'No se pudo verificar tu cuenta',
            message: 'Volvimos a enviarle el enlace de verificación a tu correo',
            Component: null
        },
        'REQUEST_EMAIL_VERIFY_TOKEN': {
            title: 'No se pudo verificar tu cuenta',
            message: 'Debes volver a escribir tu mail para poder enviarte el correo de verificacion',
            Component: RequestEmailForm
        },
        'DEFAULT': {
            title: 'Error!',
            message: 'Ocurrio un error inesperado',
            Component: null
        }
    }
    const {title, message, Component} = ERRORS[error] ? ERRORS[error] : ERRORS['DEFAULT']

  return (
    <main className='auth-screen'>
        <form className='auth-form'>
            <img src='../public/Slack-logo.png' alt='Logo de la app' className='logo' />

            <h1 className='title'>{title}</h1>
            <p className='description'>{message}</p>

            {Component && <Component />}

        </form>
    </main>
  )
}



export default ErrorScreen