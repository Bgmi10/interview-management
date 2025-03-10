import { NextResponse } from "next/server";
import { verifyToken } from "../../auth/utils/authutils";
import { User } from "../../types/user";
import { prisma } from "db";

export async function POST (req: Request) {
  const { jobId } = await req.json();

  if (!jobId) {
    return NextResponse.json({ message: "Missing body" }, { status: 400 })
  } 
  
//@ts-ignore
  const cookies = req.cookies;

  const user = verifyToken(cookies) as User;

  if (user.role !== "Candidate") {
    return NextResponse.json({ message: "User is not candidate" }, { status: 400 })
  }

  const job = await prisma.jobPost.findUnique({
    where: { id: Number(jobId) }
  })

  if (!job) {
    return NextResponse.json({ message: "Job not found" }, { status: 404 });
  }

  const applicantExist = await prisma.jobApplication.findFirst({ 
    where: { candidateId: user.id, jobId: job?.id }
  })

  if (applicantExist) {
    return NextResponse.json({ message: "You have already applied for this job" }, { status: 400 })
  }

  try {
    const application = await prisma.jobApplication.create({
        data: {
            candidateId: user?.id,
            jobId: job.id,
            status: "Pending"
        }
    })
    return NextResponse.json({ message: "Job application submitted successfully", application }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}