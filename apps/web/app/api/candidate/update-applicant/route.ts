import { NextResponse } from "next/server";
import { verifyToken } from "../../auth/utils/authutils";
import { User } from "../../types/user";
import { prisma } from "db";

export async function PUT (req: Request) {
    const { applicantId, status } = await req.json();
    
    if (!status || !applicantId) {
        return NextResponse.json({ message: "Missing body" }, { status: 400 });
    }

    //@ts-ignore
    const cookies = req.cookies;
    const user = verifyToken(cookies) as User;
    
    if (user.role !== "Recruiter") {
        return NextResponse.json({ message: "User is not Recruiter" }, { status: 400 });
    }

    try {
        await prisma.jobApplication.update({
            where: { 
                id: applicantId
             },
            data: {
               status
            }
        });

        return NextResponse.json({ message: "Applicant status updated successfully" }, { status: 200 })
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Error while updating applicant job status" }, { status: 500 })
    }
}