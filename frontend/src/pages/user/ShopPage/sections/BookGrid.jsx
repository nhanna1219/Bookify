import React from 'react'
import ProductCard from '@u_components/products/ProductCard'

export default function BookGrid({ books, currentBooks, clearAllFilters }) {
    if (!books.length) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900">No books found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
                <button
                    onClick={clearAllFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Clear all filters
                </button>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentBooks.map(book=>(
                <div key={book.id}><ProductCard product={book}/></div>
            ))}
        </div>
    )
}
