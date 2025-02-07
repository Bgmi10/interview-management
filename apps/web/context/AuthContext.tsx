"use client";   
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    user: null,
    isauthenticated: false,
    Logout: () => {}
});

export const AuthProvider = ({ children }: { children: any }) => {
    const [isauthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [loader, setLoader] = useState<boolean>(false);

    const getUser = async () => {
        setLoader(true);
        try {
            const response = await axios.get("/api/user", { withCredentials: true });
            const data = response.data;
  
            if (response.status === 200) {
                setIsAuthenticated(true);
                setUser(data);
            } else { 
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (e) {
            console.log(e); 
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoader(false);
        }
    }

    useEffect(() => {
       getUser();
    },[]);

    const Logout = async() => {
        setIsAuthenticated(false);
        setUser(null);
        await axios.post("/api/auth/logout", {}, { withCredentials: true });    
    }

    return(
        <AuthContext.Provider value={{ user, isauthenticated, Logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}