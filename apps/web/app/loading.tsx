import { Loader } from "lucide-react";

export default function Loading () {
    return (
        <div className="justify-center flex h-screen items-center">
            <Loader className="animate-spin" />
        </div>
    )
}