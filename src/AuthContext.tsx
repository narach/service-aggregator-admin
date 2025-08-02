import React, { createContext, useState, useEffect, PropsWithChildren } from "react";

interface AuthContextType {
    token: string | null;
    login: (jwt: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => sessionStorage.getItem("jwt"));

    const login = (jwt: string) => {
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
