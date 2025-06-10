import {useContext, useEffect} from 'react';
import {useLocation, useNavigate, Link} from 'react-router-dom';
import CheckoutProgress from '@u_components/checkout/CheckoutProgress.jsx';
import {CheckCircle, Package, CreditCard, ShoppingBag, MapPin} from 'lucide-react';
import {CheckoutContext} from '@contexts/CheckoutContext.jsx';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return dateString;
    }
};

const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
};

const statusTagColors = {
    PENDING: {text: 'text-orange-700', bgColor: 'rgba(251, 191, 36, 0.1)'},
    PROCESSING: {text: 'text-blue-700', bgColor: 'rgba(59, 130, 246, 0.1)'},
    SUCCESSFUL: {text: 'text-green-700', bgColor: 'rgba(34, 197, 94, 0.1)'},
    FAILED: {text: 'text-red-700', bgColor: 'rgba(239, 68, 68, 0.1)'},
    UNKNOWN: {text: 'text-purple-700', bgColor: 'rgba(168, 85, 247, 0.1)'},
};

export default function OrderConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        setSelectedItems,
        shippingAddress: flatShippingAddress,
        setShippingAddress,
        setUsingSaved,
        setOrderCompleted,
    } = useContext(CheckoutContext);

    const {orderDetails, paymentMethod} = location.state || {};

    useEffect(() => {
        setSelectedItems([]);
        setUsingSaved(false);
        setOrderCompleted(true);

        if (!orderDetails || !orderDetails.id || !flatShippingAddress) {
            navigate('/', {replace: true});
            return;
        }

        return () => {
            setShippingAddress(null);
        }
    }, [
        flatShippingAddress,
        orderDetails,
        navigate,
    ]);

    if (!orderDetails || !orderDetails.id || !flatShippingAddress) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-100">
                <p className="text-lg text-gray-700">
                    Loading order details or invalid access...
                </p>
            </div>
        );
    }

    const itemsSubtotal = orderDetails.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shippingAndTaxes = orderDetails.totalAmount - itemsSubtotal;

    const transactions = orderDetails.payment?.transactions || [];
    const latestTransaction = transactions
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
    const paymentStatus = latestTransaction ? latestTransaction.status : 'UNKNOWN';

    const paymentColorClasses =
        statusTagColors[paymentStatus] || statusTagColors.UNKNOWN;

    const currentOrderStatus = orderDetails.orderStatus || 'UNKNOWN';
    const orderStatusColorClasses =
        statusTagColors[currentOrderStatus] || statusTagColors.UNKNOWN;

    return (
        <div className="bg-slate-100 min-h-screen py-12 md:py-16">
            <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
                <CheckoutProgress step="confirmation"/>

                <div className="bg-white shadow-2xl rounded-lg p-6 sm:p-8 md:p-12 mt-8">
                    <div className="text-center border-b border-gray-200 pb-8 mb-10">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-5"/>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C387F]">
                            Thank You For Your Order!
                        </h1>
                        <p className="text-base text-gray-600 mt-3">
                            Your order has been placed successfully.
                        </p>
                        <p className="text-lg text-gray-800 font-semibold mt-4">
                            Order ID:{' '}
                            <span className="text-[#1C387F]">{orderDetails.id}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Order Date: {formatDate(orderDetails.addedAt)}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-7 gap-x-8 gap-y-10">
                        <div className="lg:col-span-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center justify-between">
                <span className="flex items-center text-[#1C387F]">
                  <Package size={24} className="mr-3 "/> Order
                  Summary
                </span>
                                <span
                                    className={`text-base font-semibold px-3 py-1 rounded-full ${orderStatusColorClasses.text}`}
                                    style={{backgroundColor: orderStatusColorClasses.bgColor}}
                                >
                  {currentOrderStatus}
                </span>
                            </h2>
                            <div className="space-y-4 mb-8 max-h-[30rem] overflow-y-auto pr-3 custom-scrollbar">
                                {orderDetails.items.map((item, index) => (
                                    <div
                                        key={item.bookId || index}
                                        className="flex items-start justify-between p-4 bg-slate-50 rounded-md shadow-sm"
                                    >
                                        <div className="flex items-start">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-16 h-20 object-cover rounded mr-4 border border-gray-200"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-700 text-sm leading-tight">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Qty: {item.quantity} × {formatCurrency(item.price)}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-800 text-sm whitespace-nowrap">
                                            {formatCurrency(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3 text-sm border-t border-gray-200 pt-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium text-gray-800">
                    {formatCurrency(itemsSubtotal)}
                  </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping & Taxes:</span>
                                    <span className="font-medium text-gray-800">
                    {formatCurrency(shippingAndTaxes)}
                  </span>
                                </div>
                                <div
                                    className="flex justify-between text-lg font-bold text-[#1C387F] mt-2 pt-2 border-t border-dashed">
                                    <span>Grand Total:</span>
                                    <span>{formatCurrency(orderDetails.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3 space-y-8">
                            <div>
                                <h2 className="text-xl font-semibold text-[#1C387F] mb-5 flex items-center">
                                    <MapPin size={24} className="mr-3"/> Shipping
                                    Address
                                </h2>
                                <div
                                    className="text-sm text-gray-700 bg-slate-50 p-5 rounded-md shadow-sm leading-relaxed">
                                    <p className="font-semibold text-[#1C387F]">
                                        {flatShippingAddress.firstName}{' '}
                                        {flatShippingAddress.lastName}
                                    </p>
                                    <p>{flatShippingAddress.street}</p>
                                    <p>
                                        {flatShippingAddress.city}, {flatShippingAddress.state}{' '}
                                        {flatShippingAddress.postalCode}
                                    </p>
                                    <p>{flatShippingAddress.country}</p>
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        <p>
                                            <span className="text-gray-500">Email:</span>{' '}
                                            {flatShippingAddress.email}
                                        </p>
                                        <p>
                                            <span className="text-gray-500">Phone:</span>{' '}
                                            {flatShippingAddress.phoneNumber}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-[#1C387F] mb-5 flex items-center">
                                    <CreditCard size={24} className="mr-3"/> Payment
                                    Information
                                </h2>
                                <div
                                    className="text-sm text-gray-700 bg-slate-50 p-5 rounded-md shadow-sm leading-relaxed">
                                    <p>
                                        Payment Method:{' '}
                                        <span className="font-semibold">
                      {paymentMethod?.toUpperCase()}
                    </span>
                                    </p>
                                    {latestTransaction && (
                                        <p className="mt-1">
                                            Payment Status:{' '}
                                            <span
                                                className={`font-semibold ${paymentColorClasses.text} rounded-full px-3 py-1`}
                                                style={{
                                                    backgroundColor: paymentColorClasses.bgColor,
                                                }}
                                            >
                        {paymentStatus}
                      </span>
                                        </p>
                                    )}
                                    {latestTransaction?.transactionId && (
                                        <p className="mt-1 text-xs text-gray-500">
                                            Transaction ID: {latestTransaction.transactionId}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center border-t border-gray-200 pt-10">
                        <p className="text-sm text-gray-600 mb-8">
                            An email confirmation with your order details has been sent to{' '}
                            <span className="font-medium text-[#1C387F]">
                {flatShippingAddress.email}
              </span>
                            .
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
                            <Link
                                to="/shop"
                                replace
                                className="w-full sm:w-auto bg-[#1C387F] text-white px-10 py-3 rounded-lg font-semibold hover:bg-[#1C387F]/90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300/50 flex items-center justify-center gap-2 text-base shadow-md hover:shadow-lg"
                            >
                                <ShoppingBag size={20}/> Continue Shopping
                            </Link>
                            <Link
                                to="/me/orders"
                                replace
                                className="w-full sm:w-auto border-2 border-[#1C387F] text-[#1C387F] px-10 py-3 rounded-lg font-semibold hover:bg-[#EBF0FF] hover:text-blue-800 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300/50 text-base shadow-md hover:shadow-lg"
                            >
                                View My Orders
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
