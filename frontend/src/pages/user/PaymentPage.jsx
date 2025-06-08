import {useState, useEffect, useContext, useMemo, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {useQueryClient} from '@tanstack/react-query'
import {HandCoins, CheckCircle2} from 'lucide-react'

import CheckoutProgress from '@u_components/checkout/CheckoutProgress.jsx'
import OrderSummary from '@u_components/checkout/OrderSummary.jsx'
import {showError, showPromise} from '@utils/toast.js'
import {payWithCOD, payWithMomo} from '@u_services/orderService.js'
import {AuthContext} from '@contexts/AuthContext.jsx'
import {CheckoutContext} from '@contexts/CheckoutContext.jsx'

import {MomoBrandLogo, VNPayBrandLogo} from '@u_components/checkout/PaymentLogos.jsx'

const paymentMethods = [
    {
        id: 'cod',
        name: 'Cash on Delivery (COD)',
        description: 'Pay with cash when your order is delivered.',
        icon: HandCoins,
        disabled: false,
    },
    {
        id: 'momo',
        name: 'Momo E-Wallet',
        description: 'Pay securely using your Momo account.',
        icon: MomoBrandLogo,
        disabled: false,
    },
    {
        id: 'vnpay',
        name: 'VNPAY',
        description: 'Pay with Card, Bank Transfer, or VNPay QR.',
        icon: VNPayBrandLogo,
        disabled: true,
        tooltip: 'VNPAY is not supported at the moment.',
    },
]

const transformAddress = ({
                              firstName,
                              lastName,
                              email,
                              phoneNumber,
                              street,
                              city,
                              state,
                              postalCode,
                              country,
                          }) => ({
    firstName,
    lastName,
    email,
    phoneNumber,
    address: {street, city, state, postalCode, country},
})

export default function PaymentPage() {
    const {auth} = useContext(AuthContext)
    const {
        selectedItems,
        totals: {itemsCount, subtotal, shipping, taxes, discount, total},
        shippingAddress,
        orderCompleted,
        setOrderCompleted,
        setSelectedItems,
    } = useContext(CheckoutContext)
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const cartKey = useMemo(() => ['cart', auth?.user?.id || 'guest'], [auth])
    const invalidateCart = useCallback(() => {
        queryClient.invalidateQueries({queryKey: cartKey})
    }, [queryClient, cartKey])

    const [selectedMethod, setSelectedMethod] = useState('cod')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (orderCompleted || selectedItems.length === 0) {
            navigate('/cart', {replace: true})
        }
    }, [orderCompleted, selectedItems.length, navigate])

    const handlePayment = useCallback(async () => {
        if (!selectedMethod) {
            showError('Please select a payment method.')
            return
        }

        setLoading(true)
        const payload = {
            items: selectedItems.map(({bookId, quantity}) => ({bookId, quantity})),
            paymentInfo: {method: selectedMethod},
            shippingInformation: transformAddress(shippingAddress || {}),
        }

        try {
            if (selectedMethod === 'cod') {
                const {data} = await showPromise(payWithCOD(payload), {
                    loading: 'Processing...',
                    success: 'Order created successfully.',
                    error: 'Failed to place order. Please try again.',
                }, {throwOnError: true})

                invalidateCart()
                navigate('/order-confirmation', {
                    replace: true,
                    state: {orderDetails: data, paymentMethod: selectedMethod},
                })
            } else if (selectedMethod === 'momo') {
                const {data} = await showPromise(payWithMomo(payload), {
                    loading: 'Processing...',
                    success: 'Redirecting to MoMo...',
                    error: 'Failed to initiate MoMo payment. Please try again.',
                }, {throwOnError: true})

                invalidateCart()

                sessionStorage.setItem('checkout_shippingAddress', JSON.stringify(shippingAddress))
                window.location.href = data.payUrl
            } else {
                showError('Invalid payment method!')
                navigate('/cart', {replace: true})
            }
        } catch (err) {
            console.error(err)
            showError(err?.response?.data?.error || 'Payment failed. Try again.')
        } finally {
            setLoading(false)
        }
    }, [selectedMethod, selectedItems, shippingAddress, invalidateCart, navigate, setSelectedItems, setOrderCompleted])

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <CheckoutProgress step="payment"/>
                <h1 className="text-3xl font-bold text-[#1C387F] mt-8 mb-6 text-center sm:text-left">
                    Payment Options
                </h1>
                <div className="grid lg:grid-cols-7 gap-8 py-4">
                    <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1 pb-3 border-b border-gray-200">
                            Choose your payment method
                        </h2>
                        <div className="space-y-4">
                            {paymentMethods.map(({id, name, description, icon: Icon, disabled, tooltip}) => {
                                const isSelected = selectedMethod === id
                                return (
                                    <div
                                        key={id}
                                        role="radio"
                                        aria-checked={isSelected}
                                        tabIndex={loading || disabled ? -1 : 0}
                                        onClick={() => !loading && !disabled && setSelectedMethod(id)}
                                        onKeyPress={e => {
                                            if (!loading && !disabled && (e.key === 'Enter' || e.key === ' ')) {
                                                setSelectedMethod(id)
                                            }
                                        }}
                                        title={disabled ? tooltip : undefined}
                                        className={`
                      group p-5 border rounded-lg flex justify-between items-center transition-all
                      ${isSelected
                                            ? 'border-2 border-[#1C387F] bg-[#EBF0FF] shadow-md'
                                            : 'border-gray-300 hover:border-gray-400 bg-white'}
                      ${loading || disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                                    >
                                        <div className="flex items-center">
                                            <Icon className="w-auto h-10 sm:h-12 max-w-[100px] mr-4 shrink-0"/>
                                            <div>
                                                <h3 className={`text-md sm:text-lg font-semibold ${isSelected ? 'text-[#1C387F]' : 'text-gray-800'}`}>
                                                    {name}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-500">{description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center ml-2">
                                            {isSelected ? (
                                                <CheckCircle2 className="w-6 h-6 text-[#1C387F]"/>
                                            ) : (
                                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"/>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-200 text-right">
                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full sm:w-auto bg-[#1C387F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors focus:ring-4 focus:ring-[#1C387F]/30 disabled:opacity-60"
                            >
                                {loading
                                    ? 'Processing...'
                                    : selectedMethod === 'cod'
                                        ? 'Place Order'
                                        : selectedMethod === 'momo'
                                            ? 'Pay with MoMo'
                                            : 'Proceed to Payment'}
                            </button>
                        </div>
                    </div>
                    <aside className="lg:col-span-2">
                        <div className="sticky top-8">
                            <OrderSummary
                                itemsCount={itemsCount}
                                subtotal={subtotal}
                                shipping={shipping}
                                taxes={taxes}
                                discount={discount}
                                total={total}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
