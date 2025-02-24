import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdWorkspaces } from 'react-icons/md'
import useForm from '../hooks/useForm'
import ENVIROMENT from '../utils/constants/enviroment'
import { getAuthenticatedHeaders } from '../fetching/customHeaders'
import '../styles/auth.css'

const CreateWorkspaceScreen = () => {
  const navigate = useNavigate()
  const { handleChangeInput, form_state } = useForm({ name: "" })
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateWorkspace = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      const response = await fetch(ENVIROMENT.API_URL + "/api/workspace", {
        method: "POST",
        headers: getAuthenticatedHeaders(),
        body: JSON.stringify(form_state),
      })
      const data = await response.json()

      if (response.ok) {
        navigate("/home")
      } else {
        setErrorMessage(data.message || "Error al crear el espacio de trabajo")
      }
    } catch (error) {
      console.error("Error al crear el espacio de trabajo:", error)
      setErrorMessage("Hubo un problema al conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-screen">
      <form className="auth-form" onSubmit={handleCreateWorkspace}>
        <img src="/Slack-logo.png" alt="Logo de la app" className="logo" />
        <h1 className="title">Crear un nuevo espacio de trabajo</h1>

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <div className="input-container">
          <label htmlFor="name">Nombre del espacio de trabajo</label>
          <div className="input-icon-container">
            <MdWorkspaces className="icon icon-left" size={20} />
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Ej: Mi Empresa"
              onChange={handleChangeInput}
              value={form_state.name}
              required
            />
          </div>
        </div>

        <button type="submit" disabled={!form_state.name || isLoading}>
          {isLoading ? "Creando..." : "Crear espacio de trabajo"}
        </button>
      </form>
    </main>
  )
}

export default CreateWorkspaceScreen