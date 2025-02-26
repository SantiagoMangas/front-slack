import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from "react-icons/md"
import useForm from "../hooks/useForm"
import ENVIROMENT from "../utils/constants/enviroment"
import "../styles/auth.css"

const RegisterScreen = () => {
  const navigate = useNavigate()
  const { form_state, handleChangeInput, resetForm } = useForm({ username: "", email: "", password: "" })
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [errors, setErrors] = useState({ username: [], email: [], password: [] })
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    validateForm()
  }, [form_state])

  const validateForm = () => {
    const newErrors = {
      username: [],
      email: [],
      password: [],
    }

    if (form_state.username.length > 30) newErrors.username.push("El límite de caracteres es 30")
    if (form_state.username.length < 5) newErrors.username.push("El mínimo de caracteres es 5")

    if (form_state.email.length > 30) newErrors.email.push("El límite de caracteres es 30")
    if (form_state.email.length < 5) newErrors.email.push("El mínimo de caracteres es 5")

    if (form_state.password.length > 30) newErrors.password.push("El máximo de caracteres es 30")
    if (form_state.password.length < 5) newErrors.password.push("El mínimo de caracteres es 5")

    setErrors(newErrors)
  }

  const handleSubmitForm = async (event) => {
    event.preventDefault()
    if (Object.values(errors).some((error) => error.length > 0)) return

    try {
      const res = await fetch(ENVIROMENT.API_URL + "/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ENVIROMENT.API_KEY,
        },
        body: JSON.stringify(form_state),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccessMessage("Registro exitoso. Redirigiendo al inicio de sesión...")
        resetForm()
        setTimeout(() => navigate("/login"), 3000)
      } else {
        setErrorMessage(data.message || "Error al crear usuario")
      }
    } catch (error) {
      console.error("Error al crear usuario", error)
      setErrorMessage("Hubo un error al crear la cuenta. Intenta nuevamente.")
    }
  }

  return (
    <main className="auth-screen">
      <form className="auth-form" onSubmit={handleSubmitForm}>
        <img src="/Slack-logo.png" alt="Logo de la app" className="logo" />
        <h1 className="title">Registro</h1>

        {errorMessage && <p className="error-text">{errorMessage}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}

        <div className="input-container">
          <label htmlFor="username">Nombre de usuario</label>
          <div className="input-icon-container">
            <MdPerson className="icon icon-left" size={20} />
            <input
              name="username"
              id="username"
              placeholder="Tu nombre de usuario"
              value={form_state.username}
              onChange={handleChangeInput}
            />
          </div>
          {errors.username.map((error, index) => (
            <p key={index} className="error-text">
              {error}
            </p>
          ))}
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
          {errors.email.map((error, index) => (
            <p key={index} className="error-text">
              {error}
            </p>
          ))}
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
          {errors.password.map((error, index) => (
            <p key={index} className="error-text">
              {error}
            </p>
          ))}
        </div>

        <button
          type="submit"
          disabled={
            !form_state.username ||
            !form_state.email ||
            !form_state.password ||
            Object.values(errors).some((error) => error.length > 0)
          }
        >
          Crear cuenta
        </button>

        <p className="description">
          ¿Ya tienes una cuenta?{" "}
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

export default RegisterScreen