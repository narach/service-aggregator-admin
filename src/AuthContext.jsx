import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState( () => sessionStorage.getItem("jwt") || null);

    const login = (jwt) => {
        setToken(jwt);
        sessionStorage.setItem("jwt", jwt);
    };

    const logout = () => {
        setToken(null);
        sessionStorage.removeItem("jwt");
    };

    useEffect(() => {
        // Optionally, validate token on mount
    }, []);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
          {children}
        </AuthContext.Provider>
    );
}