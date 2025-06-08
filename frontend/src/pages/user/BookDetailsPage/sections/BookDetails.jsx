import {useContext, useRef, useState} from "react"
import {Minus, Plus, ChevronLeft, ChevronRight} from "lucide-react"
import WishlistBtn from "@u_components/products/WishlistBtn.jsx";
import RatingStar from "@u_components/products/RatingStar.jsx";
import ConditionTag from "@u_components/products/ConditionTag.jsx";
import {useCartActions} from "@u_hooks/useCartActions.js";
import {showError} from "@utils/toast.js";
import {calcCartTotals} from "@utils/calCartTotals.js";
import {useNavigate} from "react-router-dom";
import {CheckoutContext} from "@contexts/CheckoutContext.jsx";

export default function BookDetails({bookDetails}) {
    const {
        id,
        title,
        authors,
        stock,
        condition,
        averageRating,
        ratingCount,
        categoryNames,
        price,
        images,
        description,
    } = bookDetails || {}

    const { addToCart } = useCartActions();
    const navigate = useNavigate();
    const {
        setSelectedItems
    } = useContext(CheckoutContext);

    const [quantity, setQuantity] = useState(1)
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const mainImage = images?.[currentImageIndex] || { url: "/book-placeholder.jpg", alt: title };
    const descRef = useRef(null);

    // Format Details
    const authorName = authors?.join(", ") || "";
    const genres = categoryNames.join(", ") || "";
    const hasRating = ratingCount > 0;
    let isOOS = stock < 1;

    const firstAuthor = authorName.split(',')?.[0].toString().trim();

    const handleAddToCart = async () => {
        if (stock === 0) {
            showError(`"${title}" is out of stock!`);
            return;
        }

        const cartItem = {
            bookId: id,
            title,
            author: firstAuthor,
            price,
            quantity,
            image: images?.[0].url,
            condition,
            stock,
        };
        await addToCart(cartItem);
    };

    const handleBuyNow = async () => {
        // Add to cart
        await handleAddToCart();

        // Go to Buy Now
        const item = {
            bookId: id,
            title,
            author: authorName,
            price,
            quantity: 1,
            image: images?.[0].url,
            condition,
            stock,
        };
        setSelectedItems([item]);
        navigate("/checkout");
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    const incrementQuantity = () => {
        setQuantity((prev) => (prev < stock ? prev + 1 : prev));
    };
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                {/* Left column - Book images */}
                <div className="md:col-span-4">
                    <div className="group border-2 border-gray-200 rounded-md overflow-hidden bg-[#f1f1f1ba] drop-shadow p-4 relative flex justify-center items-center w-full">
                        {/* Prev button */}
                        {images.length > 1 && (
                            <button
                                onClick={handlePrevImage}
                                className="hidden group-hover:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white border rounded-full p-1 shadow hover:bg-gray-100 transition"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}

                        {/* Main image */}
                        <div className={"absolute top-3 left-3"}>
                            <ConditionTag type={condition}/>
                        </div>
                        <img
                            src={mainImage.url}
                            alt={mainImage.alt}
                            onClick={() => setIsImageExpanded(true)}
                            className="object-contain max-h-[450px] h-[300px] p-10 cursor-zoom-in"
                        />
                        <WishlistBtn bookId={id}/>

                        {/* Next button */}
                        {images.length > 1 && (
                            <button
                                onClick={handleNextImage}
                                className="hidden group-hover:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white border rounded-full p-1 shadow hover:bg-gray-100 transition"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    <div className="flex space-x-3 mt-4 justify-center">
                        {images?.slice(0, 4).map((img, index) => (
                            <div
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className="border-2 border-gray-200 rounded-md overflow-hidden bg-[#f1f1f1ba] drop-shadow p-2 w-1/3 cursor-pointer hover:border-gray-400 transition-colors"
                            >
                                <img
                                    src={img?.url || "/data/book-placeholder.jpg"}
                                    alt={img?.alt || `Book image ${index + 1}`}
                                    className="object-contain w-full p-1 h-[100px]"
                                />
                            </div>
                        ))}
                    </div>

                </div>

                {/* Right column - Book details */}
                <div className="space-y-5 md:col-span-7">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-3xl font-semibold text-black">{title}</h1>
                        {!isOOS && (
                            <span
                                className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded shadow-xl drop-shadow-[0_3px_3px_rgba(0,0,0,0.4)]">
                                {stock} {stock > 1 ? 'items' : 'item'}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">{authorName}</span>
                        <span
                            className="bg-[#ffd58a] text-[#715c5c] text-[10px] font-semibold px-3 py-1 rounded shadow-xl drop-shadow-[0_3px_3px_rgba(0,0,0,0.4)]">
                            {genres}
                        </span>
                    </div>

                    {
                        hasRating &&
                        <div className="flex items-center">
                            <RatingStar ratingValue={averageRating}/>
                            <span
                                className="text-sm text-gray-500 ml-2">({ratingCount + (ratingCount > 1 ? ' reviews' : ' review')})</span>
                        </div>
                    }

                    <p className="text-gray-700 leading-relaxed">
                        {description.length
                            ? (
                                <>
                                    {description.slice(0, Math.floor(description.length > 400 ? description.length / 4 : description.length / 2)) + "..."}
                                    <button
                                        type="button"
                                        className="text-blue-600 hover:underline ml-1 font-medium"
                                        onClick={() => descRef.current?.scrollIntoView({behavior: "smooth"})}
                                    >
                                        See more
                                    </button>
                                </>
                            )
                            : ""}
                    </p>

                    <div className="text-2xl font-semibold text-[#1C387F]">${price.toFixed(2)}</div>


                    <div className="flex flex-col items-start space-y-5 max-w-md">
                        <div className="flex items-center space-x-7">
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                    disabled={quantity <= 1}
                                    onClick={decrementQuantity}
                                    className="px-4 py-3 hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:!cursor-not-allowed"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="w-4 h-4"/>
                                </button>
                                <span id={"book-qty"} className="px-4 py-2 min-w-[40px] text-sm text-center">{quantity}</span>
                                <button
                                    disabled={quantity >= stock}
                                    onClick={incrementQuantity}
                                    className="px-4 py-3 hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:!cursor-not-allowed"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="w-4 h-4"/>
                                </button>
                            </div>
                            <div className={"relative group"}>
                                <button
                                    onClick={handleBuyNow}
                                    className="bg-[#1C387F] text-white text-sm rounded-[10px] font-semibold border border-[#1C387F] shadow-[0_2px_4px_rgba(0,0,0,0.45)] transition-all duration-300 ease-in-out transform hover:bg-[#162d66] hover:scale-105 hover:shadow-[0_4px_10px_rgba(0,0,0,0.50)] w-[150px] h-[40px] disabled:opacity-70 disabled:!cursor-not-allowed"
                                    disabled={isOOS}
                                >
                                    BUY NOW
                                </button>
                                {isOOS && (
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[100px] text-center px-2 py-1 bg-black text-white text-xs rounded shadow hidden group-hover:block">
                                      Out of stock
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className={"relative group w-full max-w-[319px]"}>
                            <button
                                onClick={handleAddToCart}
                                className="rounded-[10px] font-semibold border border-[#1C387F] text-[#1C387F] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition-all duration-300 ease-in-out transform hover:bg-[#082b49] hover:border-[#082b49] hover:text-white hover:scale-105 hover:shadow-[0_2px_5px_rgba(0,0,0,0.50)] text-sm py-[10px] w-full max-w-[319px] disabled:opacity-70 disabled:!cursor-not-allowed"
                                disabled={isOOS}
                            >
                                ADD TO CART
                            </button>
                            {isOOS && (
                                <span
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black text-white text-xs rounded shadow hidden group-hover:block">
                                  Out of stock
                                </span>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* Description section */}
            <div className="mt-16" ref={descRef}>
                <h2 className="text-xl font-semibold mb-4 text-[#1C387F]">Description</h2>
                <div className="border border-gray-200 rounded-md p-6 bg-[#EDEDED] min-h-[150px]">
                    <p className="text-gray-700 leading-relaxed">{description}</p>
                </div>
            </div>

            {/* Expanded image */}
            {isImageExpanded && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                    onClick={() => setIsImageExpanded(false)}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setIsImageExpanded(false)}
                        className="absolute top-5 right-5 text-white text-2xl hover:text-red-400 transition"
                        aria-label="Close"
                    >
                        &times;
                    </button>

                    {/* Image container */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <img
                            src={mainImage.url}
                            alt={mainImage.alt}
                            className="max-w-[90vw] max-h-[90vh] object-contain cursor-default"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

