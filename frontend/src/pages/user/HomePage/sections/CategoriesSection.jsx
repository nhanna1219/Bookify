import { useKeenSlider } from "keen-slider/react"
import { Layers } from 'lucide-react'
import { useState } from "react"
import { Link } from "react-router-dom"

const getCategoryColor = (index) => {
    const colors = [
        "#1C387F",  // Dark Blue
        "#3B5998",  // Medium Blue
        "#5D76B5",  // Soft Blue
        "#8496C8",  // Light Blue
        "#2C5282",  // Deep Navy
        "#553C9A",  // Dark Purple
        "#805AD5",  // Medium Purple
        "#285E61",  // Teal Blue
        "#4A5568",  // Charcoal Gray
        "#2D3748",  // Deep Gray
        "#4C51BF",  // Indigo
        "#6B46C1",  // Vivid Purple
        "#3182CE",  // Sky Blue
        "#63B3ED",  // Light Sky Blue
        "#4299E1",  // Bright Blue
        "#2B6CB0",  // Darker Blue
        "#2A4365",  // Navy
        "#667EEA",  // Soft Indigo
        "#9F7AEA",  // Light Purple
        "#B794F4",  // Pastel Purple
    ]

    return colors[index % colors.length]
}

// Animation configuration
const animation = { duration: 15000, easing: (t) => t }

const CategorySlider = ({ categories }) => {
    const [loaded, setLoaded] = useState(false)

    const [sliderRef, instanceRef] = useKeenSlider(
        {
            loop: true,
            renderMode: "performance",
            slides: {
                perView: 5,
                spacing: 24,
            },
            breakpoints: {
                "(max-width: 640px)": {
                    slides: { perView: 1.2, spacing: 16 },
                },
                "(max-width: 768px)": {
                    slides: { perView: 2.2, spacing: 16 },
                },
                "(max-width: 1024px)": {
                    slides: { perView: 3.2, spacing: 20 },
                },
                "(max-width: 1280px)": {
                    slides: { perView: 4, spacing: 20 },
                },
            },
            created(slider) {
                setLoaded(true)
                slider.moveToIdx(5, true, animation)
            },
            updated(slider) {
                slider.moveToIdx(slider.track.details.abs + 5, true, animation)
            },
            animationEnded(slider) {
                slider.moveToIdx(slider.track.details.abs + 5, true, animation)
            },
        }
    )

    return (
        <div className="max-w-6xl mx-auto px-6 py-18">
            <div className="text-center mb-10">
                <h2 className="inline-flex items-center gap-3 px-8 py-3 border-2 border-transparent rounded-full text-white font-bold uppercase tracking-wide text-xl
               bg-gradient-to-r from-[#1C387F] to-[#805AD5] shadow-lg hover:from-[#805AD5] hover:to-[#1C387F] transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                    <Layers className="w-6 h-6" />
                    Browse by Category
                </h2>

                <p className="text-gray-600 max-w-2xl mx-auto mt-4">
                    Explore our extensive collection organized by genres to find your next favorite read.
                </p>
            </div>

            <div className="relative">
                <div ref={sliderRef} className="keen-slider">
                    {categories.map((category, idx) => (
                        <Link
                            key={category.id}
                            to={`/shop?genres=${encodeURIComponent(category.id)}`}
                            className="keen-slider__slide px-1 py-2"
                        >
                            <div
                                className="rounded-xl overflow-hidden h-72 relative cursor-pointer shadow-md transform transition-all duration-300 ease-in-out hover:scale-105"
                                style={{ backgroundColor: getCategoryColor(idx) }}
                            >
                                <div className="absolute top-6 left-6 text-white/90">
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
                                        <line x1="8" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div className="absolute top-6 right-6">
                        <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                            {category.bookCount} {category.bookCount === 1 ? "book" : "books"}
                        </span>
                                </div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default CategorySlider
