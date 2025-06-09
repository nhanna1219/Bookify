import React from "react";
import {
  useTranslate,
  useApiUrl,
  useInvalidate,
  useNotification,
} from "@refinedev/core";
import {
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { TableActionButton } from "../../tableActionButton";
import type { IOrder } from "../../../interfaces";

type OrderActionProps = {
  record: IOrder;
};

export const OrderActions: React.FC<OrderActionProps> = ({ record }) => {
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const invalidate = useInvalidate();
  const { open } = useNotification();

  const callEndpoint = async (
    action: "set-process" | "set-complete" | "set-cancel" | "set-refund",
    successKey: string,
    errorKey: string
  ) => {
    try {
      const res = await fetch(`${apiUrl}/orders/${record.id}/${action}`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }

      // parse boolean
      const ok: boolean = await res.json();
      if (ok) {
        if (open) {
          open({ type: "success", message: t(successKey) });
        }
        invalidate({ resource: "orders", invalidates: ["list"] });
      } else {
        if (open) {
          open({ type: "error", message: t(errorKey) });
        }
      }
    } catch (err: any) {
      if (open) {
        open({ type: "error", message: err.message || t(errorKey) });
      }
    }
  };

  const menu = (
    <Menu onClick={(e) => e.domEvent.stopPropagation()} selectable={false}>
      <Menu.Item
        key="process"
        icon={<SyncOutlined spin style={{ color: "#1890ff" }} />}
        disabled={
          record.orderStatus === "PROCESSING" ||
          record.orderStatus === "COMPLETED" ||
          record.orderStatus === "CANCELLED"
        }
        onClick={() =>
          callEndpoint(
            "set-process",
            "orders.notifications.processed", // your i18n key
            "orders.notifications.processError"
          )
        }
      >
        {t("buttons.process", "Process")}
      </Menu.Item>

      <Menu.Item
        key="complete"
        icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        disabled={
          record.orderStatus === "COMPLETED" ||
          record.orderStatus === "CANCELLED"
        }
        onClick={() =>
          callEndpoint(
            "set-complete",
            "orders.notifications.completeSuccess",
            "orders.notifications.completeError"
          )
        }
      >
        {t("buttons.complete", "Complete")}
      </Menu.Item>

      <Menu.Item
        key="cancel"
        icon={<CloseCircleOutlined style={{ color: "#EE2A1E" }} />}
        disabled={
          record.orderStatus === "COMPLETED" ||
          record.orderStatus === "CANCELLED"
        }
        onClick={() =>
          callEndpoint(
            "set-cancel",
            "orders.notifications.cancelSuccess",
            "orders.notifications.cancelError"
          )
        }
      >
        {t("buttons.cancel", "Cancel")}
      </Menu.Item>

      <Menu.Item
        key="refund"
        icon={<DollarCircleOutlined style={{ color: "#fa8c16" }} />}
        disabled={record.orderStatus !== "COMPLETED"}
        onClick={() =>
          callEndpoint(
            "set-refund",
            "orders.notifications.refundSuccess",
            "orders.notifications.refundError"
          )
        }
      >
        {t("buttons.refund", "Refund")}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <TableActionButton />
    </Dropdown>
  );
};
