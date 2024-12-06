import { useState, useEffect } from 'react'

export function useFetch(uri) {
    const [data, setData] = useState()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      if (!uri) return
      setLoading(true)
      fetch(uri)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Błąd podczas ładowania danych')
          }
          return response.json()
        })
        .then((data) => {
          setData(data)
          setLoading(false)
        })
        .catch((error) => {
          setError(error)
          setLoading(false)
        })
    }, [uri])
  
    const deleteProduct = async (productId) => {
      setLoading(true)
      try {
        const response = await fetch(`${uri}/${productId}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Błąd podczas usuwania produktu')
        }
        setLoading(false)
        return productId
      } catch (error) {
        setError(error)
        setLoading(false)
      }
    }
  
    const addProduct = async (newProduct) => {
      setLoading(true)
      try {
        const response = await fetch(`${uri}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        })
  
        if (!response.ok) {
          throw new Error('Błąd podczas dodawania produktu')
        }
  
        const contentType = response.headers.get('Content-Type')
        if (contentType && contentType.includes('application/json')) {
          const addedProduct = await response.json()
          setLoading(false)
          return addedProduct
        } else {
          throw new Error('Odpowiedź serwera nie jest w formacie JSON')
        }
      } catch (error) {
        setError(error)
        setLoading(false)
      }
    }

    const updateProduct = async (productId, updatedProduct) => {
        setLoading(true)
        try {
          const response = await fetch(`${uri}${productId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
          })
      
          if (!response.ok) {
            throw new Error('Błąd podczas aktualizacji produktu')
          }
      
          const contentType = response.headers.get('Content-Type')
          if (contentType && contentType.includes('application/json')) {
            const updatedData = await response.json()
            setLoading(false)
            return updatedData
          } else {
            throw new Error('Odpowiedź serwera nie jest w formacie JSON')
          }
        } catch (error) {
          setError(error)
          setLoading(false)
        }
      }
  
    return {
      loading,
      data,
      error,
      deleteProduct,
      addProduct,
      updateProduct,
    }
  }
  