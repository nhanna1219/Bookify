import React from "react";
import {
  useTranslate,
  useExport,
  useNavigation,
  HttpError,
  getDefaultFilter, useGo,
} from "@refinedev/core";
import {
  List,
  useTable,
  getDefaultSortOrder,
  DateField,
  NumberField,
  FilterDropdown,
  ExportButton, CreateButton,
} from "@refinedev/antd";
import { Table, Typography, Select, InputNumber, theme } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  OrderActions,
  OrderStatus,
  OrderTableColumnItems,
  PaginationTotal,
} from "../../components";
import type { IOrder } from "../../interfaces";
import { ImportCsvOrdersButton } from "../../components/importCsv";
import {useLocation} from "react-router";

export const OrderList: React.FC = () => {
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();
  const { show } = useNavigation();
  const { token } = theme.useToken();

  const { tableProps, sorters, filters } = useTable<IOrder, HttpError>({
    resource: "orders",
    initialSorter: [{ field: "createdAt", order: "desc" }],
    filters: {
      initial: [{ field: "status", operator: "eq", value: "" }],
    },
    syncWithLocation: true,
  });

  const { isLoading, triggerExport } = useExport<IOrder>({
    resource: "orders",
    sorters,
    filters,
    pageSize: 50,
    maxItemCount: 1000,
    mapData: (order) => ({
      id: order.id,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
      createdAt: order.addedAt,
      doneAt: order.doneAt ?? "",
    }),
  });

  return (
    <List
      // headerProps={{
      //   extra: <ExportButton onClick={triggerExport} loading={isLoading} />,
      // }}
      headerButtons={() => (
        <>
          <CreateButton
              key="create"
              size="large"
              onClick={() => {
                return go({
                  to: `${createUrl("orders")}`,
                  query: {
                    to: pathname,
                  },
                  options: {
                    keepQuery: true,
                  },
                  type: "replace",
                });
              }}
          >
            {t("orders.actions.add", "Add")}
          </CreateButton>

          {/* Import CSV Orders */}
          <ImportCsvOrdersButton />

          {/* Export Button */}
          <ExportButton onClick={triggerExport} loading={isLoading} />
        </>
      )}
    >
      <Table
        {...tableProps}
        rowKey="id"
        style={{ cursor: "pointer" }}
        onRow={(record) => ({
          onClick: () => show("orders", record.id),
        })}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="orders" />
          ),
        }}
      >
        {/* Order ID */}
        <Table.Column
          key="id"
          dataIndex="id"
          title={t("orders.fields.id", "Order ID")}
          render={(val: string) => <Typography.Text>#{val}</Typography.Text>}
          sorter
          defaultSortOrder={getDefaultSortOrder("id", sorters)}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <InputNumber
                addonBefore="#"
                style={{ width: "100%" }}
                placeholder={t("orders.filter.id.placeholder", "Filter by ID")}
              />
            </FilterDropdown>
          )}
        />

        {/* Status */}
        {/*<Table.Column*/}
        {/*    key="status"*/}
        {/*    dataIndex="status"*/}
        {/*    title={t("orders.fields.status", "Status")}*/}
        {/*    render={(status) => <OrderStatus status={status} />}*/}
        {/*    sorter*/}
        {/*    defaultSortOrder={getDefaultSortOrder("status", sorters)}*/}
        {/*    defaultFilteredValue={getDefaultFilter("status", filters, "eq")}*/}
        {/*    filterIcon={(filtered) => (*/}
        {/*        <SearchOutlined*/}
        {/*            style={{ color: filtered ? token.colorPrimary : undefined }}*/}
        {/*        />*/}
        {/*    )}*/}
        {/*    filterDropdown={(props) => (*/}
        {/*        <FilterDropdown {...props}>*/}
        {/*          <Select*/}
        {/*              style={{ width: 200 }}*/}
        {/*              allowClear*/}
        {/*              placeholder={t(*/}
        {/*                  "orders.filter.status.placeholder",*/}
        {/*                  "Filter status",*/}
        {/*              )}*/}
        {/*          >*/}
        {/*            <Select.Option value="NEW">NEW</Select.Option>*/}
        {/*            <Select.Option value="PROCESSING">PROCESSING</Select.Option>*/}
        {/*            <Select.Option value="COMPLETED">COMPLETED</Select.Option>*/}
        {/*            <Select.Option value="CANCELLED">CANCELLED</Select.Option>*/}
        {/*          </Select>*/}
        {/*        </FilterDropdown>*/}
        {/*    )}*/}
        {/*/>*/}

        {/* Status */}
        <Table.Column
          key="orderStatus"
          dataIndex="orderStatus"
          title={t("orders.fields.orderStatus", "Status")}
          render={(status: string) => (
            // pass the raw string status to your component
            <OrderStatus status={status} />
          )}
          sorter
          defaultSortOrder={getDefaultSortOrder("status", sorters)}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("status", filters, "eq")}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: 200 }}
                allowClear
                placeholder={t(
                  "orders.filter.status.placeholder",
                  "Filter status"
                )}
              >
                <Select.Option value="PENDING">
                  {t("enum.orderStatuses.PENDING", "PENDING")}
                </Select.Option>
                <Select.Option value="PROCESSING">
                  {t("enum.orderStatuses.PROCESSING", "PROCESSING")}
                </Select.Option>
                <Select.Option value="SHIPPED">
                  {t("enum.orderStatuses.SHIPPED", "SHIPPED")}
                </Select.Option>
                <Select.Option value="DELIVERED">
                  {t("enum.orderStatuses.DELIVERED", "DELIVERED")}
                </Select.Option>
                <Select.Option value="COMPLETED">
                  {t("enum.orderStatuses.COMPLETED", "COMPLETED")}
                </Select.Option>
                <Select.Option value="CANCELLED">
                  {t("enum.orderStatuses.CANCELLED", "CANCELLED")}
                </Select.Option>
                <Select.Option value="REFUNDED">
                  {t("enum.orderStatuses.REFUNDED", "REFUNDED")}
                </Select.Option>
              </Select>
            </FilterDropdown>
          )}
        />

        {/* Products */}
        <Table.Column<IOrder>
          key="items"
          dataIndex="items"
          title={t("orders.fields.items", "Items")}
          render={(items, record) => (
            // your helper will take the order and render its items
            <OrderTableColumnItems order={record} />
          )}
        />

        {/* Total Amount */}
        <Table.Column
          key="totalAmount"
          dataIndex="totalAmount"
          align="right"
          title={t("orders.fields.totalAmount", "Total Amount")}
          sorter
          defaultSortOrder={getDefaultSortOrder("totalAmount", sorters)}
          render={(val: number) => (
            <NumberField
              value={val}
              options={{ style: "currency", currency: "USD" }}
            />
          )}
        />

        {/* Done At */}
        <Table.Column
          key="doneAt"
          dataIndex="doneAt"
          title={t("orders.fields.doneAt", "Completed At")}
          render={(value: string) => <DateField value={value} format="LLL" />}
          sorter
          defaultSortOrder={getDefaultSortOrder("doneAt", sorters)}
        />

        {/* Created At */}
        {/*<Table.Column*/}
        {/*    key="createdAt"*/}
        {/*    dataIndex="createdAt"*/}
        {/*    title={t("orders.fields.createdAt", "Created At")}*/}
        {/*    render={(val: string) => <DateField value={val} format="LLL" />}*/}
        {/*    sorter*/}
        {/*    defaultSortOrder={getDefaultSortOrder("createdAt", sorters)}*/}
        {/*/>*/}

        {/* Actions */}
        <Table.Column<IOrder>
          fixed="right"
          title={t("table.actions", "Actions")}
          key="actions"
          render={(_, record) => <OrderActions record={record} />}
        />
      </Table>
    </List>
  );
};
