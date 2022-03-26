import AuthProvider from "../context/AuthContext";
import "../styles/globals.css";
import "antd/dist/antd.css";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
