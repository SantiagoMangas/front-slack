import { useFetch } from "../hooks/useFetch"
import useForm from "../hooks/useForm"
import ENVIROMENT from "../utils/constants/enviroment"
import { getAuthenticatedHeaders } from "../fetching/customHeaders"
import { MdSend } from "react-icons/md"

const ChannelView = ({ workspace_id, channel_id }) => {
  const {
    data: channel_data,
    loading: channel_loading,
    error: channel_error,
    refetch: refetchChannel,
  } = useFetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}`, {
    method: "GET",
    headers: getAuthenticatedHeaders(),
  })

  const { form_state, handleChangeInput, resetForm } = useForm({ content: "" })

  const handleSubmitNewMessage = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}/send-message`, {
        method: "POST",
        headers: getAuthenticatedHeaders(),
        body: JSON.stringify(form_state),
      })
      if (response.ok) {
        resetForm()
        refetchChannel()
      } else {
        console.error("Error al enviar el mensaje")
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error)
    }
  }

  if (channel_loading) return <div className="channel-loading">Cargando canal...</div>
  if (channel_error) return <div className="channel-error">Error al cargar el canal</div>

  return (
    <div className="channel-container">
      <div className="channel-header">
        <h2># {channel_data.data.name}</h2>
      </div>
      <div className="messages-container">
        {channel_data.data.messages.map((message) => (
          <div key={message._id} className="message">
            <div className="message-author">{message.sender.username}</div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmitNewMessage} className="message-form">
        <input
          type="text"
          name="content"
          placeholder="Enviar mensaje"
          value={form_state.content}
          onChange={handleChangeInput}
          className="message-input"
        />
        <button type="submit" className="send-button">
          <MdSend />
        </button>
      </form>
    </div>
  )
}

export default ChannelView