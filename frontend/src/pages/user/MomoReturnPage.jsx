import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { showError } from "@utils/toast.js";
import {getOrderById, notifyMomoPaymentStatus} from "@u_services/orderService.js";

export default function MomoReturnPage() {
    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const momoOrderId = params.get("orderId");
        if (!momoOrderId) {
            showError("This path is not valid!");
            navigate("/cart", { replace: true });
            return;
        }
        const ourOrderId = momoOrderId.replace(/^Bookify-/, "");

        const payload = {
            partnerCode: params.get("partnerCode"),
            accessKey: params.get("accessKey"),
            requestId: params.get("requestId"),
            amount: params.get("amount"),
            orderId: params.get("orderId"),
            orderInfo: params.get("orderInfo"),
            orderType: params.get("orderType"),
            transId: params.get("transId"),
            resultCode: params.get("resultCode"),
            message: params.get("message"),
            responseTime: params.get("responseTime"),
            extraData: params.get("extraData"),
            payType: params.get("payType"),
            signature: params.get("signature"),
        };

        notifyMomoPaymentStatus(payload)
            .then(() => {
                return getOrderById(ourOrderId);
            })
            .then(res => {
                const order = res.data;
                const shippingInformation = order?.shippingInformation;
                const flatShippingAddress = shippingInformation
                    ? {
                        ...(() => {
                            const { address, ...rest } = shippingInformation;
                            return rest;
                        })(),
                        ...shippingInformation.address
                    }
                    : {};
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
                showError("Unable to process payment at this moment. Please try again later.");
                navigate("/cart", { replace: true });
            });
    }, [search, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-700">Processing payment…</p>
        </div>
    );
}
