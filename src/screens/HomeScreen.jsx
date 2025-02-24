import React from 'react'
import ENVIROMENT from '../utils/constants/enviroment'
import { getAuthenticatedHeaders } from '../fetching/customHeaders'
import { useFetch } from '../hooks/useFetch'
import { Link } from 'react-router-dom'
import "../styles/home.css"
import { MdWorkspaces } from "react-icons/md"

const HomeScreen = () => {
    const { 
        data: workspace_response, 
        error: workspace_response_error, 
        loading: workspace_loading 
    } = useFetch(ENVIROMENT.API_URL + '/api/workspace', {
        method: "GET",
        headers: getAuthenticatedHeaders()
    })
   console.log(workspace_response)
   return (
    <div className="home-screen">
        <header className="home-header">
            <h1>Bienvenido a la app</h1>
            <Link to="/profile" className="profile-link">Mi Perfil</Link>
        </header>

        <main className="home-content">
            <section className="workspaces-section">
                <h2><MdWorkspaces /> Tus espacios de trabajo</h2>
                {workspace_loading ? (
                    <div className="loading-spinner">Cargando...</div>
                ) : workspace_response_error ? (
                    <div className="error-message">Error al cargar los espacios de trabajo</div>
                ) : (
                    <div className="workspace-grid">
                        {workspace_response?.data.workspaces.length ? (
                            workspace_response.data.workspaces.map(workspace => (
                                <Link to={`/workspace/${workspace._id}`} key={workspace._id} className="workspace-card">
                                    <div className="workspace-icon">{workspace.name[0].toUpperCase()}</div>
                                    <h3>{workspace.name}</h3>
                                </Link>
                            ))
                        ) : (
                            <p className="no-workspaces">Aún no has creado ningún espacio de trabajo.</p>
                        )}
                    </div>
                )}
            </section>

            <section className="create-workspace-section">
                <h2>Crear un nuevo espacio de trabajo</h2>
                <p>Comienza a colaborar con tu equipo en un nuevo espacio de trabajo.</p>
                <Link to='/workspace/new' className="create-workspace-button">
                    <MdAdd /> Crear espacio de trabajo
                </Link>
            </section>
        </main>
    </div>
    )
}

export default HomeScreen