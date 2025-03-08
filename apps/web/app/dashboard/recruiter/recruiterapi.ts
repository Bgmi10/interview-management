const BASE_URL = "http://localhost:3000/api/recruiter/jobs"; 
 
// ✅ Fetch all jobs    
export const fetchJobs = async () => {
    const res = await fetch(BASE_URL);
    return res.json();
};

// ✅ Fetch job by ID
export const fetchJobById = async (id: string) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        cache: "no-store",
    });
    return res.json();
};

// ✅ Create a job
export const createJob = async (jobData: any) => {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
    });
    return res.json();
};

// ✅ Update job
export const updateJob = async (id: any, jobData: any) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
    });
    return res.json();
};

// ✅ Delete job
export const deleteJob = async (id: string) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    return res.json();
};
