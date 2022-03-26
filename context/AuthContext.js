import { createContext, useEffect, useState } from "react";
import { $axios } from "../lib/axios";
import redirectTo from "../lib/redirectTo";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(false);
  const [auth, setAuth] = useState({
    loggedIn: false,
    user: null,
  });

  // const { push } = useHistory();

  const fetchUser = async (accessToken) => {
    setAuthLoading(true);
    try {
      $axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // After fetch
      const user = await $axios.get("/auth/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setAuth({
        loggedIn: true,
        user: user.data,
      });
    } catch (error) {
      console.log(error);
      // throw new Error("invalid email / password");
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (formData) => {
    setAuthLoading(true);
    try {
      const { accessToken } = await $axios.post("/auth/login", formData);
      await fetchUser(accessToken);
      localStorage.setItem("token", accessToken);
    } catch (error) {
      console.log(error);
      throw new Error("invalid email / password");
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuth({
        loggedIn: false,
        user: null,
      });
      localStorage.removeItem("token");
      redirectTo("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUser(localStorage.getItem("token"));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
