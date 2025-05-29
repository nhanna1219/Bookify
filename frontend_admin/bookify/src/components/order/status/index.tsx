import React from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useTranslate } from "@refinedev/core";
import { Tag } from "antd";

type OrderStatusProps = {
  status: "NEW" | "PROCESSING" | "COMPLETED" | "CANCELLED";
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  const t = useTranslate();

  let color: string;
  let icon: React.ReactNode;

  switch (status) {
    case "NEW":
      color = "default";
      icon = <ClockCircleOutlined />;
      break;
    case "PROCESSING":
      color = "blue";
      icon = <SyncOutlined spin />;
      break;
    case "COMPLETED":
      color = "green";
      icon = <CheckCircleOutlined />;
      break;
    case "CANCELLED":
      color = "red";
      icon = <CloseCircleOutlined />;
      break;
    default:
      color = "default";
      icon = null;
  }

  return (
      <Tag color={color} icon={icon}>
        {t(`enum.orderStatuses.${status}`, status)}
      </Tag>
  );
};
