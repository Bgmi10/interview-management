const BASE_URL = "http://localhost:3000/api/recruiter"; 
 
// ✅ Fetch all jobs    
export const fetchJobs = async () => {
    const res = await fetch(BASE_URL);
    return res.json();
};

// ✅ Fetch job by ID
export const fetchJobById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, {
        cache: "no-store",
    });
    return res.json();
};

// ✅ Create a job
export const createJob = async (jobData: any) => {
    const res = await fetch( BASE_URL + '/jobs', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
    });
    return res.json();
};

// ✅ Update job
export const updateJob = async (id: any, jobData: any) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
    });
    return res.json();
};

// ✅ Delete job
export const deleteJob = async (id: string) => {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, { method: "DELETE" });
    return res.json();
};

export const fetchCandidates = async (jobrole: string, skills: any) => {
    const skillArr = skills?.split(/\s*,\s*/);

    try {
        const response = await fetch(BASE_URL + "/search", {
            method: "POST",
            body: JSON.stringify({
                jobRole: jobrole,
                skills: skillArr
            })
        })
        const json = await response.json();
        return json;
    } catch (e) {
        console.log(e)
    } 
}