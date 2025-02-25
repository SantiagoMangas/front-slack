import { MdClose } from "react-icons/md"
import useForm from "../hooks/useForm"

const AddChannelModal = ({ onClose, onAddChannel }) => {
  const { form_state, handleChangeInput } = useForm({ name: "" })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddChannel(form_state.name)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-modal" onClick={onClose}>
          <MdClose />
        </button>
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
          <button type="submit">Crear canal</button>
        </form>
      </div>
    </div>
  )
}

export default AddChannelModal

