import { useState, useEffect } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { useFetch } from './ProductFetcher'

const EditProductForm = ({ product, categories, onUpdateProduct }) => {
  const [formattedDate, setFormattedDate] = useState('')
  const { updateProduct, loading, error } = useFetch('http://localhost:8080/products/')

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
  }

  useEffect(() => {
    if (product.addedDate) {
      setFormattedDate(formatDate(product.addedDate)) 
    }
  }, [product.addedDate])

  const formik = useFormik({
    initialValues: {
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      unitPrice: product.unitPrice,
      addedDate: product.addedDate,
      supplier: product.supplier,
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'Nazwa musi mieć co najmniej 3 znaki').required('Wymagane'),
      category: Yup.string().oneOf(categories, 'Nieprawidłowa kategoria').required('Wymagane'),
      quantity: Yup.number().positive('Musi być liczbą dodatnią').required('Wymagane'),
      unitPrice: Yup.number().positive('Musi być liczbą dodatnią').required('Wymagane'),
      addedDate: Yup.date().required('Wymagane'),
      supplier: Yup.string().min(3, 'Musi mieć co najmniej 3 znaki').required('Wymagane'),
    }),
    onSubmit: async (values) => {
      const updatedProduct = { ...values, id: product.id }
      try {
        const updatedData = await updateProduct(product.id, updatedProduct)
        if (updatedData) {
          onUpdateProduct(updatedData) // Zaktualizowanie w komponentach nadrzędnych
        }
      } catch (error) {
        console.error('Błąd podczas aktualizacji produktu:', error)
      }
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="mb-6">
      {/* Nazwa */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nazwa:</label>
        <input
          type="text"
          name="name"
          className="w-full border rounded px-3 py-2"
          {...formik.getFieldProps('name')}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-sm">{formik.errors.name}</p>
        )}
      </div>

      {/* Kategoria */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Kategoria:</label>
        <select
          name="category"
          className="w-full border rounded px-3 py-2"
          {...formik.getFieldProps('category')}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {formik.touched.category && formik.errors.category && (
          <p className="text-red-500 text-sm">{formik.errors.category}</p>
        )}
      </div>

      {/* Ilość */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Ilość:</label>
        <input
          type="number"
          name="quantity"
          className="w-full border rounded px-3 py-2"
          {...formik.getFieldProps('quantity')}
        />
        {formik.touched.quantity && formik.errors.quantity && (
          <p className="text-red-500 text-sm">{formik.errors.quantity}</p>
        )}
      </div>

      {/* Cena */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Cena:</label>
        <input
          type="number"
          name="unitPrice"
          className="w-full border rounded px-3 py-2"
          {...formik.getFieldProps('unitPrice')}
        />
        {formik.touched.unitPrice && formik.errors.unitPrice && (
          <p className="text-red-500 text-sm">{formik.errors.unitPrice}</p>
        )}
      </div>

      {/* Data dodania */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Data dodania:</label>
        {/* input date oczekuje formatu yyyy-mm-dd, ale w formularzu możemy wyświetlić datę w formacie dd-mm-yyyy */}
        <input
          type="date"
          name="addedDate"
          className="w-full border rounded px-3 py-2"
          {...formik.getFieldProps('addedDate')}
        />
        {formik.touched.addedDate && formik.errors.addedDate && (
          <p className="text-red-500 text-sm">{formik.errors.addedDate}</p>
        )}
      </div>

      {/* Dostawca */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Dostawca:</label>
        <input
          type="text"
          name="supplier"
          className="w-full border rounded px-3 py-2"
          {...formik.getFieldProps('supplier')}
        />
        {formik.touched.supplier && formik.errors.supplier && (
          <p className="text-red-500 text-sm">{formik.errors.supplier}</p>
        )}
      </div>

      {/* Przycisk zatwierdzenia */}
      <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
        Zaktualizuj produkt
      </button>
    </form>
  )
}

export default EditProductForm
