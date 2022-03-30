import { DownOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, List, Menu, notification, Table } from "antd";
import Title from "antd/lib/typography/Title";
import { useState } from "react";
import useSWR from "swr";
import Loading from "../components/Loading";
import { $axios } from "../lib/axios";

export default function Orders() {
  const { data, isValidating, mutate } = useSWR("/orders", $axios, {
    revalidateOnFocus: false,
  });

  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (status, id) => {
    try {
      setLoading(true);
      await $axios.patch(`/orders/${id}/${status}`);

      await mutate();
      notification.success({
        message: `Status changed to ${status}`,
      });
    } catch (error) {
      notification.error({
        message: "Something went wrong",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      render: (user) => (
        <div>
          <div className="font-bold mt-2">{user?.name}</div>
          <div>{user?.email}</div>
          <div>{user?.mobile}</div>
        </div>
      ),
    },
    {
      title: "Checkout Info",
      dataIndex: "checkoutInfo",
      render: (checkoutInfo) => (
        <div>
          <div>Address: {checkoutInfo?.address}</div>
          <div>Contact: {checkoutInfo?.contact}</div>
        </div>
      ),
      width: 170,
    },
    {
      title: "Items",
      width: 300,
      dataIndex: "items",
      render: (items, results) => (
        <div>
          <List className="mb-2">
            {items.map((item, index) => (
              <List.Item key={index}>
                - {item?.name}({item?.quantity}) -{" "}
                <span className="text-blue-500">
                  Nrs. {item?.totalPrice || item?.price}
                </span>
              </List.Item>
            ))}
          </List>
          <span className="font-bold">Total: Nrs. {results.totalPrice}</span>
        </div>
      ),
    },
    {
      title: "Ordered At",
      dataIndex: "orderedAt",
      render: (val) => <div>{val && new Date(val).toString()}</div>,
      sorter: (a, b) => (a.orderedAt.length > b.orderedAt.length ? -1 : 1),
      sortDirections: ["descend"],
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      filters: [
        {
          text: "Cash on Delivery",
          value: 2,
        },
        {
          text: "Stripe",
          value: 1,
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.paymentType === value,
      render: (val) => <div>{val === 1 ? "Stripe" : "Cash on Delivery"}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        {
          text: "PENDING",
          value: "PENDING",
        },
        {
          text: "ACCEPTED",
          value: "ACCEPTED",
        },
        {
          text: "DELIVERED",
          value: "DELIVERED",
        },
      ],
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (val) => (
        <div
          className={`px-4 py-2 font-bold text-white ${
            val === "PENDING"
              ? "bg-yellow-400"
              : val === "ACCEPTED"
              ? "bg-blue-500"
              : "bg-green-500"
          }`}
        >
          {val}
        </div>
      ),
    },
    {
      title: "Action",
      render: (_, data) => (
        <div className="flex">
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => handleStatusChange(key, data._id)}>
                <Menu.Item key="ACCEPTED" className="text-blue-500">
                  ACCEPTED
                </Menu.Item>
                <Menu.Item key="DELIVERED" className="text-green-500">
                  DELIVERED
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button loading={loading} type="link" className="flex items-center">
              Change Order Status <DownOutlined />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  if (!data && isValidating) {
    return <Loading />;
  }

  return (
    <div>
      <Card>
        <Title className="font-black">Orders</Title>
        <Table
          loading={isValidating}
          columns={columns}
          dataSource={data}
          rowKey={(d) => d._id}
        />
      </Card>
    </div>
  );
}
