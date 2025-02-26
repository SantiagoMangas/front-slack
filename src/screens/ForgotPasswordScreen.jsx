import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdEmail } from 'react-icons/md'
import useForm from '../hooks/useForm'
import ENVIROMENT from '../utils/constants/enviroment'
import '../styles/auth.css'

const ForgotPasswordScreen = () => {
  const navigate = useNavigate()
  const { form_state, handleChangeInput, resetForm } = useForm({ email: "" })
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${ENVIROMENT.API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ENVIROMENT.API_KEY,
        },
        body: JSON.stringify(form_state),
      })
      const data = await response.json()
      if (response.ok) {
        setSuccessMessage("Se ha enviado un correo con instrucciones para restablecer tu contraseña.")
        resetForm()
      } else {
        setErrorMessage(data.message || "Error al procesar la solicitud")
      }
    } catch (error) {
      console.error("Error:", error)
      setErrorMessage("Hubo un error al procesar tu solicitud. Intenta nuevamente.")
    }
  }

  return (
    <main className="auth-screen">
      <form className="auth-form" onSubmit={handleSubmit}>
        <img src="/Slack-logo.png" alt="Logo de la app" className="logo" />
        <h1 className="title">Recuperar contraseña</h1>

        {errorMessage && <p className="error-text">{errorMessage}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}

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
              required
            />
          </div>
        </div>

        <button type="submit" disabled={!form_state.email}>
          Enviar instrucciones
        </button>

        <p className="description">
          ¿Recordaste tu contraseña?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", color: "#611F69", textDecoration: "underline" }}
          >
            Inicia sesión
          </span>
        </p>
      </form>
    </main>
  )
}

export default ForgotPasswordScreen