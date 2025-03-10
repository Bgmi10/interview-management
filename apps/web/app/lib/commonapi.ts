import { baseUrl } from "@/utils/constants";

export async function logview(data: any) {
    await fetch(baseUrl + "/api/profile/profile-log", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
} 

export async function getAllProfileViews(data: any) {
    await fetch(baseUrl + "/api/profile/profile-viewed", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
} 
