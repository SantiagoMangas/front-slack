import ENVIROMENT from "../utils/constants/enviroment"

export const getAuthenticatedHeaders = () =>{
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
        'x-api-key': ENVIROMENT.API_KEY
    }
}