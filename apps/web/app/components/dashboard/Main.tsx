"use client"

import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function Main() {
    const { user } = useContext(AuthContext);
    return (
        <div>

        </div>   
    )
}