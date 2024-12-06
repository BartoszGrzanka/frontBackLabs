import React from 'react'
import { FixedSizeList as List } from 'react-window'

const ProductList = ({ products, onEdit, onShowDetails, onDelete, deleteProduct }) => {
  const rowHeight = 60
  const listHeight = 300 
  const listWidth = '100%' 

  const handleDelete = async (productId) => {
    try {
      const deletedId = await deleteProduct(productId)
      if (deletedId) {
        onDelete(deletedId)
        alert('Produkt został usunięty')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Wystąpił błąd podczas usuwania produktu')
    }
  }

  const renderRow = ({ index, style }) => {
    const product = products[index]

    return (
      <div
        style={style}
        className="flex items-center border-b hover:bg-gray-50 cursor-pointer"
        onClick={() => onShowDetails(product)}
      >
        <div className="flex-1 border border-gray-300 px-4 py-2">{product.name}</div>
        <div className="flex-1 border border-gray-300 px-4 py-2">{product.category}</div>
        <div className="flex-1 border border-gray-300 px-4 py-2">{product.quantity}</div>
        <div className="flex-1 border border-gray-300 px-4 py-2">{product.unitPrice} zł</div>
        <div className="flex items-center border border-gray-300 px-4 py-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(product)
            }}
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
          >
            Edytuj
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(product.id)
            }}
            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2"
          >
            Usuń
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden"> {/* Zawijamy w kontener, by uniknąć problemów z overflow */}
      <List
        height={listHeight}
        itemCount={products.length}
        itemSize={rowHeight}
        width={listWidth}
      >
        {renderRow}
      </List>
    </div>
  )
}

export default ProductList
