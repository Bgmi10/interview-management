import { prisma } from "db";
import { NextResponse } from "next/server";

export async function POST (req: Request) {
   const { candidateId } = await req.json();

   if (!candidateId) {
    return NextResponse.json({ message: "Missing body" }, { status: 400 });
   }
   
   try {
    const candidateProfile = await prisma.user.findUnique({
        where: { id: Number(candidateId) },
        select: {
            email: true,
            profilePic: true,
            resume: true,
            linkedIn: true,
            collageName: true,
            experience: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            portfolioUrl: true,
            skills: true,
            specilization: true,
            createdAt: true
        }
    });

    if (!candidateProfile) {
        return NextResponse.json({ message: "No candidate profile found" }, { status: 400 });
    }

    return NextResponse.json({ message: "Candidate profile", data: candidateProfile }, { status: 200 })
   } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "error while fetching candidate profile" }, { status: 500 })
   }

}

