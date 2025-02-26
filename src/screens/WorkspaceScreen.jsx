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
  const [selectedChannel, setSelectedChannel] = useState(channel_id || null)
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

  // Efecto para actualizar los canales cuando cambia la respuesta del API
  useEffect(() => {
    if (channels_data && channels_data.data && channels_data.data.channels) {
      setChannels(channels_data.data.channels)
      
      // Si el API devuelve el nombre del workspace, actualizarlo
      if (channels_data.data.workspace && channels_data.data.workspace.name) {
        setWorkspaceName(channels_data.data.workspace.name)
      }
    }
  }, [channels_data])

  // Efecto para actualizar el canal seleccionado cuando cambia la URL
  useEffect(() => {
    if (channel_id) {
      setSelectedChannel(channel_id)
    }
  }, [channel_id])

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
          // Cerrar el modal primero
          setIsAddingChannel(false)
          
          // Luego refrescar los canales
          await refetchChannels()
          
          // No intentamos navegar programáticamente por ahora
          
          // Si tienes acceso a los canales actualizados, selecciona el que coincida con el nombre
          const updatedChannels = (await (await fetch(
            ENVIROMENT.API_URL + `/api/channel/${workspace_id}`,
            {
              method: "GET",
              headers: getAuthenticatedHeaders(),
            }
          )).json()).data.channels
          
          if (updatedChannels && updatedChannels.length > 0) {
            // Buscar el canal recién creado por nombre
            const newChannel = updatedChannels.find(c => c.name === channelName)
            if (newChannel && newChannel._id) {
              console.log("Canal encontrado:", newChannel)
              // Actualizar el canal seleccionado (esto actualizará la UI pero no la URL)
              setSelectedChannel(newChannel._id)
              
              // Actualizar la lista de canales local
              setChannels(updatedChannels)
            }
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
    [workspace_id, refetchChannels],
  )

  const handleSelectChannel = (channelId) => {
    setSelectedChannel(channelId)
  }

  return (
    <div className="workspace-screen">
      <div className="workspace-sidebar">
        <h2 className="workspace-name">{workspaceName}</h2>
        <ChannelsList
          channels={channels}
          loading={channels_loading}
          error={channels_error}
          workspace_id={workspace_id}
          selectedChannelId={selectedChannel}
          onSelectChannel={handleSelectChannel}
          onAddChannel={() => setIsAddingChannel(true)}
        />
      </div>
      <div className="workspace-main">
        {selectedChannel ? (
          <ChannelView 
            key={selectedChannel} 
            workspace_id={workspace_id} 
            channel_id={selectedChannel} 
          />
        ) : (
          <div className="channel-placeholder">
            <h2>Bienvenido al workspace</h2>
            <p>Selecciona un canal para comenzar</p>
          </div>
        )}
      </div>
      {isAddingChannel && (
        <AddChannelModal 
          onClose={() => setIsAddingChannel(false)} 
          onAddChannel={handleAddChannel} 
        />
      )}
    </div>
  )
}

// Modificado para usar manejo interno de selección en lugar de depender únicamente de React Router
const ChannelsList = ({ 
  channels, 
  loading, 
  error, 
  workspace_id, 
  selectedChannelId, 
  onSelectChannel,
  onAddChannel 
}) => {
  if (loading) return <p>Cargando canales...</p>
  if (error) return <p className="error-text">Error al cargar los canales: {error}</p>

  const handleChannelClick = (e, channelId) => {
    e.preventDefault() // Prevenir la navegación por defecto
    onSelectChannel(channelId)
  }

  return (
    <div className="channels-list">
      <h3 className="channels-header">Canales</h3>
      {channels && channels.length > 0 ? (
        channels.map((channel) => (
          <a 
            key={channel._id} 
            href={`/workspace/${workspace_id}/${channel._id}`} 
            className={`channel-link ${channel._id === selectedChannelId ? 'active' : ''}`}
            onClick={(e) => handleChannelClick(e, channel._id)}
          >
            # {channel.name}
          </a>
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