import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import ConditionTag from './ConditionTag.jsx';
import WishlistBtn from "@u_components/products/WishlistBtn.jsx";
import RatingStar from "@u_components/products/RatingStar.jsx";
import {useCartActions} from "@u_hooks/useCartActions.js";
import {calcCartTotals} from "@utils/calCartTotals.js";
import {showError} from "@utils/toast.js";

const ProductCard = ({
                         product, scale = 0.9, onRemoveBook, showCheckbox = false, checked = false, onToggle = () => {
    }
                     }) => {
    const navigate = useNavigate();
    const authorName = product.authors?.[0] || "";
    const hasRating = product.ratingCount > 0;
    const ratingValue = hasRating ? product.averageRating : 0;
    const imageUrl = product.images?.[0]?.url || "/book-placeholder.jpg";

    let isOOS = product.stock < 1;

    const {addToCart} = useCartActions();

    const handleAddToCart = async () => {
        if (product.stock === 0) {
            showError(`"${product.title}" is out of stock!`);
            return;
        }

        const cartItem = {
            bookId: product.id,
            title: product.title,
            author: authorName,
            price: product.price,
            quantity: 1,
            image: imageUrl,
            condition: product.condition,
            stock: product.stock ?? 1,
        };
        await addToCart(cartItem);
    };

    const handleBuyNow = async () => {
        // Add to cart
        await handleAddToCart();
        const selectedItems = JSON.parse(localStorage.getItem("cart_selected") || '{}');
        const updateSelected = {
            ...selectedItems,
            [product.id]: true
        };
        localStorage.setItem("cart_selected", JSON.stringify(updateSelected));

        // Go to Buy Now
        const items = [{
            bookId: product.id,
            title: product.title,
            author: authorName,
            price: product.price,
            quantity: 1,
            image: imageUrl,
            condition: product.condition,
            stock: product.stock,
        }];
        const totals = calcCartTotals(items);

        if (sessionStorage.getItem('orderFlowCompleted') === 'true') {
            sessionStorage.removeItem('orderFlowCompleted');
        }

        navigate("/checkout", {
            state: {
                items,
                ...totals,
            }
        });
    };

    return (
        <div
            className="inline-block"
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left'
            }}
        >
            <div
                className="w-[220px] min-h-[400px] bg-[#F3F3F3] border border-[#BFBEBE] rounded-[5px] shadow-md hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300 ease-in-out p-4 flex flex-col gap-4 relative">

                {/* Condition Tag */}
                <div className="absolute top-3 left-3 z-10">
                    <ConditionTag type={product.condition}/>
                </div>

                {showCheckbox && (
                    <div
                        onClick={onToggle}
                        className={`absolute inset-0 z-20 rounded-[5px] ${checked ? 'ring-4 ring-[#1C387F]/60' : 'hover:ring-2 hover:ring-[#1C387F]/40'} transition cursor-pointer`}
                    />
                )}

                {/* Wishlist Button*/}
                <WishlistBtn bookId={product.id} onRemoveBook={onRemoveBook}/>

                {/* Clickable Product Link */}
                {!showCheckbox && (
                    <Link to={`/book/${product.id}`} className="absolute inset-0 z-80"/>
                )}

                {/* Book Image */}
                <div className="flex justify-center pt-11 relative z-0">
                    <img
                        src={imageUrl}
                        alt={product.title}
                        className="h-40 object-contain rounded shadow-xl drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)]"
                    />
                </div>

                {!showCheckbox ? (
                    <>
                        {/* Title & Author */}
                        <div className="text-center relative z-0">
                            <h3 className="text-sm font-semibold leading-tight">{product.title}</h3>
                            <p className="text-xs text-gray-500 font-medium mt-1">{authorName}</p>
                        </div>
                    </>
                ) : (
                    <Link to={`/book/${product.id}`} className="relative z-80">
                        <div className="text-center mt-2">
                            <h3 className="text-sm font-semibold leading-tight">{product.title}</h3>
                            <p className="text-xs text-gray-500 font-medium mt-1">{authorName}</p>
                        </div>
                    </Link>
                )}

                {/* Price & Rating */}
                <div className="flex items-center justify-between px-1 mt-2 relative z-0">
                    {hasRating && (
                        <RatingStar ratingValue={ratingValue}/>
                    )}
                    <p className="text-[#1C387F] font-semibold text-sm">
                        ${product.price ? product.price.toFixed(2) : 'N/A'}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-3 z-100">
                    {/* ADD TO CART */}
                    <div className="relative group flex-1">
                        <button
                            onClick={handleAddToCart}
                            disabled={isOOS}
                            className="w-full text-[10px] py-[7px] rounded-[10px] font-semibold border border-[#1C387F] text-[#1C387F] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.45)] transition-all duration-300 ease-in-out transform hover:bg-[#082b49] hover:border-[#082b49] hover:text-white hover:scale-105 hover:shadow-[0_4px_10px_rgba(0,0,0,0.50)] disabled:opacity-70 disabled:!cursor-not-allowed"
                        >
                            ADD TO CART
                        </button>
                        {isOOS && (
                            <span
                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-[100px] text-center px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Out of stock
                              </span>
                        )}
                    </div>

                    {/* BUY NOW */}
                    <div className="relative group flex-1">
                        <button
                            onClick={handleBuyNow}
                            disabled={isOOS}
                            className="w-full bg-[#1C387F] text-white text-[10px] py-[7px] rounded-[10px] font-semibold border border-[#1C387F] shadow-[0_2px_4px_rgba(0,0,0,0.45)] transition-all duration-300 ease-in-out transform hover:bg-[#162d66] hover:scale-105 hover:shadow-[0_4px_10px_rgba(0,0,0,0.50)] disabled:opacity-70 disabled:!cursor-not-allowed"
                        >
                            BUY NOW
                        </button>
                        {isOOS && (
                            <span
                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-[100px] text-center px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Out of stock
                          </span>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductCard;
