import { useEffect, useState, useCallback } from "react"

export const useFetch = (api_url, params, dependencies = []) => {
  const [loading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const callFetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(api_url, params)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const responseData = await response.json()
      setData(responseData)
    } catch (error) {
      console.error("Error en useFetch:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [api_url, params])

  useEffect(() => {
    callFetch()
  }, [callFetch, ...dependencies])

  const refetch = useCallback(() => {
    callFetch()
  }, [callFetch])

  return { loading, data, error, refetch }
}