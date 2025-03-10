import { baseUrl } from "../../../src/utils/constants"

const BASE_URL = `${baseUrl}/api/candidate`;

export async function applyjob(data: string) {
   await fetch(BASE_URL + "/apply-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
   })
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
