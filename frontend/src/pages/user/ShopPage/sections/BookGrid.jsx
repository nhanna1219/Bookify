import React from 'react'
import ProductCard from '@u_components/products/ProductCard'

export default function BookGrid({ books, clearAllFilters, emptyContent, onRemoveBook, selectedIds = [], onToggleSelect }) {
    if (!books.length) {
        return emptyContent || (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-gray-400 drop-shadow-lg">
                <h3 className="text-lg font-medium text-gray-900">No books found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
                <button
                    onClick={clearAllFilters}
                    className="mt-4 px-4 py-2 bg-[#1C387F] text-white rounded-md hover:bg-[#394991] transition-colors"
                >
                    Clear all filters
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {books.map(book => (
                <div className="relative" key={book.id}>
                    <ProductCard
                        product={book}
                        onRemoveBook={onRemoveBook}
                        showCheckbox={!!onToggleSelect}
                        checked={selectedIds?.includes(book.id)}
                        onToggle={() => onToggleSelect(book.id)}
                    />
                </div>
            ))}
        </div>
    );
}
