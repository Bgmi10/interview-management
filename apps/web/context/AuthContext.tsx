"use client";   
import { baseUrl } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext({
    user: null,
    isauthenticated: false,
    Logout: () => {},
    getUser: () => {},
    profileCompletion: 0,
    setUser: (user: any) => {},
    loader: false,
    updateUser: (user: any) => {}
})

export const AuthProvider = ({ children }: { children: any }) => {
    const [isauthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any | null>(null);
    const [loader, setLoader] = useState<boolean>(false);
    const navigate = useRouter();
    const [profileCompletion, setProfileCompletion] = useState<number>(0);
    
    const getUser = async () => {
        setLoader(true);
        try {
            const response = await axios.get("/api/user", { withCredentials: true });
            const data: any = response.data;
  
            if (response.status === 200) {
                setIsAuthenticated(true);
                setUser(data?.data);
                setProfileCompletion(data?.profileCompletion);
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
        const response = await axios.post("/api/auth/logout", {}, { withCredentials: true });    

        if (response.status === 200) {
            navigate.push("/login");
        }
    }

    
    const updateUser = async (data: any) => {
        const res = await axios.put(baseUrl + "/api/user", { data }, { withCredentials: true });
        return res.data;
    }
    
    return(
        <AuthContext.Provider value={{ user, isauthenticated, Logout, getUser, profileCompletion, setUser, loader, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
}