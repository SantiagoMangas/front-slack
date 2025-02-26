import { useState, useEffect, useCallback } from "react"
import { Link, useParams } from "react-router-dom"
import { useFetch } from "../hooks/useFetch"
import ENVIROMENT from "../utils/constants/enviroment"
import { getAuthenticatedHeaders } from "../fetching/customHeaders"
import { MdAdd } from "react-icons/md"
import "../styles/workspace.css"
import ChannelView from "../screens/ChannelView"
import AddChannelModal from "../screens/AddChannelModal"

const WorkspaceScreen = () => {
  const { workspace_id, channel_id } = useParams()
  const [channels, setChannels] = useState([])
  const [isAddingChannel, setIsAddingChannel] = useState(false)

  const {
    data: channels_data,
    error: channels_error,
    loading: channels_loading,
    refetch: refetchChannels,
  } = useFetch(
    ENVIROMENT.API_URL + `/api/channel/${workspace_id}`,
    {
      method: "GET",
      headers: getAuthenticatedHeaders(),
    },
    [workspace_id],
  )

  useEffect(() => {
    if (channels_data && channels_data.data && channels_data.data.channels) {
      setChannels(channels_data.data.channels)
    }
  }, [channels_data])

  const handleAddChannel = useCallback(
    async (channelName) => {
      try {
        console.log("Iniciando creación de canal:", channelName)
        const response = await fetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}`, {
          method: "POST",
          headers: {
            ...getAuthenticatedHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: channelName }),
        })

        const data = await response.json()
        console.log("Respuesta completa al crear canal:", data)

        if (response.ok) {
          console.log("Canal creado exitosamente, actualizando lista de canales")
          await refetchChannels()
          setIsAddingChannel(false)
        } else {
          console.error("Error al crear el canal:", data.message)
          alert(`Error al crear el canal: ${data.message}`)
        }
      } catch (error) {
        console.error("Error al crear el canal:", error)
        alert(`Error al crear el canal: ${error.message}`)
      }
    },
    [workspace_id, refetchChannels],
  )

  return (
    <div className="workspace-screen">
      <div className="workspace-sidebar">
        <h2 className="workspace-name">Workspace Name</h2>
        <ChannelsList
          channels={channels}
          loading={channels_loading}
          error={channels_error}
          workspace_id={workspace_id}
          onAddChannel={() => setIsAddingChannel(true)}
        />
      </div>
      <div className="workspace-main">
        {channel_id ? (
          <ChannelView workspace_id={workspace_id} channel_id={channel_id} />
        ) : (
          <div className="channel-placeholder">
            <h2>Bienvenido al workspace</h2>
            <p>Selecciona un canal para comenzar</p>
          </div>
        )}
      </div>
      {isAddingChannel && <AddChannelModal onClose={() => setIsAddingChannel(false)} onAddChannel={handleAddChannel} />}
    </div>
  )
}

const ChannelsList = ({ channels, loading, error, workspace_id, onAddChannel }) => {
  if (loading) return <p>Cargando canales...</p>
  if (error) return <p className="error-text">Error al cargar los canales: {error}</p>

  return (
    <div className="channels-list">
      <h3 className="channels-header">Canales</h3>
      {channels && channels.length > 0 ? (
        channels.map((channel) => (
          <Link key={channel._id} to={`/workspace/${workspace_id}/${channel._id}`} className="channel-link">
            # {channel.name}
          </Link>
        ))
      ) : (
        <p>No hay canales disponibles</p>
      )}
      <button className="add-channel-btn" onClick={onAddChannel}>
        <MdAdd /> Añadir canal
      </button>
    </div>
  )
}

export default WorkspaceScreen