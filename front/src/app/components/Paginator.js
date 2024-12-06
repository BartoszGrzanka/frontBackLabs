import React from 'react'

const Paginator = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const visiblePages = 5

  const generatePageNumbers = () => {
    let pages = [];
    
    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      let startPage = Math.max(currentPage - 2, 1)
      let endPage = Math.min(startPage + visiblePages - 1, totalPages)

      if (currentPage > 3) {
        pages.push(1)
        pages.push('...')
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages;
  };

  const pageNumbers = generatePageNumbers()

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1)
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1)
    }
  };

  const handlePageChange = (page) => {
    if (page !== '...') {
      setCurrentPage(page)
    }
  };

  return (
    <div className="flex justify-center space-x-4 my-4">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="p-2 bg-gray-300 rounded disabled:bg-gray-100"
      >
        Poprzednia
      </button>

      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(page)}
          className={`p-2 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="p-2 bg-gray-300 rounded disabled:bg-gray-100"
      >
        Następna
      </button>
    </div>
  )
}

export default Paginator
