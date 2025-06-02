import {useContext, useMemo, useState, useCallback, useEffect} from 'react'
import {useQueryClient} from '@tanstack/react-query'
import {AuthContext} from '@contexts/AuthContext'
import {
    updateGuestQuantity,
    removeGuestItem,
    clearGuestCart,
    updateQuantity,
    removeItem,
    clearCart,
} from '@u_services/cartService'
import {useCartData} from '@u_hooks/useCartData'
import HeaderBreadcrumb from '@u_components/shared/HeaderBreadcrumb.jsx'
import ConditionTag from '@u_components/products/ConditionTag.jsx'
import {Minus, Plus, Trash2, ShoppingCart} from 'lucide-react'
import {Link, useNavigate} from 'react-router-dom'
import {showPromise} from '@utils/toast'
import LoadingScreen from '@u_components/shared/LoadingScreen.jsx'
import OrderSummary from '@u_components/checkout/OrderSummary.jsx'
import {calcCartTotals} from "@utils/calCartTotals.js";

export default function CartPage() {
    const {auth} = useContext(AuthContext)
    const qc = useQueryClient()
    const {data: cartItems = [], isLoading} = useCartData()
    const navigate = useNavigate()

    // Query Key
    const cartKey = useMemo(() => ['cart', auth?.user?.id ?? 'guest'], [auth])

    const MemoHeader = useMemo(
        () => (
            <HeaderBreadcrumb
                title="Your Cart"
                crumbs={[
                    {name: 'Home', path: '/'},
                    {name: 'Shop', path: '/shop'},
                    {name: 'Cart', path: '/cart'},
                ]}
            />
        ),
        []
    )

    const callService = useCallback(
        (guestFn, authFn, ...args) =>
            auth ? authFn(...args) : guestFn(localStorage.getItem('guestId'), ...args),
        [auth]
    )

    const invalidate = useCallback(
        () => qc.invalidateQueries({queryKey: cartKey}),
        [qc, cartKey]
    )

    const handleUpdateQuantity = useCallback(
        (id, newQty) => {
            if (newQty < 1) return
            showPromise(
                () => callService(updateGuestQuantity, updateQuantity, id, newQty),
                {
                    loading: 'Updating quantity...',
                    success: 'Quantity updated',
                    error: err => err?.response?.data?.message || 'Failed to update quantity',
                }
            ).then(invalidate)
        },
        [callService, invalidate]
    )

    const handleRemoveItem = useCallback(
        id => {
            showPromise(
                () => callService(removeGuestItem, removeItem, id),
                {
                    loading: 'Removing...',
                    success: 'Item removed',
                    error: err => err?.response?.data?.error || 'Failed to remove item',
                }
            ).then(invalidate)
            setSelected(prev => {
                const { [id]: _, ...rest } = prev;
                return rest;
            });
        },
        [callService, invalidate]
    )

    const handleClearAll = useCallback(() => {
        showPromise(
            () => callService(clearGuestCart, clearCart),
            {
                loading: 'Clearing cart...',
                success: 'Cart cleared',
                error: err => err?.response?.data?.error || 'Failed to clear cart',
            }
        ).then(invalidate)
        setSelected({})
    }, [callService, invalidate])

    const [selected, setSelected] = useState({})
    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('cart_selected') || '{}')
            if (!isLoading && cartItems.length === 0) {
                setSelected({})
            } else {
                setSelected(stored)
            }
        } catch {
            setSelected({})
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cart_selected', JSON.stringify(selected))
    }, [selected])

    const toggleSelection = useCallback(
        id => setSelected(prev => ({...prev, [id]: !prev[id]})),
        []
    )

    const selectAll = useCallback(() => {
        const allSelected = cartItems.every(i => selected[i.bookId])
        const newSel = {}
        cartItems.forEach(i => {
            newSel[i.bookId] = !allSelected
        })
        setSelected(newSel)
    }, [cartItems, selected])

    const handleBulkRemove = useCallback(() => {
        const ids = cartItems.filter(i => selected[i.bookId]).map(i => i.bookId)
        if (ids.length === 0) return

        showPromise(
            async () => {
                for (const id of ids) {
                    await callService(removeGuestItem, removeItem, id)
                }
            },
            {
                loading: 'Removing selected...',
                success: 'Selected removed',
                error: 'Failed to remove selected',
            }
        ).then(invalidate)

        setSelected({})
    }, [cartItems, selected, callService, invalidate])

    const selectedItems = useMemo(
        () => cartItems.filter(i => selected[i.bookId]),
        [cartItems, selected]
    )

    const subtotal = useMemo(
        () => selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
        [selectedItems]
    )

    const shipping = useMemo(
        () => (subtotal > 30 || selectedItems.length === 0 ? 0 : 15),
        [subtotal, selectedItems]
    )

    const taxes = useMemo(() => subtotal * 0.08, [subtotal])
    const saleDiscount = 0
    const total = useMemo(
        () => subtotal + shipping + taxes - saleDiscount,
        [subtotal, shipping, taxes, saleDiscount]
    )
    const goToCheckout = useCallback(() => {
        if (selectedItems.length === 0) return;

        // New Checkout
        if ( sessionStorage.getItem("orderFlowCompleted") === "true" ) {
            sessionStorage.removeItem("orderFlowCompleted");
        }

        const totals = calcCartTotals(selectedItems);
        navigate('/checkout', {
            state: {
                items: selectedItems,
                ...totals
            },
        })
    }, [navigate, selectedItems, subtotal, shipping, taxes, saleDiscount, total])

    if (isLoading) return <LoadingScreen/>

    if (cartItems.length === 0) {
        return (
            <>
                {MemoHeader}
                <div className="max-w-screen-lg mx-auto px-4 py-24">
                    <div className="text-center">
                        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Add some items to your cart to get started.
                        </p>
                        <Link
                            to="/shop"
                            className="bg-[#1C387F] hover:bg-[#1C387F]/90 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            {MemoHeader}
            <div className="max-w-screen-xl mx-auto py-12">
                <div className="grid lg:grid-cols-7 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-lg border-2 border-[#BFBEBE] drop-shadow-xl overflow-hidden">
                            {/* Table Header */}
                            <div className="bg-[#1C387F] text-white px-6 py-4">
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-1">
                                        <input
                                            type="checkbox"
                                            checked={
                                                cartItems.length > 0 &&
                                                cartItems.every(i => !!selected[i.bookId])
                                            }
                                            onChange={selectAll}
                                            className="w-4 h-4 text-white bg-transparent border-white rounded accent-white cursor-pointer"
                                        />
                                    </div>
                                    <div className="col-span-5 font-semibold">Product</div>
                                    <div className="col-span-2 font-semibold text-center">
                                        Unit Price
                                    </div>
                                    <div className="col-span-2 font-semibold text-center">
                                        Quantity
                                    </div>
                                    <div className="col-span-2 font-semibold text-center">
                                        Subtotal
                                    </div>
                                </div>
                            </div>

                            {/* Bulk Actions */}
                            {selectedItems.length > 0 && (
                                <div className="bg-blue-50 px-6 py-3 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">
                                          {selectedItems.length} item(s) selected
                                        </span>
                                        <button
                                            onClick={handleBulkRemove}
                                            className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            Remove Selected
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Cart Items */}
                            <div className="divide-y divide-gray-200">
                                {cartItems.map(item => (
                                    <div key={item.bookId} className="px-6 py-4">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            {/* Checkbox */}
                                            <div className="col-span-1">
                                                <input
                                                    type="checkbox"
                                                    checked={!!selected[item.bookId]}
                                                    onChange={() => toggleSelection(item.bookId)}
                                                    className="w-4 h-4 text-[#1C387F] bg-gray-100 border-gray-300 rounded accent-[#1C387F] cursor-pointer"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="col-span-5 flex items-center space-x-6">
                                                <img
                                                    src={item.image || '/placeholder.svg'}
                                                    alt={item.title}
                                                    className="w-18 h-24 object-cover rounded"
                                                />
                                                <div className="flex-1 py-3">
                                                    <Link to={`/book/${item.bookId}`}>
                                                        <h3 className="font-semibold text-gray-900 mb-1">
                                                            {item.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {item.author}
                                                    </p>
                                                    <ConditionTag type={item.condition}/>
                                                    {item.stock <= 10 && (
                                                        <span className="ml-4 text-xs text-red-600 font-semibold">
                                                          Only {item.stock} left!
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => handleRemoveItem(item.bookId)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 mt-3 rounded text-sm transition-colors flex items-center"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1"/> Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Unit Price */}
                                            <div className="col-span-2 text-center font-semibold">
                                                ${item.price.toFixed(2)}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="col-span-2 flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQuantity(item.bookId, item.quantity - 1)
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4"/>
                                                </button>
                                                <span className="w-8 text-center font-semibold">
                                                  {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQuantity(item.bookId, item.quantity + 1)
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4"/>
                                                </button>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="col-span-2 text-center font-semibold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Clear All button */}
                        <div className="mt-4 text-right">
                            <button
                                onClick={handleClearAll}
                                className="text-[#1C387F] hover:text-[#1C387F]/80 hover:bg-[#1C387F]/10 px-4 py-2 rounded transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <aside className="lg:col-span-2 sticky top-8">
                        <OrderSummary
                            itemsCount={selectedItems.reduce((total, r) => total + r.quantity, 0)}
                            subtotal={subtotal}
                            shipping={shipping}
                            taxes={taxes}
                            discount={saleDiscount}
                            total={total}
                            goToCheckout={goToCheckout}
                        />
                    </aside>
                </div>
            </div>
        </>
    )
}
