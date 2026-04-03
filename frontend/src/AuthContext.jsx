import React, { createContext, useContext, useEffect, useState } from "react";

import api from "./api";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: null
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);

        // Check expiry
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expired = payload.exp * 1000 < Date.now();

        if (!expired) {
          setAuth({ token, user: parsedUser });
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete api.defaults.headers.common["Authorization"];

    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
        isLoggedIn: !!auth.token
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;