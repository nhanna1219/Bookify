import { useState } from "react";
import { MessageSquare, CheckCircle } from "lucide-react";
import { Rating, RoundedStar } from "@smastrom/react-rating";
import {reviews} from "@data/sampleData";
import "@smastrom/react-rating/style.css";

const ratingStyles = {
    itemShapes: RoundedStar,
    activeFillColor: "#FACC15",
    inactiveFillColor: "#CBD5E1",
    activeStrokeColor: "#D97706",
    inactiveStrokeColor: "#64748B",
    itemStrokeWidth: 1.5,
};

export default function CustomerReviewSection() {
    return (
        <section className="relative w-full py-16 px-4 bg-gray-50" aria-label="Customer Reviews">
            {/* Title Section */}
            <div className="text-center mb-10">
                <h2 className="inline-flex items-center gap-3 px-8 py-3 border-2 border-transparent rounded-full text-white font-bold uppercase tracking-wide text-xl
    bg-gradient-to-r from-[#1C387F] to-[#3B5998] shadow-lg hover:from-[#3B5998] hover:to-[#1C387F] transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                    <MessageSquare className="w-6 h-6 text-white" />
                    What Our Readers Say
                </h2>

                <p className="text-gray-600 max-w-2xl mx-auto mt-4">
                    Discover what our readers think about their favorite books.
                </p>
            </div>


            {/* Reviews Grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-lg shadow-md p-6 transition-transform transform hover:scale-105 hover:shadow-lg border border-gray-200 cursor-pointer"
                        >
                            <div className="flex items-start mb-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-gray-300">
                                    <img
                                        src={review.avatar || "../../assets/user-avatar.jpg"}
                                        alt={review.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "/placeholder.svg?height=48&width=48";
                                        }}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{review.name}</h3>
                                    <div className="flex items-center mt-1">
                                        <Rating
                                            style={{ maxWidth: 90 }}
                                            value={review.rating}
                                            readOnly
                                            itemStyles={ratingStyles}
                                        />
                                        <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-3">{review.text}</p>

                            <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-gray-600">Verified Purchase</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
