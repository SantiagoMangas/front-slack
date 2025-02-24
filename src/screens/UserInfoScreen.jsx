import { useState } from 'react'
import { MdPerson, MdImage } from 'react-icons/md'
import useForm from '../hooks/useForm'
import { getAuthenticatedHeaders } from '../fetching/customHeaders'
import ENVIROMENT from '../utils/constants/enviroment'
import '../styles/auth.css'

const UserInfoScreen = () => {
  const { form_state, handleChangeInput } = useForm({ username: "", img_profile: "" })
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChangeImage = (event) => {
    const file = event.target.files?.[0]
    const FILE_MB_LIMIT = 2
    if (file && file.size > FILE_MB_LIMIT * 1024 * 1024) {
      setErrorMessage(`El archivo supera el límite de ${FILE_MB_LIMIT} MB`)
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      handleChangeInput({ target: { name: "img_profile", value: reader.result } })
    }
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitForm = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const response = await fetch(ENVIROMENT.API_URL + "/api/profile", {
        method: "PUT",
        headers: getAuthenticatedHeaders(),
        body: JSON.stringify(form_state),
      })
      const data = await response.json()

      if (response.ok) {
        setSuccessMessage("Perfil actualizado exitosamente")
      } else {
        setErrorMessage(data.message || "Error al actualizar el perfil")
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error)
      setErrorMessage("Hubo un problema al conectar con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-screen">
      <form className="auth-form" onSubmit={handleSubmitForm}>
        <img src="/Slack-logo.png" alt="Logo de la app" className="logo" />
        <h1 className="title">Actualizar perfil</h1>

        {errorMessage && <p className="error-text">{errorMessage}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}

        <div className="input-container">
          <label htmlFor="username">Nombre de usuario</label>
          <div className="input-icon-container">
            <MdPerson className="icon icon-left" size={20} />
            <input
              id="username"
              type="text"
              name="username"
              value={form_state.username}
              onChange={handleChangeInput}
              placeholder="Nuevo nombre de usuario"
            />
          </div>
        </div>

        <div className="input-container">
          <label htmlFor="img_profile">Imagen de perfil</label>
          <div className="input-icon-container">
            <MdImage className="icon icon-left" size={20} />
            <input type="file" name="img_profile" id="img_profile" onChange={handleChangeImage} accept="image/*" />
          </div>
          {form_state.img_profile && (
            <div className="profile-image-preview">
              <img src={form_state.img_profile || "/placeholder.svg"} alt="Vista previa de imagen de perfil" />
            </div>
          )}
        </div>

        <button type="submit" disabled={isLoading || (!form_state.username && !form_state.img_profile)}>
          {isLoading ? "Actualizando..." : "Actualizar perfil"}
        </button>
      </form>
    </main>
  )
}

export default UserInfoScreen