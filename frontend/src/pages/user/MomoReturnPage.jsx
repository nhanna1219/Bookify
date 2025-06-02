import {useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {showError} from "@utils/toast.js";
import {getOrderById} from "@u_services/orderService.js";

export default function MomoReturnPage() {
    const navigate = useNavigate();
    const {search} = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const momoOrderId = params.get("orderId"); // "Bookify-<orderId>"
        if (!momoOrderId) {
            showError("This path is not valid!");
            navigate("/cart", {replace: true});
            return;
        }
        const ourOrderId = momoOrderId.replace(/^Bookify-/, "");

        getOrderById(ourOrderId)
            .then(res => {
                const order = res.data;
                const shippingInformation = order?.shippingInformation;

                const flatShippingAddress = shippingInformation ? {
                    ...(() => {
                        const { address, ...rest } = shippingInformation;
                        return rest;
                    })(),
                    ...shippingInformation.address
                } : {};
                navigate("/order-confirmation", {
                    replace: true,
                    state: {
                        orderDetails: order,
                        paymentMethod: "momo",
                        shippingAddress: flatShippingAddress
                    }
                });
            })
            .catch(() => {
                showError("Unable to create order at this moment, please try again later.");
                navigate("/cart", {replace: true});
            });

    }, [search, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-700">Processing payment…</p>
        </div>
    );
}
