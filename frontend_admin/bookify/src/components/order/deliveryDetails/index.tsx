import React from "react";
import { useTranslate } from "@refinedev/core";
import { List, Typography, Card } from "antd";
import {
  EnvironmentOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { IOrder } from "../../../interfaces";

type Props = {
  order?: IOrder;
};

export const OrderDeliveryDetails: React.FC<Props> = ({ order }) => {
  const t = useTranslate();

  const details = [
    {
      icon: <EnvironmentOutlined />,
      title: t("orders.fields.shippingAddress", "Shipping Address"),
      description: order?.shippingAddress
          ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`
          : "-",
    },
    {
      icon: <CreditCardOutlined />,
      title: t("orders.fields.paymentMethod", "Payment Method"),
      description: order?.payment?.method ?? "-",
    },
    {
      icon: <ClockCircleOutlined />,
      title: t("orders.fields.completedAt", "Completed At"),
      description: order?.doneAt
          ? dayjs(order.doneAt).format("LLL")
          : "-",
    },
  ];

  return (
      <Card
          bordered={false}
          title={t("orders.fields.deliveryDetails", "Delivery Details")}
      >
        <List
            itemLayout="horizontal"
            dataSource={details}
            renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                      avatar={item.icon}
                      title={<Typography.Text type="secondary">{item.title}</Typography.Text>}
                      description={<Typography.Text>{item.description}</Typography.Text>}
                  />
                </List.Item>
            )}
        />
      </Card>
  );
};
