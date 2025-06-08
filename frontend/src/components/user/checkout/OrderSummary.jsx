export default function OrderSummary({
                                         itemsCount,
                                         subtotal,
                                         shipping,
                                         taxes,
                                         discount,
                                         total,
                                         goToCheckout,
                                         goToPayment
                                     }) {
    return (
        <div
            className="bg-white rounded-lg border-2 border-[#BFBEBE] drop-shadow-xl overflow-hidden sticky top-4">
            <div className="bg-[#1C387F] text-white px-6 py-4">
                <h2 className="font-semibold text-lg">Order Summary</h2>
            </div>
            <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                    <span>Item(s):</span>
                    <span>{itemsCount}</span></div>
                <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm">
                    <span>Taxes (8%):</span>
                    <span>${taxes.toFixed(2)}</span></div>
                {shipping === 0 ? (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Free shipping:</span>
                            <span>$0.00</span>
                        </div>)
                    : (
                        <div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping:</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="text-xs text-gray-500 text-center my-6">
                                Free shipping on orders over $30
                            </div>
                        </div>
                    )}
                <div className="flex justify-between text-sm text-green-600">
                    <span>Sale discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200"/>
                <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span><span>${total.toFixed(2)}</span></div>
                {
                    goToCheckout ?
                        (
                            <button
                                onClick={goToCheckout}
                                className="w-full bg-[#1C387F] hover:bg-[#1C387F]/90 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={itemsCount === 0}>
                                Proceed to Checkout
                            </button>
                        ) :
                        (
                            goToPayment ?
                                (
                                    <button
                                        type={"submit"}
                                        className="w-full bg-[#1C387F] hover:bg-[#1C387F]/90 text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continue to Payment
                                    </button>
                                ) :
                                ""
                        )
                }

                {itemsCount === 0 && goToCheckout &&
                    <p className="mt-5 text-sm text-gray-500 text-center">Select items to proceed to
                        checkout</p>}
            </div>
        </div>
    )
}