import React from 'react'
import ConditionFilter from './ConditionFilter'
import RatingFilter from './RatingFilter'
import PriceRangeFilter from './PriceRangeFilter'
import GenreFilter from './GenreFilter'
import SortBySelect from './SortBySelect'

export default function FiltersSidebar(props) {
    const {
        condition, setCondition, showAllConditions, toggleShowAllConditions,
        minRating, setMinRating, showAllRatings, toggleShowAllRatings,
        priceRange, setPriceRange,
        genres, selectedGenres, handleGenreChange,
        sortBy, setSortBy,
        mobileFiltersOpen
    } = props

    return (
        <div
            className={`w-full md:w-58 shrink-0 rounded-lg p-8 h-fit bg-[#F4F4F4] border-gray-400 drop-shadow-lg border-2 md:block md:top-16 ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
            <ConditionFilter
                condition={condition} setCondition={setCondition}
                showAll={showAllConditions} toggleShowAll={toggleShowAllConditions}
            />
            <div className="h-px bg-gray-200 my-4"></div>
            <RatingFilter
                minRating={minRating} setMinRating={setMinRating}
                showAll={showAllRatings} toggleShowAll={toggleShowAllRatings}
            />
            <div className="h-px bg-gray-200 my-4"></div>
            <PriceRangeFilter priceRange={priceRange} setPriceRange={setPriceRange}/>
            <div className="h-px bg-gray-200 my-4"></div>
            <GenreFilter genres={genres} selectedGenres={selectedGenres} handleGenreChange={handleGenreChange}/>
            <div className="h-px bg-gray-200 my-4"></div>
            <SortBySelect sortBy={sortBy} setSortBy={setSortBy}/>
        </div>
    )
}