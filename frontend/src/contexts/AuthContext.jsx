import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const stored = localStorage.getItem("auth");
        return stored ? JSON.parse(stored) : null;
    });

    const logout = () => {
        localStorage.removeItem("auth");
        setAuth(null);
    };

    const login = (authData) => {
        localStorage.setItem("auth", JSON.stringify(authData));
        setAuth(authData);
        setupAutoLogout(authData.token);
    };

    const setupAutoLogout = (token) => {
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            const expiresInSeconds = decoded.exp - currentTime;

            if (expiresInSeconds <= 0) {
                logout();
                return;
            }

            setTimeout(logout, expiresInSeconds * 1000);
        } catch {
            logout();
        }
    };

    useEffect(() => {
        if (auth) {
            setupAutoLogout(auth.token);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
