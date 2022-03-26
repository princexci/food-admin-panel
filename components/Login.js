import { Button, Card, Form, Input, notification } from "antd";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const handleSubmit = async ({ email, password }) => {
    try {
      await login({ email, password });
    } catch (error) {
      notification.error({
        message: "Invalid email / password.",
      });
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <Card className="w-1/3 justify-center p-10 rounded-xl bg-white">
        <p className="text-2xl font-bold mb-5">Login</p>
        <Form
          initialValues={{
            email: "",
            password: "",
          }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                required: true,
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password placeholder="password" />
          </Form.Item>
          <Button size="large" block type="primary" htmlType="submit">
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
