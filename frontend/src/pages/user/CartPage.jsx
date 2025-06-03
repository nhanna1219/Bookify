import {useContext, useMemo, useCallback, useEffect} from 'react'
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
import {CheckoutContext} from '@contexts/CheckoutContext.jsx'

export default function CartPage() {
    const {auth} = useContext(AuthContext)
    const {selectedItems, totals, setSelectedItems} = useContext(CheckoutContext)
    const qc = useQueryClient()
    const {data: cartItems = [], isLoading} = useCartData()
    const navigate = useNavigate()

    const cartKey = useMemo(() => ['cart', auth?.user?.id ?? 'guest'], [auth])

    useEffect(() => {
        if (!cartItems.length || !selectedItems.length) return
        let needsUpdate = false
        const updatedSelection = selectedItems.map(selected => {
            const cartItem = cartItems.find(i => i.bookId === selected.bookId)
            if (cartItem && cartItem.quantity !== selected.quantity) {
                needsUpdate = true
                return { ...selected, quantity: cartItem.quantity }
            }
            return selected
        })

        if (needsUpdate) {
            setSelectedItems(updatedSelection)
        }
    }, [cartItems, selectedItems, setSelectedItems])


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
            ).then(() => {
                invalidate()
                setSelectedItems(prev =>
                    prev.map(item =>
                        item.bookId === id ? { ...item, quantity: newQty } : item
                    )
                )
            })
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
            ).then(() => {
                invalidate()
                setSelectedItems(prev => prev.filter(item => item.bookId !== id))
            })
        },
        [callService, invalidate, setSelectedItems]
    )

    const handleClearAll = useCallback(() => {
        showPromise(
            () => callService(clearGuestCart, clearCart),
            {
                loading: 'Clearing cart...',
                success: 'Cart cleared',
                error: err => err?.response?.data?.error || 'Failed to clear cart',
            }
        ).then(() => {
            invalidate()
            setSelectedItems([])
        })
    }, [callService, invalidate, setSelectedItems])

    const handleBulkRemove = useCallback(() => {
        const ids = selectedItems.map(i => i.bookId)
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
        ).then(() => {
            invalidate()
            setSelectedItems([])
        })
    }, [selectedItems, callService, invalidate, setSelectedItems])

    const toggleSelection = useCallback(
        id => {
            const item = cartItems.find(i => i.bookId === id)
            if (!item) return
            setSelectedItems(prev => {
                const exists = prev.some(x => x.bookId === id)
                if (exists) {
                    return prev.filter(x => x.bookId !== id)
                }
                return [...prev, item]
            })
        },
        [cartItems, setSelectedItems]
    )

    const selectAll = useCallback(() => {
        if (cartItems.length === 0) return
        const allIds = cartItems.map(i => i.bookId)
        const selectedIds = selectedItems.map(i => i.bookId)
        const isAllSelected = allIds.every(id => selectedIds.includes(id))
        if (isAllSelected) {
            setSelectedItems([])
        } else {
            setSelectedItems([...cartItems])
        }
    }, [cartItems, selectedItems, setSelectedItems])

    const {itemsCount, subtotal, shipping, taxes, discount, total} = totals

    const goToCheckout = useCallback(() => {
        if (selectedItems.length === 0) return
        navigate('/checkout')
    }, [navigate, selectedItems])

    if (isLoading) return <LoadingScreen/>

    if (cartItems.length === 0) {
        return (
            <>
                <HeaderBreadcrumb
                    title="Your Cart"
                    crumbs={[
                        {name: 'Home', path: '/'},
                        {name: 'Shop', path: '/shop'},
                        {name: 'Cart', path: '/cart'},
                    ]}
                />
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
            <HeaderBreadcrumb
                title="Your Cart"
                crumbs={[
                    {name: 'Home', path: '/'},
                    {name: 'Shop', path: '/shop'},
                    {name: 'Cart', path: '/cart'},
                ]}
            />
            <div className="max-w-screen-xl mx-auto py-12">
                <div className="grid lg:grid-cols-7 gap-8">
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-lg border-2 border-[#BFBEBE] drop-shadow-xl overflow-hidden">
                            <div className="bg-[#1C387F] text-white px-6 py-4">
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-1">
                                        <input
                                            type="checkbox"
                                            checked={
                                                cartItems.length > 0 &&
                                                cartItems.every(i =>
                                                    selectedItems.some(si => si.bookId === i.bookId)
                                                )
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
                            <div className="divide-y divide-gray-200">
                                {cartItems.map(item => (
                                    <div key={item.bookId} className="px-6 py-4">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.some(si => si.bookId === item.bookId)}
                                                    onChange={() => toggleSelection(item.bookId)}
                                                    className="w-4 h-4 text-[#1C387F] bg-gray-100 border-gray-300 rounded accent-[#1C387F] cursor-pointer"
                                                />
                                            </div>
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
                                            <div className="col-span-2 text-center font-semibold">
                                                ${item.price.toFixed(2)}
                                            </div>
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
                                            <div className="col-span-2 text-center font-semibold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                onClick={handleClearAll}
                                className="text-[#1C387F] hover:text-[#1C387F]/80 hover:bg-[#1C387F]/10 px-4 py-2 rounded transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                    <aside className="lg:col-span-2 sticky top-8">
                        <OrderSummary
                            itemsCount={itemsCount}
                            subtotal={subtotal}
                            shipping={shipping}
                            taxes={taxes}
                            discount={discount}
                            total={total}
                            goToCheckout={goToCheckout}
                        />
                    </aside>
                </div>
            </div>
        </>
    )
}
