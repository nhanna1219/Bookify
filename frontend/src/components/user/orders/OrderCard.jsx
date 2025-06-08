import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    CreditCard,
    MapPin,
    Star,
    Ban,
} from "lucide-react";

export function OrderCard({order, onWriteReview, onCancelOrder}) {
    const getOrderStatusIcon = (status) => {
        switch (status) {
            case "PENDING":
                return <Clock className="text-yellow-600" size={16}/>;
            case "PROCESSING":
                return <Package className="text-blue-600" size={16}/>;
            case "SHIPPED":
                return <Truck className="text-purple-600" size={16}/>;
            case "DELIVERED":
            case "COMPLETED":
                return <CheckCircle className="text-green-600" size={16}/>;
            case "CANCELLED":
            case "REFUNDED":
                return <XCircle className="text-red-600" size={16}/>;
            default:
                return <Clock className="text-gray-600" size={16}/>;
        }
    };

    const getOrderStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "PROCESSING":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "SHIPPED":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "DELIVERED":
            case "COMPLETED":
                return "bg-green-100 text-green-800 border-green-200";
            case "CANCELLED":
            case "REFUNDED":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

    const canWriteReview = (status) =>
        status === "DELIVERED" || status === "COMPLETED";
    const canCancelOrder = (status) =>
        status === "PENDING" || status === "PROCESSING";

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {getOrderStatusIcon(order.orderStatus)}
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getOrderStatusColor(
                            order.orderStatus
                        )}`}
                    >
                        {order.orderStatus}
                      </span>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-500">
                        Order #{order.id.slice(-8)}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center">
                        <Calendar size={12} className="mr-1"/>
                        {formatDate(order.addedAt)}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Items section */}
                <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-3">
                        Items ({order.items.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-4 p-2 bg-gray-50 rounded-lg"
                            >
                                <img
                                    src={item.imageUrl || "/placeholder.svg?height=60&width=45"}
                                    alt={item.title}
                                    className="w-10 h-14 object-cover rounded border"
                                />
                                <div className="flex-1">
                                    <h5 className="font-medium text-gray-900">{item.title}</h5>
                                    <p className="text-xs text-gray-500">
                                        Qty: {item.quantity}
                                    </p>
                                    <p className="text-sm font-semibold text-[#1C387F]">
                                        {formatCurrency(item.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <CreditCard size={16} className="mr-2"/>
                            Payment
                        </h4>
                        <p className="text-sm text-gray-600 capitalize mb-1">
                            Method: {order.payment.method.replace("_", " ")}
                        </p>
                        <p className="text-lg font-bold text-[#1C387F]">
                            {formatCurrency(order.totalAmount)}
                        </p>
                        {order.payment.transactions.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                                Status:{" "}
                                {
                                    order.payment.transactions[order.payment.transactions.length - 1].status
                                }
                            </p>
                        )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <MapPin size={16} className="mr-2"/>
                            Shipping
                        </h4>
                        <p className="text-sm text-gray-600">
                            {order.shippingInformation.firstName}{" "}
                            {order.shippingInformation.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                            {order.shippingInformation.address.street}
                        </p>
                        <p className="text-xs text-gray-500">
                            {order.shippingInformation.address.city},{" "}
                            {order.shippingInformation.address.state}{" "}
                            {order.shippingInformation.address.postalCode}
                        </p>
                        <p className="text-xs text-gray-500">
                            {order.shippingInformation.address.country}
                        </p>
                    </div>

                    <div className="space-y-2">
                        {canWriteReview(order.orderStatus) && (
                            <button
                                onClick={() => onWriteReview(order)}
                                className="w-full flex items-center justify-center space-x-2 bg-[#1C387F] text-white py-2 px-4 rounded-lg hover:bg-[#153066] transition-colors duration-200"
                            >
                                <Star size={16}/>
                                <span>Write a Review</span>
                            </button>
                        )}
                        {canCancelOrder(order.orderStatus) && (
                            <button
                                onClick={() => onCancelOrder(order)}
                                className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                                <Ban size={16}/>
                                <span>Cancel Order</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
