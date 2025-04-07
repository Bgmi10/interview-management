import { prisma } from "db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    const { jobTitle, jobLocation } = await req.json();

    if (!jobTitle || !jobLocation) {
        return NextResponse.json({ message: "Missing body" }, { status: 400 });
    }

    const filters: any = {};

    if (jobTitle) {
        filters.title = {
          contains: jobTitle.trim(),
          mode: "insensitive"
        }    
    }

    if (jobLocation) {
        filters.location = {
            contains: jobLocation.trim(),
            mode: "insensitive"
        }
    }
    try{
        const response = await prisma.jobPost.findMany({
            where: {...filters, status: "Active"},
            orderBy: { postedAt: "desc"},
            include: {
                applications: true
            }
        });

        return NextResponse.json({ message: "Success", jobs: response }, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Error while search job" }, { status: 500 });
    }
}