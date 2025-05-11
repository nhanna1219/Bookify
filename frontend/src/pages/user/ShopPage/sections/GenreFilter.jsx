import React from 'react'

export default function GenreFilter({allGenres, selectedGenres, handleGenreChange, genreCounts}) {
    return (
        <div className="mb-4">
            <h3 className="font-semibold mb-2 text-sm">Genre</h3>
            <div className="max-h-36 overflow-y-auto pr-1 space-y-1">
                {allGenres.map(genre => (
                    <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={selectedGenres.includes(genre)}
                               onChange={() => handleGenreChange(genre)}
                               className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500 accent-[#1C387F]"
                        />
                        <span className="text-xs">{genre}</span>
                        <span className="text-xs text-gray-500 ml-auto">{genreCounts[genre] || 0}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}