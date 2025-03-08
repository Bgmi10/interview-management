import { prisma } from "db";
import { NextResponse } from "next/server";
import { verifyToken } from "../../auth/utils/authutils";
import { User } from "../../types/user";

export async function POST (req: Request) {
    const { title, description, companyName, location, salary, jobType, companyLogo, role, industryType, responsibilities, requriedSkills, preferredSkills, qualifications, education, experience } = await req.json();

    if (!title || !description || !companyName || !location || !salary || !jobType || !role || !industryType || !responsibilities || !requriedSkills || !qualifications || !education || !experience) {
        return NextResponse.json({ message: "missing body" }, { status: 400 });
    }
    //@ts-ignore
    const cookies = req.cookies;

    const user = verifyToken(cookies) as User;

    if (user?.role === "Candidate") {
        return NextResponse.json({ message: "Access Denied" }, { status: 400 })
    }

    try{
        const createdJob = await prisma.jobPost.create({ 
            data: {
                title,
                description,
                companyName,
                location,
                salary,
                jobType,
                recruiterId: user?.id,
                postedAt: new Date(),
                preferredSkills,
                qualifications,
                responsibilities,
                requriedSkills,
                companyLogo,
                role,
                education,
                experience,
                industryType,
                status: "Active"
            }
        });

        return NextResponse.json({ message: "job created success", data: createdJob }, { status: 201 })
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "error while creating job" }, { status: 500 })
    }
}

export async function GET (req: Request) {
    //@ts-ignore
    const cookies = req.cookies;
    const user = verifyToken(cookies) as User;

    try {
        const jobs = await prisma.jobPost.findMany({
            where: { recruiterId: user?.id },
            select: {
                id: true,
                title: true,
                companyName: true,
                companyLogo: true,
                salary: true,
                jobType: true,
                postedAt: true,
                applications: true,
                location: true,
                description: true
            }
        })
        return NextResponse.json(jobs, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Error fetching jobs" }, { status: 500 });
    }
}