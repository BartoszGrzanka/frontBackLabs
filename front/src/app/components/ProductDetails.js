export default function ProductDetails({ product, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">{product.name}</h2>
        <p>Kategoria: {product.category}</p>
        <p>Ilość: {product.quantity}</p>
        <p>Cena: {product.unitPrice} zł</p>
        <p>Data dodania: {product.addedDate}</p>
        <p>Dostawca: {product.supplier}</p>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Zamknij
        </button>
      </div>
    </div>
  )
}
