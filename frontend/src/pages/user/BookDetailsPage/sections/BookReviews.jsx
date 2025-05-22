import { useState } from "react"
import RatingStar from "@u_components/products/RatingStar.jsx"

export default function BookReviews({ bookReview, ratingDistribution, setState }) {
    const averageRating = 4.8
    const totalReviews = 5
    const totalReviewCount = 24

    const [activeFilter, setActiveFilter] = useState("all")

    const reviews = [
        { id: 1, name: "Emily R", date: "Feb 12, 2025", rating: 5, title: "Deeply moving and insightful", content: "This memoir resonated with me on so many levels. Zauner's writing is beautiful and honest. Highly recommend!" },
        { id: 2, name: "JohnJohn", date: "Feb 12, 2025", rating: 5, title: "Deeply moving and insightful", content: "This memoir resonated with me on so many levels. Zauner's writing is beautiful and honest. Highly recommend!" },
        { id: 3, name: "Sarah T", date: "Feb 10, 2025", rating: 4, title: "Beautifully written memoir", content: "A touching exploration of family, identity, and grief. Zauner's prose is captivating and her story is both heartbreaking and uplifting." },
        { id: 4, name: "Michael K", date: "Feb 8, 2025", rating: 5, title: "Couldn't put it down", content: "I read this in one sitting. The way Zauner weaves together food, culture, and family relationships is masterful. A truly memorable read." },
    ]

    const filteredReviews = reviews.filter((review) =>
        activeFilter === "all" ? true : review.rating === Number(activeFilter)
    )

    return (
        <div className="max-w-6xl mx-auto mt-16">
            {/* Reviews Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold text-[#1C387F]">Customer Reviews</h2>
                <span className="font-semibold">{averageRating} out of {totalReviews}</span>
            </div>

            {/* Rating Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Rating Distribution */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-6">Rating Distribution</h3>
                    <div className="space-y-4">
                        {ratingDistribution.map(({ stars, count, percentage }) => (
                            <div key={stars} className="flex items-center space-x-1">
                                <div className="w-15 text-sm font-medium">{stars} star</div>
                                <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                                    <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <div className="w-8 text-right text-gray-600">{count}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-sm text-gray-600">Based on {totalReviewCount} reviews</div>
                </div>

                {/* Filter Buttons */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-6">Filter Reviews</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            className={`px-4 py-2 rounded-full border text-sm ${
                                activeFilter === "all"
                                    ? "bg-[#1C387F] text-white border-[#1C387F]"
                                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                            }`}
                            onClick={() => setActiveFilter("all")}
                        >
                            All Reviews
                        </button>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <button
                                key={star}
                                className={`px-4 py-2 rounded-full border text-sm ${
                                    activeFilter === String(star)
                                        ? "bg-[#1C387F] text-white border-[#1C387F]"
                                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                }`}
                                onClick={() => setActiveFilter(String(star))}
                            >
                                {star} Star
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Review List */}
            <div className="space-y-4 mb-20">
                {filteredReviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-md p-8 bg-white">
                        <div className="flex items-start justify-between mb-2">
                            <RatingStar ratingValue={review.rating} />
                            <div className="flex items-center space-x-4">
                                <span className="font-medium">{review.name}</span>
                                <span className="text-gray-500">{review.date}</span>
                            </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-4">{review.title}</h3>
                        <p className="text-gray-700 text-sm">{review.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
