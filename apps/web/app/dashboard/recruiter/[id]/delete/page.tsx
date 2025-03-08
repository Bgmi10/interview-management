"use client";
import { deleteJob } from "../../recruiterapi";
import { useRouter } from "next/navigation";

export default function DeleteJob({ params }: { params: { id: string } }) {
    const router = useRouter();

    const handleDelete = async () => {
        await deleteJob(params.id);
        router.push("/dashboard/recruiter");
    };

    return (
        <div className="p-6 bg-white dark:bg-black rounded shadow-lg text-center flex flex-col justify-center h-screen">
            <h1 className="text-xl font-bold text-red-600">Are you sure you want to delete this job?</h1>
            <p className="text-gray-600">This action cannot be undone.</p>
            <div className="mt-4">
                <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer">Delete</button>
                <a href={`/dashboard/recruiter/${params.id}`} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded cursor-pointer">Cancel</a>
            </div>
        </div>
    );
}
