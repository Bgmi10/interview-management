"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { applyjob } from "../candidateapi";

export default function () {
    const params = useParams();
    
    useEffect(() => {
      applyjob({ jobId: (params.id) }).then(i => console.log(i)).catch(e => console.log(e));
    }, [params.id])
    return (
        <div>
           
        </div>
    )
}