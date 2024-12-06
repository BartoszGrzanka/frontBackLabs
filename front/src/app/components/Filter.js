'use client'

const Filter = ({ selectedCategory, setSelectedCategory, selectedPriceRange, setSelectedPriceRange, categories }) => {

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value)
  }

  const handlePriceRangeChange = (event) => {
    const { name, value } = event.target
    setSelectedPriceRange(prevState => ({
      ...prevState,
      [name]: parseFloat(value)
    }))
  }

  return (
    <div className="flex flex-col mb-6 space-y-4">
      {/* Kategorie */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="category" className="text-lg font-semibold">Wybierz kategorię:</label>
        <select
          id="category"
          value={selectedCategory || 'Wszystkie'} // Zapewnienie, że wartość jest zawsze zdefiniowana
          onChange={handleCategoryChange}
          className="p-2 border border-gray-300 rounded w-full"
        >
          <option value="Wszystkie">Wszystkie</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Zakres cen */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="priceRange" className="text-lg font-semibold">Wybierz przedział cenowy:</label>

        {/* Min cena */}
        <div className="flex justify-between items-center">
          <input
            type="range"
            name="minPrice"
            min="0"
            max="1000"
            step="1"
            value={selectedPriceRange?.minPrice ?? 0} // Zapewnienie wartości domyślnej (0), jeśli brak
            onChange={handlePriceRangeChange}
            className="w-full"
          />
          <span>{selectedPriceRange?.minPrice ?? 0} zł</span>
        </div>

        {/* Max cena */}
        <div className="flex justify-between items-center mt-4">
          <input
            type="range"
            name="maxPrice"
            min="0"
            max="1000"
            step="1"
            value={selectedPriceRange?.maxPrice ?? 1000} // Zapewnienie wartości domyślnej (1000), jeśli brak
            onChange={handlePriceRangeChange}
            className="w-full"
          />
          <span>{selectedPriceRange?.maxPrice ?? 1000} zł</span>
        </div>
      </div>
    </div>
  )
}

export default Filter
