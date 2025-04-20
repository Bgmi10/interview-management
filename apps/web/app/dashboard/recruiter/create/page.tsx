import CreateJob from "../../../components/recruiter/CreateJob";

export default function Create() {
    return(
       <CreateJob data={{
        title: "",
        description: "",
        companyName: "",
        location: "",
        salary: "",
        //@ts-ignore
        jobType: "FULL_TIME",
        companyLogo: "",
        role: "",
        industryType: "",
        responsibilities: [],
        requriedSkills: [],
        preferredSkills: [],
        qualifications: [],
        education: [],
        experience: ""
      }} title="Create Job" subTitle="Fill in the information below to create a new job posting"/>
    )
}
