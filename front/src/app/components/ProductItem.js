'use client';

const ProductItem = ({ product, onEdit, onDelete, onShowDetails }) => {
  return (
    <tr
      className="border-b hover:bg-gray-50 cursor-pointer"
      onClick={() => onShowDetails(product)}
    >
      <td className="border border-gray-300 px-4 py-2">{product.name}</td>
      <td className="border border-gray-300 px-4 py-2">{product.category}</td>
      <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
      <td className="border border-gray-300 px-4 py-2">{product.unitPrice} zł</td>
      <td className="border border-gray-300 px-4 py-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(product);
          }}
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
        >
          Edytuj
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product.id);
          }}
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2"
        >
          Usuń
        </button>
      </td>
    </tr>
  );
};

export default ProductItem;
