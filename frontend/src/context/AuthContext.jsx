import { createContext, useState, useContext } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [isRoot, setIsRoot] = useState(false);

    return (
        <AuthContext.Provider value={{ isRoot, setIsRoot }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext); 