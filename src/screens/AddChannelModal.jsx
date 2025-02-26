import { MdClose } from "react-icons/md"
import useForm from "../hooks/useForm"

const AddChannelModal = ({ onClose, onAddChannel }) => {
  const { form_state, handleChangeInput, resetForm } = useForm({ name: "" })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Enviando nombre de canal:", form_state.name)
    onAddChannel(form_state.name)
    resetForm()
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Añadir nuevo canal</h2>
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
            <button type="submit" className="submit-button">
              Crear canal
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