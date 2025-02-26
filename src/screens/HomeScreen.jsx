import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { MdAdd, MdWorkspaces } from "react-icons/md"
import { useFetch } from "../hooks/useFetch"
import ENVIROMENT from "../utils/constants/enviroment"
import { getAuthenticatedHeaders } from "../fetching/customHeaders"
import "../styles/home.css"

const HomeScreen = () => {
  const [workspaces, setWorkspaces] = useState([])
  const {
    data: workspace_response,
    error: workspace_response_error,
    loading: workspace_loading,
  } = useFetch(ENVIROMENT.API_URL + "/api/workspace", {
    method: "GET",
    headers: getAuthenticatedHeaders(),
  })

  useEffect(() => {
    if (workspace_response && workspace_response.data && workspace_response.data.workspaces) {
      setWorkspaces(workspace_response.data.workspaces)
    }
  }, [workspace_response])

  if (workspace_loading) {
    return <div className="loading-spinner">Cargando...</div>
  }

  if (workspace_response_error) {
    console.error("Error al cargar los espacios de trabajo:", workspace_response_error)
    return (
      <div className="error-message">
        Error al cargar los espacios de trabajo. Por favor, intenta de nuevo más tarde.
      </div>
    )
  }

  return (
    <div className="home-screen">
      <header className="home-header">
        <h1>Bienvenido a la app</h1>
        <Link to="/profile" className="profile-link">
          Mi Perfil
        </Link>
      </header>

      <main className="home-content">
        <section className="workspaces-section">
          <h2>
            <MdWorkspaces /> Tus espacios de trabajo
          </h2>
          <div className="workspace-grid">
            {workspaces.length > 0 ? (
              workspaces.map((workspace) => (
                <Link to={`/workspace/${workspace._id}`} key={workspace._id} className="workspace-card">
                  <div className="workspace-icon">{workspace.name[0].toUpperCase()}</div>
                  <h3>{workspace.name}</h3>
                </Link>
              ))
            ) : (
              <p className="no-workspaces">Aún no has creado ningún espacio de trabajo.</p>
            )}
          </div>
        </section>

        <section className="create-workspace-section">
          <h2>Crear un nuevo espacio de trabajo</h2>
          <p>Comienza a colaborar con tu equipo en un nuevo espacio de trabajo.</p>
          <Link to="/workspace/new" className="create-workspace-button">
            <MdAdd /> Crear espacio de trabajo
          </Link>
        </section>
      </main>
    </div>
  )
}

export default HomeScreen