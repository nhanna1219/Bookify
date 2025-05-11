// ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import ConditionTag from './ConditionTag.jsx';

import { Rating, RoundedStar } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

const ratingStyles = {
    itemShapes: RoundedStar,
    activeFillColor: '#FACC15',
    inactiveFillColor: '#CBD5E1',
    activeStrokeColor: '#D97706',
    inactiveStrokeColor: '#64748B',
    itemStrokeWidth: 1.5
};

const ProductCard = ({ product, scale = 0.9 }) => {
    const [liked, setLiked] = useState(false);

    const authorName = product.authors && product.authors.length > 0 ? product.authors[0] : "";

    const hasRating = product.ratingCount > 0;
    const ratingValue = hasRating ? product.averageRating : 0;

    const imageUrl = product.images && product.images.length > 0 ? product.images[0].url : "/book-placeholder.jpg";
    return (
        <div
            className="inline-block"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left'
            }}
        >
            <div className="w-[220px] min-h-[400px] bg-[#F3F3F3] border border-[#BFBEBE] rounded-[5px] shadow-md hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300 ease-in-out p-4 flex flex-col gap-4 relative group"
            >

                {/* Condition Tag */}
                <div className="absolute top-3 left-3 z-10">
                    <ConditionTag type={product.condition} />
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={() => setLiked(!liked)}
                    className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.45)] flex items-center justify-center z-20 transition-shadow duration-300 hover:scale-110 hover:shadow-[0_4px_10px_rgba(0,0,0,0.60)]"
                >
                    <Heart className={`w-4 h-4 ${liked ? 'text-red-500 fill-red-500' : 'text-black'}`} />
                </button>

                {/* Clickable Product Link */}
                <Link to={`/book/${product.id}`} className="absolute inset-0 z-10" />

                {/* Book Image */}
                <div className="flex justify-center pt-11 relative z-0">
                    <img
                        src={imageUrl}
                        alt={product.title}
                        className="h-40 object-contain rounded shadow-xl drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)]"
                    />
                </div>

                {/* Title & Author */}
                <div className="text-center relative z-0">
                    <h3 className="text-sm font-semibold leading-tight">{product.title}</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">{authorName}</p>
                </div>

                {/* Price & Rating */}
                <div className="flex items-center justify-between px-1 mt-2 relative z-0">
                    {hasRating && (
                        <Rating
                            style={{ maxWidth: 90 }}
                            value={ratingValue}
                            readOnly
                            itemStyles={ratingStyles}
                        />
                    )}
                    <p className="text-[#1C387F] font-semibold text-sm">
                        ${product.price ? product.price.toFixed(2) : 'N/A'}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-3 relative z-20">
                    <button className="flex-1 text-[10px] py-[7px] rounded-[10px] font-semibold border border-[#1C387F] text-[#1C387F] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.45)] transition-all duration-300 ease-in-out transform hover:bg-[#082b49] hover:border-[#082b49] hover:text-white hover:scale-105 hover:shadow-[0_4px_10px_rgba(0,0,0,0.50)]">
                        ADD TO CART
                    </button>

                    <button className="flex-1 bg-[#1C387F] text-white text-[10px] py-[7px] rounded-[10px] font-semibold border border-[#1C387F] shadow-[0_2px_4px_rgba(0,0,0,0.45)] transition-all duration-300 ease-in-out transform hover:bg-[#162d66] hover:scale-105 hover:shadow-[0_4px_10px_rgba(0,0,0,0.50)]">
                        BUY NOW
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
