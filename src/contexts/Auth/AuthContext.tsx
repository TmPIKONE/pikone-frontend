import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type {
    AuthContextType,
    AuthProviderProps,
} from "./AuthContext.types";

const defaultContext: AuthContextType = {
    isAuthenticated: false,
    isLoading: true,
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({
                                 children
                             }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] =
        useState(false);
    const [isLoading, setIsLoading] =
        useState(true);
    useEffect(() => {
        const token =
            sessionStorage.getItem("accessToken");

        if(token){
            setIsAuthenticated(true);
        }
        else{
            setIsAuthenticated(false);
        }
        setIsLoading(false);

    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth(){
    return useContext(AuthContext);
}