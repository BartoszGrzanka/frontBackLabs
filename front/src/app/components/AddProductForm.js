import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useFetch } from './ProductFetcher'

export default function AddProductForm({ categories }) {
  const { addProduct, loading, error } = useFetch('http://localhost:8080/products')
  
  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      quantity: '',
      unitPrice: '',
      addedDate: '',
      supplier: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'Nazwa musi mieć co najmniej 3 znaki').required('Wymagane'),
      category: Yup.string()
        .oneOf(categories, 'Nieprawidłowa kategoria')
        .required('Wymagane'),
      quantity: Yup.number().positive('Musi być liczbą dodatnią').required('Wymagane'),
      unitPrice: Yup.number().positive('Musi być liczbą dodatnią').required('Wymagane'),
      addedDate: Yup.date().required('Wymagane'),
      supplier: Yup.string().min(3, 'Musi mieć co najmniej 3 znaki').required('Wymagane'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const newProduct = await addProduct(values)
        if (newProduct) {
          resetForm()
        }
      } catch (error) {
        console.error('Error adding product:', error)
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
          <option value="">Wybierz kategorię</option>
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

      {/* Cena jednostkowa */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Cena jednostkowa (zł):</label>
        <input
          type="number"
          name="unitPrice"
          className="w-full border rounded px-3 py-2"
          step="0.01"
          {...formik.getFieldProps('unitPrice')}
        />
        {formik.touched.unitPrice && formik.errors.unitPrice && (
          <p className="text-red-500 text-sm">{formik.errors.unitPrice}</p>
        )}
      </div>

      {/* Data dodania */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Data dodania:</label>
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

      <button
        type="submit"
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        disabled={loading}
      >
        {loading ? 'Dodawanie...' : 'Dodaj produkt'}
      </button>

      {error && <p className="text-red-500 text-sm mt-4">{error.message}</p>}
    </form>
  )
}
