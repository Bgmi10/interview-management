"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { applyjob } from "../candidateapi";

export default function CandidateById() {
   
    const params = useParams();
    
    useEffect(() => {
      //@ts-ignore
      applyjob({ jobId: (params.id) }).then(i => console.log(i)).catch(e => console.log(e));
    }, [params.id])
    return (
        <div>
           
        </div>
    )
}