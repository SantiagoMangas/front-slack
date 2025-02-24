import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md"
import useForm from "../hooks/useForm"
import useValidation from "../hooks/useValidation"
import ENVIROMENT from "../utils/constants/enviroment"
import { AuthContext } from "../Context/AuthContext"
import "../styles/auth.css"

const LoginScreen = () => {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()
    const { form_state, handleChangeInput } = useForm({ email: "", password: "" })
    const { errors, validate } = useValidation(form_state)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
  
    // Ejecuta la validación solo cuando cambie el formulario (email o password)
    useEffect(() => {
      if (form_state.email || form_state.password) {
        validate()
      }
    }, [form_state.email, form_state.password, validate])
  
    const handleSubmitForm = async (event) => {
      event.preventDefault()
  
      if (errors.email.length || errors.password.length) return
  
      try {
        const response = await fetch(`${ENVIROMENT.API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ENVIROMENT.API_KEY,
          },
          body: JSON.stringify(form_state),
        })
  
        const data = await response.json()
        if (!response.ok) {
          setErrorMessage(data.message || "Error desconocido")
          return
        }
  
        login(data.data.access_token)
        navigate("/home")
      } catch (error) {
        setErrorMessage("Hubo un error al iniciar sesión. Intenta nuevamente.")
        console.error("Error al iniciar sesión", error)
      }
    }  

  return (
    <main className="auth-screen">
      <form className="auth-form" onSubmit={handleSubmitForm}>
        <img src="/Slack-logo.png" alt="Logo de la app" className="logo" />
        <h1 className="title">Iniciar sesión</h1>

        {errorMessage && <p className="error-text">{errorMessage}</p>}

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
          {errors.email && <p className="error-text">{errors.email}</p>}
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
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>

        <button type='submit' disabled={
                    errores.email.length || 
                    errores.password.length || 
                    !form_state.email || 
                    !form_state.password
                    }>
                    Iniciar sesion
                </button>

        <p className="description">
          ¿Olvidaste tu contraseña? <Link to="/forgot-password">Recupérala aquí</Link>
        </p>
        <p className="description">
          ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </main>
  )
}

export default LoginScreen