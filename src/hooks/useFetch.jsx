import { useEffect, useState } from "react"

export const useFetch = (api_url, params, dependencies = []) => {
    const [loading, setIsLoading] = useState(true)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    
    const callFetch = async () => {
        try{
            setIsLoading(true)
            const response = await fetch(api_url, params)
            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`)
            }
            const responseData = await response.json()
            setData(responseData)
            setError(null)
        }
        catch(error){
            console.log(error)
            setError(error)
        }
        finally{
            setIsLoading(false)
        }
    }
    
    useEffect(() => {
        callFetch()
    }, [...dependencies])
    
    return {loading, data, error, refetch: callFetch}
}