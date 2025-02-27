import { useState } from "react"
import { MdClose } from "react-icons/md"
import useForm from "../hooks/useForm"

const AddChannelModal = ({ onClose, onAddChannel }) => {
  const { form_state, handleChangeInput } = useForm({ name: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await onAddChannel(form_state.name)
      onClose()
    } catch (error) {
      setError("No se pudo crear el canal. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Añadir nuevo canal</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={form_state.name}
            onChange={handleChangeInput}
            placeholder="Nombre del canal"
            required
          />
          <div className="modal-actions">
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear canal"}
            </button>
            <button type="button" onClick={onClose} className="close-button">
              <MdClose /> Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddChannelModal