import {useState, useEffect, useContext, useMemo, useCallback} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useQueryClient} from '@tanstack/react-query';
import {HandCoins, CheckCircle2} from 'lucide-react';

import CheckoutProgress from '@u_components/checkout/CheckoutProgress.jsx';
import OrderSummary from '@u_components/checkout/OrderSummary.jsx';
import {showError, showPromise} from '@utils/toast.js';
import {payWithCOD, payWithMomo} from '@u_services/orderService.js';
import {AuthContext} from '@contexts/AuthContext.jsx';

import {MomoBrandLogo, VNPayBrandLogo} from '@u_components/checkout/PaymentLogos.jsx';

const paymentMethods = [
    {
        id: 'cod',
        name: 'Cash on Delivery (COD)',
        description: 'Pay with cash when your order is delivered.',
        icon: HandCoins
    },
    {id: 'momo', name: 'Momo E-Wallet', description: 'Pay securely using your Momo account.', icon: MomoBrandLogo},
    {id: 'vnpay', name: 'VNPAY', description: 'Pay with Card, Bank Transfer, or VNPay QR.', icon: VNPayBrandLogo}
];

const transformAddress = (addr) => ({
    firstName: addr.firstName,
    lastName: addr.lastName,
    email: addr.email,
    phoneNumber: addr.phoneNumber,
    address: {
        street: addr.street,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country
    }
});

export default function PaymentPage() {
    const {state: locationState} = useLocation();
    const navigate = useNavigate();
    const {auth} = useContext(AuthContext);
    const queryClient = useQueryClient();

    const cartKey = useMemo(() => ['cart', auth?.user?.id ?? 'guest'], [auth]);
    const invalidateCart = useCallback(() => queryClient.invalidateQueries({queryKey: cartKey}), [queryClient, cartKey]);

    const {
        items: cartItems,
        itemsCount = 0,
        subtotal = 0,
        shipping = 0,
        taxes = 0,
        discount = 0,
        total = 0,
        shippingAddress: flatShippingAddress = {}
    } = locationState || {};

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('orderFlowCompleted') === 'true') {
            navigate('/cart', {replace: true});
            return;
        }
        if (!locationState?.items?.length) {
            showError('Your session is invalid or cart is empty. Please start from your cart.');
            navigate('/cart', {replace: true});
        }
    }, [locationState, navigate]);

    const clearCheckoutStorage = () => {
        sessionStorage.removeItem('checkoutForm');
        sessionStorage.removeItem('checkoutUsingSaved');
        localStorage.removeItem('cart_selected');
    };

    const handleProceed = async () => {
        if (!selectedPaymentMethod) return showError('Please select a payment method.');
        setIsLoading(true);

        const orderPayload = {
            items: cartItems.map(({bookId, quantity}) => ({bookId, quantity})),
            paymentInfo: {method: selectedPaymentMethod},
            shippingInformation: transformAddress(flatShippingAddress)
        };

        if (selectedPaymentMethod === 'cod') {
            try {
                const response = await showPromise(payWithCOD(orderPayload), {
                    loading: 'Processing...',
                    success: 'Order created successfully.',
                    error: 'Failed to place order. Please try again.'
                }, {throwOnError: true});
                invalidateCart();
                clearCheckoutStorage();
                sessionStorage.setItem('orderFlowCompleted', 'true');
                navigate('/order-confirmation', {
                    replace: true,
                    state: {
                        orderDetails: response.data,
                        paymentMethod: selectedPaymentMethod,
                        shippingAddress: flatShippingAddress
                    }
                });
            } catch (err) {
                console.error(err);
                showError(err?.response?.data?.error || 'Order failed. Try again.');
            }
        } else if (selectedPaymentMethod === 'momo') {
            try {
                const response = await showPromise(payWithMomo(orderPayload), {
                    loading: 'Processing...',
                    success: 'Redirecting to MoMo...',
                    error: 'Failed to initiate MoMo payment. Please try again.'
                }, {throwOnError: true});
                const {payUrl} = response.data;
                invalidateCart();
                clearCheckoutStorage();
                sessionStorage.setItem('orderFlowCompleted', 'true');
                window.location.href = payUrl;
            } catch (err) {
                console.error(err);
                showError(err?.response?.data?.error || 'MoMo payment failed.');
            } finally {
                setIsLoading(false);
            }
        } else {
            navigate('/order-confirmation', {
                replace: true,
                state: {
                    ...locationState,
                    paymentMethod: selectedPaymentMethod,
                    orderDetails: {message: `Payment processing initiated for ${selectedPaymentMethod}`}
                }
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <CheckoutProgress step="payment"/>
                <h1 className="text-3xl font-bold text-[#1C387F] mt-8 mb-6 text-center sm:text-left">Payment
                    Options</h1>
                <div className="grid lg:grid-cols-7 gap-8 py-4">
                    <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1 pb-3 border-b border-gray-200">Choose
                            your payment method</h2>
                        <div className="space-y-4">
                            {paymentMethods.map(({id, name, description, icon: Icon}) => {
                                const isSelected = selectedPaymentMethod === id;
                                return (
                                    <div
                                        key={id}
                                        onClick={() => !isLoading && setSelectedPaymentMethod(id)}
                                        role="radio"
                                        aria-checked={isSelected}
                                        tabIndex={isLoading ? -1 : 0}
                                        onKeyPress={(e) => !isLoading && (e.key === 'Enter' || e.key === ' ') && setSelectedPaymentMethod(id)}
                                        className={`group p-5 border rounded-lg flex justify-between items-center cursor-pointer transition-all ${isSelected ? 'border-2 border-[#1C387F] bg-[#EBF0FF] shadow-md' : 'border-gray-300 hover:border-gray-400 bg-white'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="flex items-center">
                                            <Icon className="w-auto h-10 sm:h-12 max-w-[100px] mr-4 shrink-0"/>
                                            <div>
                                                <h3 className={`text-md sm:text-lg font-semibold ${isSelected ? 'text-[#1C387F]' : 'text-gray-800'}`}>{name}</h3>
                                                <p className="text-xs sm:text-sm text-gray-500">{description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center ml-2">
                                            {isSelected ? <CheckCircle2 className="w-6 h-6 text-[#1C387F]"/> :
                                                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-200 text-right">
                            <button
                                onClick={handleProceed}
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-[#1C387F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors focus:ring-4 focus:ring-[#1C387F]/30 disabled:opacity-60"
                            >
                                {isLoading
                                    ? 'Processing...'
                                    : selectedPaymentMethod === 'cod'
                                        ? 'Place Order'
                                        : selectedPaymentMethod === 'momo'
                                            ? 'Pay with MoMo'
                                            : 'Proceed to Payment'}
                            </button>
                        </div>
                    </div>
                    <aside className="lg:col-span-2">
                        <div className="sticky top-8">
                            <OrderSummary itemsCount={itemsCount} subtotal={subtotal} shipping={shipping} taxes={taxes}
                                          discount={discount} total={total}/>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
