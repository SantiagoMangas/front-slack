"use client"
import { Link, useParams } from "react-router-dom"
import { useFetch } from "../hooks/useFetch"
import ENVIROMENT from "../utils/constants/enviroment"
import { getAuthenticatedHeaders } from "../fetching/customHeaders"
import useForm from "../hooks/useForm"
import { MdAdd, MdSend } from "react-icons/md"
import "../styles/workspace.css"

const WorkspaceScreen = () => {
  const { workspace_id, channel_id } = useParams()

  const {
    data: channels_data,
    error: channels_error,
    loading: channels_loading,
  } = useFetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}`, {
    method: "GET",
    headers: getAuthenticatedHeaders(),
  })

  return (
    <div className="workspace-screen">
      <div className="workspace-sidebar">
        <h2 className="workspace-name">Workspace Name</h2>
        {channels_loading ? (
          <p>Cargando canales...</p>
        ) : channels_error ? (
          <p className="error-text">Error al cargar los canales</p>
        ) : (
          <ChannelsList channel_list={channels_data.data.channels} workspace_id={workspace_id} />
        )}
      </div>
      <div className="workspace-main">
        {channel_id ? (
          <Channel workspace_id={workspace_id} channel_id={channel_id} />
        ) : (
          <div className="channel-placeholder">
            <h2>Bienvenido al workspace</h2>
            <p>Selecciona un canal para comenzar</p>
          </div>
        )}
      </div>
    </div>
  )
}

const ChannelsList = ({ channel_list, workspace_id }) => {
  return (
    <div className="channels-list">
      <h3 className="channels-header">Canales</h3>
      {channel_list.map((channel) => (
        <Link key={channel._id} to={`/workspace/${workspace_id}/${channel._id}`} className="channel-link">
          # {channel.name}
        </Link>
      ))}
      <button className="add-channel-btn">
        <MdAdd /> Añadir canal
      </button>
    </div>
  )
}

const Channel = ({ workspace_id, channel_id }) => {
  const {
    data: channel_data,
    loading: channel_loading,
    error: channel_error,
  } = useFetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}`, {
    method: "GET",
    headers: getAuthenticatedHeaders(),
  })

  const { form_state, handleChangeInput } = useForm({ content: "" })

  const handleSubmitNewMessage = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}/${channel_id}/send-message`, {
        method: "POST",
        headers: getAuthenticatedHeaders(),
        body: JSON.stringify(form_state),
      })
      const responseData = await response.json()
      console.log(responseData)
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

export default WorkspaceScreen