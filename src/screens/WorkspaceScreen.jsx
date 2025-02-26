import { useState, useEffect, useCallback } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useFetch } from "../hooks/useFetch"
import ENVIROMENT from "../utils/constants/enviroment"
import { getAuthenticatedHeaders } from "../fetching/customHeaders"
import { MdAdd } from "react-icons/md"
import "../styles/workspace.css"
import ChannelView from "../screens/ChannelView"
import AddChannelModal from "../screens/AddChannelModal"

const WorkspaceScreen = () => {
  const { workspace_id, channel_id } = useParams()
  const navigate = useNavigate()
  const [channels, setChannels] = useState([])
  const [isAddingChannel, setIsAddingChannel] = useState(false)
  const [workspaceName, setWorkspaceName] = useState("Workspace")

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
      
      // Si el API devuelve el nombre del workspace, actualizarlo
      if (channels_data.data.workspace && channels_data.data.workspace.name) {
        setWorkspaceName(channels_data.data.workspace.name)
      }
    }
  }, [channels_data])

  const handleAddChannel = useCallback(
    async (channelName) => {
      try {
        console.log("Iniciando creación de canal:", channelName)
        const response = await fetch(ENVIROMENT.API_URL + `/api/channel/${workspace_id}`, {
          method: "POST",
          headers: getAuthenticatedHeaders(),
          body: JSON.stringify({ name: channelName }),
        })

        const data = await response.json()
        console.log("Respuesta completa al crear canal:", data)

        if (response.ok && data.ok) {
          // Aseguramos que la respuesta incluya el ID del canal creado
          if (data.data && data.data._id) {
            // Primero cerramos el modal
            setIsAddingChannel(false)
            
            // Luego refrescamos los canales
            await refetchChannels()
            
            // Finalmente navegamos al nuevo canal
            // Usamos setTimeout para asegurar que la UI se actualice correctamente
            setTimeout(() => {
              navigate(`/workspace/${workspace_id}/${data.data._id}`)
            }, 100)
          } else {
            console.warn("El canal se creó pero no se recibió su ID", data)
            refetchChannels()
            setIsAddingChannel(false)
          }
        } else {
          console.error("Error al crear el canal:", data.message)
          alert(`Error al crear el canal: ${data.message}`)
        }
      } catch (error) {
        console.error("Error al crear el canal:", error)
        alert(`Error al crear el canal: ${error.message}`)
      }
    },
    [workspace_id, refetchChannels, navigate],
  )

  return (
    <div className="workspace-screen">
      <div className="workspace-sidebar">
        <h2 className="workspace-name">{workspaceName}</h2>
        <ChannelsList
          channels={channels}
          loading={channels_loading}
          error={channels_error}
          workspace_id={workspace_id}
          currentChannelId={channel_id}
          onAddChannel={() => setIsAddingChannel(true)}
        />
      </div>
      <div className="workspace-main">
        {channel_id ? (
          <ChannelView 
            key={channel_id} 
            workspace_id={workspace_id} 
            channel_id={channel_id} 
          />
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

const ChannelsList = ({ channels, loading, error, workspace_id, currentChannelId, onAddChannel }) => {
  if (loading) return <p>Cargando canales...</p>
  if (error) return <p className="error-text">Error al cargar los canales: {error}</p>

  return (
    <div className="channels-list">
      <h3 className="channels-header">Canales</h3>
      {channels && channels.length > 0 ? (
        channels.map((channel) => (
          <Link 
            key={channel._id} 
            to={`/workspace/${workspace_id}/${channel._id}`} 
            className={`channel-link ${channel._id === currentChannelId ? 'active' : ''}`}
          >
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