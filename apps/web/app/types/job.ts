export enum JobStatusEnum {
    Pending = "Pending",
    Accepted = "Accepted",
    Rejected = "Rejected",
  }
  
  export enum Role {
    Candidate = "Candidate",
    Recruiter = "Recruiter",
  }
  
  export enum JobPostEnum {
    Active = "Active",
    Inactive = "Inactive",
  }
  
  export enum JobTypeEnum {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    CONTRACT = "CONTRACT",
    REMOTE = "REMOTE",
    INTERNSHIP = "INTERNSHIP",
    FREELANCE = "FREELANCE",
  }
  
  
  export interface JobApplication {
    id: number;
    candidateId: number;
    jobId: number;
    status: JobStatusEnum;
    appliedAt: Date;
  }
  
  export interface JobPost {
    id: number;
    title: string;
    description: string;
    companyName: string;
    location: string;
    salary: string;
    jobType: JobTypeEnum;
    postedAt: Date;
    updatedAt: Date;
    recruiterId: number;
    companyLogo?: string;
    role: string;
    industryType: string;
    responsibilities: string[];
    requriedSkills: string[];
    preferredSkills: string[];
    qualifications: string[];
    education: string[];
    experience?: string;
    applications: JobApplication[];
    status: JobPostEnum;
  }
  