import React from "react"
import { useState } from "react"
import { MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md"
import useForm from "../hooks/useForm"
import ENVIROMENT from "../utils/constants/enviroment"
import "../styles/auth.css"

const ResetPasswordScreen = () => {
  const url = new URLSearchParams(window.location.search)
  const reset_token = url.get("reset_token")
  const { form_state, handleChangeInput } = useForm({ password: "" })
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmitResetPassword = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${ENVIROMENT.API_URL}/api/auth/reset-password?reset_token=${reset_token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ENVIROMENT.API_KEY,
        },
        body: JSON.stringify(form_state),
      })
      const data = await response.json()
      if (response.ok) {
        setSuccessMessage("Tu contraseña ha sido actualizada exitosamente.")
        setErrorMessage("")
      } else {
        setErrorMessage(data.message || "Hubo un error al restablecer la contraseña.")
        setSuccessMessage("")
      }
    } catch (error) {
      console.error(error)
      setErrorMessage("Hubo un error al conectar con el servidor.")
      setSuccessMessage("")
    }
  }

  return (
    <main className="auth-screen">
      <form className="auth-form" onSubmit={handleSubmitResetPassword}>
        <img src="/Slack-logo.png" alt="Logo de la app" className="logo" />
        <h1 className="title">Elige una nueva contraseña</h1>

        {errorMessage && <p className="error-text">{errorMessage}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}

        <div className="input-container">
          <label htmlFor="password">Nueva contraseña:</label>
          <div className="input-icon-container">
            <MdLock className="icon icon-left" size={20} />
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              placeholder="********"
              onChange={handleChangeInput}
              value={form_state.password}
            />
            <span onClick={() => setPasswordVisible(!passwordVisible)} className="icon icon-right">
              {passwordVisible ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </span>
          </div>
        </div>

        <button type="submit" disabled={!form_state.password}>
          Restablecer contraseña
        </button>
      </form>
    </main>
  )
}

export default ResetPasswordScreen