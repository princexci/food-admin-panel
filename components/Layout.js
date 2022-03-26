import {
  AppstoreOutlined,
  LogoutOutlined,
  ShopOutlined
} from "@ant-design/icons";
import { Layout as AntLayout, Menu } from "antd";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import redirectTo from "../lib/redirectTo";
import Loading from "./Loading";
import Login from "./Login";

const { Header, Content, Sider } = AntLayout;

export default function Layout({ Component, pageProps }) {
  const {
    auth: { loggedIn, user },
    authLoading,
    logout,
  } = useContext(AuthContext);

  const { pathname } = useRouter();

  // If auth state loading, show spinner
  if (authLoading) {
    return <Loading />;
  }

  // If user isn't logged in, show login component
  if (!loggedIn) {
    return <Login />;
  }

  // Else, Show Admin dashboard layout
  return (
    <AntLayout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="text-lg font-bold text-white px-5 py-5">
          Food Dashboard
        </div>
        <Menu theme="dark" selectedKeys={[pathname]} mode="inline">
          <Menu.Item
            key="/"
            icon={<AppstoreOutlined />}
            onClick={() => redirectTo("/")}
          >
            Recipes
          </Menu.Item>
          <Menu.Item
            key="/orders"
            icon={<ShopOutlined />}
            onClick={() => redirectTo("/orders")}
          >
            Orders
          </Menu.Item>
          <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <AntLayout className="site-layout" style={{ marginLeft: 200 }}>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <Component {...pageProps} />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
