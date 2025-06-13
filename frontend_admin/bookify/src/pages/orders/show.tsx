import { useShow, useTranslate, useApiUrl, useNotification, useInvalidate } from "@refinedev/core";
import type { IOrder } from "../../interfaces";
import { List, ListButton } from "@refinedev/antd";
import { Button, Col, Divider, Flex, Row, Skeleton } from "antd";
import {
    CloseCircleOutlined,
    LeftOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    RocketOutlined,
    DollarCircleOutlined,
} from "@ant-design/icons";
import {
    CardWithContent,
    OrderDeliveryMap,
    OrderDeliveryDetails,
    OrderItemsTable,
} from "../../components";

export const OrderShow = () => {
    const t = useTranslate();
    const { open } = useNotification();
    const apiUrl = useApiUrl();
    const invalidate = useInvalidate();
    const { query: queryResult } = useShow<IOrder>();
    const { data, isLoading } = queryResult;
    const record = data?.data;
    const id = record?.id;

    const callAction = async (endpoint: string, successMsg: string, errorMsg: string) => {
        if (!id) return;
        try {
            const res = await fetch(`${apiUrl}/orders/${id}/${endpoint}`, { method: "POST" });
            if (!res.ok) throw new Error(await res.text());

            const result = await res.json();
            if (result === true) {
                open?.({ type: "success", message: t(successMsg) });
                invalidate({ resource: "orders", invalidates: ["all"] });
            } else {
                open?.({ type: "error", message: t(errorMsg) });
            }
        } catch (err: any) {
            open?.({ type: "error", message: err.message || t(errorMsg) });
        }
    };

    const status = record?.orderStatus;

    const actionButtons = [];

    if (status === "PENDING") {
        actionButtons.push(
            <Button
                key="process"
                icon={<SyncOutlined />}
                onClick={() => callAction("set-process", "orders.notifications.processed", "orders.notifications.processError")}
            >
                {t("buttons.process", "Process")}
            </Button>,
            <Button
                key="cancel"
                icon={<CloseCircleOutlined />}
                danger
                onClick={() => callAction("set-cancel", "orders.notifications.cancelSuccess", "orders.notifications.cancelError")}
            >
                {t("buttons.cancel", "Cancel")}
            </Button>
        );
    }

    if (status === "PROCESSING") {
        actionButtons.push(
            <Button
                key="ship"
                icon={<RocketOutlined />}
                onClick={() => callAction("set-ship", "orders.notifications.shipSuccess", "orders.notifications.shipError")}
            >
                {t("buttons.ship", "Ship")}
            </Button>,
            <Button
                key="cancel"
                icon={<CloseCircleOutlined />}
                danger
                onClick={() => callAction("set-cancel", "orders.notifications.cancelSuccess", "orders.notifications.cancelError")}
            >
                {t("buttons.cancel", "Cancel")}
            </Button>
        );
    }

    if (status === "SHIPPED") {
        actionButtons.push(
            <Button
                key="deliver"
                icon={<CheckCircleOutlined />}
                onClick={() => callAction("set-delivered", "orders.notifications.deliveredSuccess", "orders.notifications.deliveredError")}
            >
                {t("buttons.deliver", "Mark as Delivered")}
            </Button>
        );
    }

    if (status === "DELIVERED") {
        actionButtons.push(
            <Button
                key="complete"
                icon={<CheckCircleOutlined />}
                onClick={() => callAction("set-complete", "orders.notifications.completeSuccess", "orders.notifications.completeError")}
            >
                {t("buttons.complete", "Complete")}
            </Button>,
            <Button
                key="initiate-refund"
                icon={<DollarCircleOutlined />}
                onClick={() => callAction("set-pending-refund", "orders.notifications.initiateRefundSuccess", "orders.notifications.initiateRefundError")}
            >
                {t("buttons.initiateRefund", "Initiate Refund")}
            </Button>
        );
    }

    if (status === "PENDING_REFUND") {
        actionButtons.push(
            <Button
                key="refund"
                icon={<DollarCircleOutlined />}
                onClick={() => callAction("set-refund", "orders.notifications.refundSuccess", "orders.notifications.refundError")}
            >
                {t("buttons.completeRefund", "Complete Refund")}
            </Button>
        );
    }

    return (
        <>
            <Flex>
                <ListButton icon={<LeftOutlined />}>{t("orders.orders")}</ListButton>
            </Flex>
            <Divider />
            <List
                breadcrumb={false}
                title={
                    isLoading ? (
                        <Skeleton.Input
                            active
                            style={{ width: "144px", minWidth: "144px", height: "28px" }}
                        />
                    ) : (
                        `${t("orders.titles.list")} #${record?.id}`
                    )
                }
                headerButtons={actionButtons}
            >
                <Row gutter={[16, 16]}>
                    <Col xl={15} lg={24} md={24} sm={24} xs={24}>
                        <Flex gap={16} vertical>
                            <CardWithContent
                                bodyStyles={{
                                    height: "378px",
                                    overflow: "hidden",
                                    padding: 0,
                                }}
                                title={t("orders.titles.deliveryMap")}
                            >
                                <OrderDeliveryMap order={record} />
                            </CardWithContent>
                            <OrderItemsTable order={record} />
                        </Flex>
                    </Col>

                    <Col xl={9} lg={24} md={24} sm={24} xs={24}>
                        <CardWithContent
                            bodyStyles={{ padding: 0 }}
                            title={t("orders.titles.deliveryDetails")}
                        >
                            {record && <OrderDeliveryDetails order={record} />}
                        </CardWithContent>
                    </Col>
                </Row>
            </List>
        </>
    );
};
