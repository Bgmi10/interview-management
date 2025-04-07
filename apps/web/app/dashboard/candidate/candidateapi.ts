import { baseUrl } from "../../../src/utils/constants"

const BASE_URL = `${baseUrl}/api/candidate`;

export async function applyjob(id: string) {
   const response = await fetch(BASE_URL + "/apply-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        jobId: id
    })
   });
   return response.json();
   
}

export async function updateApplicantStatus(status: any) {
   await fetch(BASE_URL + "/update-applicant", {
    method: "PUT",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(status)
   })
}

export async function getCandidateById(id: any) {
    const data = await fetch(BASE_URL + "/profile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(id),
    })
    return data.json();
}

export async function findJob(jobTitle: string | null, jobLocation: string | null) {
   const data = await fetch(BASE_URL + "/search-job", {
    method: "POST",
    body: JSON.stringify({
        jobTitle,
        jobLocation
    }),
    headers: {
        "Content-Type": "application/json"
    },
   });
   return data.json();
} 
