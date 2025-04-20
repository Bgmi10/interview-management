"use client"
import { useParams } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import CreateJob from "../../../../components/recruiter/CreateJob";

export default function Edit() {
    const params = useParams();
    const { user } = useAuth();
    //@ts-ignore
    const data = user?.jobPosts?.filter((item: any) => item.id === parseInt(params.id)); 

    return (
        <div>
            <CreateJob data={data?.[0]} title="Edit Job" subTitle="update the job details" />
        </div>
    )
}