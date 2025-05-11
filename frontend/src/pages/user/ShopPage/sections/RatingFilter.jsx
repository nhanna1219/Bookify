import React from 'react'
import {Rating, RoundedStar} from '@smastrom/react-rating'

const ratingStyles = {
    itemShapes: RoundedStar,
    activeFillColor: '#FACC15',
    inactiveFillColor: '#CBD5E1',
    activeStrokeColor: '#D97706',
    inactiveStrokeColor: '#64748B',
    itemStrokeWidth: 1.5,
}

export default function RatingFilter({minRating, setMinRating, showAll, toggleShowAll}) {
    const options = showAll ? [0, 5, 4, 3, 2, 1] : [0, 5, 4]
    return (
        <div className="mb-4">
            <h3 className="font-semibold mb-2 text-sm">Minimum Rating</h3>
            <div className="space-y-1">
                {options.map(value => (
                    <label key={value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="rating"
                            value={value}
                            checked={minRating === value}
                            onChange={() => setMinRating(value)}
                            className="w-3.5 h-3.5"
                        />
                        <span className="text-xs flex items-center">
                          {value === 0 ? 'Any' :
                              <Rating style={{maxWidth: 90}} value={value} readOnly itemStyles={ratingStyles}/>}
                        </span>
                    </label>
                ))}
                <button onClick={toggleShowAll} className="text-xs text-[#1C387F] font-medium hover:underline mt-1">
                    {showAll ? 'See less' : 'See more'}
                </button>
            </div>
        </div>
    )
}