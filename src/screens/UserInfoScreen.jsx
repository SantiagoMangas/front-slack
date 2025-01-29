import React from 'react'
import useForm from '../hooks/useForm'
import { getAuthenticatedHeaders } from '../fetching/customHeaders'
import ENVIROMENT from '../utils/constants/enviroment'

const UserInfoScreen = () => {
    const {form_state, handleChangeInput} = useForm({username: "", img_profile: ""})
    const handleChangeImage = (event) =>{
        const file = event.target.files[0]
        const FILE_MB_LIMIT = 2
        if(file && file.size > FILE_MB_LIMIT * 1024 * 1024) {
            alert(`El archivo supera el límite de ${FILE_MB_LIMIT} MB`)
            return
        }
        const reader = new FileReader()
        reader.onloadend = () => {
            handleChangeInput({target: {name: "img_profile", value: reader.result}})
        }
        //Aca se le indica al reader que empieze a leer el archivo
        reader.readAsDataURL(file)
    }
    const handleSubmitForm = async (event) => {
        event.preventDefault()
        fetch(ENVIROMENT.API_URL + '/api/profile', {
            method: "PUT",
            headers: getAuthenticatedHeaders(),
            body: JSON.stringify(form_state)
        })
    }
  return (
    <div>

        <form onSubmit={handleSubmitForm}>
            <label htmlFor="username">Ingresa el nuevo username</label>
            <input  id='username' type='text' name='username' value={form_state.username} 
            onChange={handleChangeInput}/>

            <label htmlFor="img_profile">Modifica tu imagen de perfil</label>
            {
                form_state.img_profile &&
                <img src={form_state.img_profile} alt="img_profile" />
            }
            <input type="file" name='img_profile' id='img_profile' onChange={handleChangeImage} />
            <button>Actualizar</button>
        </form>
    </div>
  )
}

export default UserInfoScreen