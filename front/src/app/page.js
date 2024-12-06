'use client'

import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import ProductDetails from './components/ProductDetails'
import AddProductForm from './components/AddProductForm'
import EditProductForm from './components/EditProductForm'
import ProductList from './components/ProductList'
import Paginator from './components/Paginator'
import { useFetch } from './components/ProductFetcher'

export default function Home() {
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie')
  const [selectedPriceRange, setSelectedPriceRange] = useState({ minPrice: 0, maxPrice: 1000 })
  const [categories, setCategories] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { data: products, loading, error, deleteProduct, updateProduct } = useFetch('http://localhost:8080/products')

  useEffect(() => {
    if (products) {
      const productCategories = [...new Set(products.map((product) => product.category))]
      setCategories(productCategories)
      filterProducts(products)
    }
  }, [products, selectedCategory, selectedPriceRange])

  const filterProducts = (productsToFilter) => {
    const filtered = productsToFilter.filter((product) => {
      const categoryMatch =
        selectedCategory === 'Wszystkie' || product.category === selectedCategory
      const priceMatch =
        product.unitPrice >= selectedPriceRange.minPrice &&
        product.unitPrice <= selectedPriceRange.maxPrice
      return categoryMatch && priceMatch
    })

    const sortedProducts = filtered.sort((a, b) => a.unitPrice - b.unitPrice)
    setFilteredProducts(sortedProducts)
  }


  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const handleDelete = (productId) => {
    setFilteredProducts(prevProducts => prevProducts.filter((product) => product.id !== productId))
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setIsEditing(true)
  }

  const handleUpdateProduct = (updatedProduct) => {
    setFilteredProducts(prevProducts =>
      prevProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
    )
    setIsEditing(false);
    setSelectedProduct(null);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista Produktów</h1>

      <Filter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedPriceRange={selectedPriceRange}
        setSelectedPriceRange={setSelectedPriceRange}
        categories={categories}
      />

      {loading && <p>Ładowanie...</p>}
      {error && <p>Błąd podczas ładowania danych.</p>}
      {products && (
        <>
          <ProductList
            products={currentProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShowDetails={(product) => setSelectedProduct(product)}
            deleteProduct={deleteProduct}
          />
          <Paginator
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}

      {/* Wyświetlanie szczegółów produktu lub formularza edycji */}
      {selectedProduct && !isEditing && (
        <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {isEditing && (
        <EditProductForm
          product={selectedProduct}
          categories={categories}
          onUpdateProduct={handleUpdateProduct}
        />
      )}

      {/* Formularz dodawania nowego produktu */}
      <AddProductForm
        onAddProduct={(newProduct) => setFilteredProducts((prevProducts) => [...prevProducts, newProduct])}
        categories={categories}
      />
    </div>
  )
}
