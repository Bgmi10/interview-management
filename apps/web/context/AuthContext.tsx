"use client";   
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    user: null,
    isauthenticated: false
});

export const AuthProvider = ({ children }: { children: any }) => {
    const [isauthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [loader, setLoader] = useState<boolean>(false);

    console.log(user);

    const getUser = async () => {
        setLoader(true);
        try {
            const response = await axios.get("/api/auth", { withCredentials: true });
            const data = response.data;

            if (response.status === 200) {
                setIsAuthenticated(true);
                setUser(data);
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
    },[])

    return(
        <AuthContext.Provider value={{ user, isauthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}