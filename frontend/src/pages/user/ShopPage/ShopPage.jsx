// src/pages/ShopPage/ShopPage.jsx
import {useEffect, useRef, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import HeaderBreadcrumb from '@u_components/shared/HeaderBreadcrumb'
import SearchAndCount from './sections/SearchAndCount'
import ActiveFilters from './sections/ActiveFilters'
import MobileFiltersToggle from './sections/MobileFiltersToggle'
import FiltersSidebar from './sections/FiltersSidebar'
import BookGrid from './sections/BookGrid'
import Pagination from './sections/Pagination'
import {books} from '@data/sampleData'

export default function ShopPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const isFirstUpdate = useRef(true)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 4

    const [condition, setCondition] = useState('')
    const [priceRange, setPriceRange] = useState([0, 200])
    const [selectedGenres, setSelectedGenres] = useState([])
    const [sortBy, setSortBy] = useState('title-az')
    const [titleAndAuthorFilter, setTitleAndAuthorFilter] = useState('')
    const [minRatingFilter, setMinRatingFilter] = useState(0)

    const [filteredBooks, setFilteredBooks] = useState(books)
    const [activeFilters, setActiveFilters] = useState([])
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [showAllConditions, setShowAllConditions] = useState(false)
    const [showAllRatings, setShowAllRatings] = useState(false)

    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
    const allGenres = [...new Set(books.flatMap(b => b.genre))].sort()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        if (params.get('condition')) setCondition(params.get('condition'))
        if (params.get('minPrice') || params.get('maxPrice')) {
            setPriceRange([
                Number(params.get('minPrice')) || 0,
                Number(params.get('maxPrice')) || 200,
            ])
        }
        if (params.get('genres')) setSelectedGenres(params.get('genres').split(','))
        if (params.get('sort')) setSortBy(params.get('sort'))
        if (params.get('search')) setTitleAndAuthorFilter(params.get('search'))
        if (params.get('minRating')) setMinRatingFilter(Number(params.get('minRating')))
        if (params.get('page')) setCurrentPage(Number(params.get('page')))
    }, [])

    useEffect(() => {
        let result = [...books]
        if (condition) result = result.filter(b => b.condition === condition)
        result = result.filter(b => b.price >= priceRange[0] && b.price <= priceRange[1])
        if (selectedGenres.length)
            result = result.filter(b => selectedGenres.some(g => b.genre.includes(g)))
        if (titleAndAuthorFilter) {
            const t = titleAndAuthorFilter.toLowerCase()
            result = result.filter(
                b => b.title.toLowerCase().includes(t) || b.author.toLowerCase().includes(t)
            )
        }
        if (minRatingFilter > 0) result = result.filter(b => b.rating >= minRatingFilter)

        switch (sortBy) {
            case 'newest':
                result.sort((a, b) => b.year - a.year)
                break
            case 'price-low':
                result.sort((a, b) => a.price - b.price)
                break
            case 'price-high':
                result.sort((a, b) => b.price - a.price)
                break
            case 'title-az':
                result.sort((a, b) => a.title.localeCompare(b.title))
                break
            case 'title-za':
                result.sort((a, b) => b.title.localeCompare(a.title))
                break
        }

        setFilteredBooks(result)
        setCurrentPage(1)
    }, [condition, priceRange, selectedGenres, sortBy, titleAndAuthorFilter, minRatingFilter])

    useEffect(() => {
        const af = []
        if (condition) af.push({type: 'condition', value: `Condition: ${condition}`})
        if (selectedGenres.length)
            af.push({type: 'genre', value: `Genres: ${selectedGenres.join(', ')}`})
        if (priceRange[0] !== 0 || priceRange[1] !== 200)
            af.push({type: 'price', value: `$${priceRange[0]} - $${priceRange[1]}`})
        if (titleAndAuthorFilter)
            af.push({type: 'title', value: `Search: ${titleAndAuthorFilter}`})
        if (minRatingFilter > 0)
            af.push({type: 'rating', value: `Rating: ${minRatingFilter}+`})
        setActiveFilters(af)
    }, [condition, selectedGenres, priceRange, titleAndAuthorFilter, minRatingFilter])

    useEffect(() => {
        if (isFirstUpdate.current) {
            isFirstUpdate.current = false
            return
        }
        const params = new URLSearchParams()
        if (condition) params.set('condition', condition)
        if (priceRange[0] !== 0) params.set('minPrice', priceRange[0].toString())
        if (priceRange[1] !== 200) params.set('maxPrice', priceRange[1].toString())
        if (selectedGenres.length) params.set('genres', selectedGenres.join(','))
        if (sortBy !== 'title-az') params.set('sort', sortBy)
        if (titleAndAuthorFilter) params.set('search', titleAndAuthorFilter)
        if (minRatingFilter > 0) params.set('minRating', minRatingFilter.toString())
        if (currentPage > 1) params.set('page', currentPage.toString())
        navigate(`/shop?${params.toString()}`, {replace: true})
    }, [condition, priceRange, selectedGenres, sortBy, titleAndAuthorFilter, minRatingFilter, currentPage])

    const genreCounts = books.reduce((acc, book) => {
        book.genre.forEach(g => {
            acc[g] = (acc[g] || 0) + 1;
        });
        return acc;
    }, {});

    const generatePaginationItems = () => {
        if (totalPages <= 5) return Array.from({length: totalPages}, (_, i) => i + 1)
        const pages = []
        pages.push(1)
        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)
        if (start > 2) pages.push('ellipsis1')
        for (let i = start; i <= end; i++) pages.push(i)
        if (end < totalPages - 1) pages.push('ellipsis2')
        pages.push(totalPages)
        return pages
    }

    const currentBooks = filteredBooks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleGenreChange = g =>
        setSelectedGenres(s =>
            s.includes(g) ? s.filter(x => x !== g) : [...s, g]
        )
    const removeFilter = type => {
        switch (type) {
            case 'condition':
                setCondition('')
                break
            case 'genre':
                setSelectedGenres([])
                break
            case 'price':
                setPriceRange([0, 200])
                break
            case 'title':
                setTitleAndAuthorFilter('')
                break
            case 'rating':
                setMinRatingFilter(0)
                break
        }
    }
    const clearAllFilters = () => {
        setCondition('')
        setSelectedGenres([])
        setPriceRange([0, 200])
        setSortBy('title-az')
        setTitleAndAuthorFilter('')
        setMinRatingFilter(0)
    }

    return (
        <div className="w-full mb-10">
            <HeaderBreadcrumb
                title="Book Shop"
                crumbs={[
                    {name: 'Home', path: '/'},
                    {name: 'Shop', path: '/shop'},
                ]}
            />
            <div className="max-w-screen-xl mx-auto px-4">
                <SearchAndCount
                    total={filteredBooks.length}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onSearchChange={setTitleAndAuthorFilter}
                    value={titleAndAuthorFilter}
                />
                <ActiveFilters
                    activeFilters={activeFilters}
                    removeFilter={removeFilter}
                    clearAll={clearAllFilters}
                />
                <MobileFiltersToggle
                    openCount={activeFilters.length}
                    mobileOpen={mobileFiltersOpen}
                    toggleMobile={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                />
                <div className="flex flex-col md:flex-row md:gap-6">
                    <FiltersSidebar
                        // Condition
                        condition={condition}
                        setCondition={setCondition}
                        showAllConditions={showAllConditions}
                        toggleShowAllConditions={() => setShowAllConditions(!showAllConditions)}

                        // Rating
                        minRating={minRatingFilter}
                        setMinRating={setMinRatingFilter}
                        showAllRatings={showAllRatings}
                        toggleShowAllRatings={() => setShowAllRatings(!showAllRatings)}

                        // Price Range
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}

                        // Genres
                        allGenres={allGenres}
                        selectedGenres={selectedGenres}
                        handleGenreChange={handleGenreChange}
                        genreCounts={genreCounts}

                        // Sort
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        mobileFiltersOpen={mobileFiltersOpen}
                    />
                    <div className="flex-1 ml-10">
                        <BookGrid
                            books={filteredBooks}
                            currentBooks={currentBooks}
                            clearAllFilters={clearAllFilters}
                        />
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            onPrev={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            onNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            generateItems={generatePaginationItems}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}