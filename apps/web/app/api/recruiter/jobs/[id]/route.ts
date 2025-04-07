import { NextResponse } from "next/server";
import { prisma } from "db";

export async function PUT(req: Request, context: any) {
    const { id } = context.params;

    const { title, description, companyName, location, salary, jobType, status, companyLogo, education, experience, industryType, preferredSkills, requriedSkills, qualifications, role, responsibilities } = await req.json();

    if (!id) {
        return NextResponse.json({ messag: "Missing job id" }, { status: 400 });
    }

        try {
        const intId = parseInt(id);
        const updateExistingJobPost = await prisma.jobPost.update({
            where: { id: intId },
            data: {
              title,
              description,
              companyName,
              location,
              salary,
              jobType,
              status,
              companyLogo,
              education,
              experience,
              industryType,
              preferredSkills,
              qualifications,
              requriedSkills,
              responsibilities,
              role,
            }
        })

        return NextResponse.json({ message: "Job updated successfully", updateExistingJobPost }, { status: 200 });
        
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Error while updating job" }, { status: 500 });
    }   
}

export async function DELETE(req: Request, context: any) {

    const { id } = context.params;

    if (!id) {
        return NextResponse.json({ messag: "Missing job id" }, { status: 400 });
    }

    try {
        const intId = parseInt(id);
        await prisma.jobPost.delete({ 
            where: { id: intId }
        })
        return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Error while deleting job" }, { status: 500 });
    }    
    
}

export async function GET (req: Request, context: any) {
   const { id } = context.params;

   if (!id) {
    return NextResponse.json({ messag: "Missing job id" }, { status: 400 });
   }

   try {
    const intId = parseInt(id);
    const job = await prisma.jobPost.findUnique({ 
        where: { id: intId },
        include: { 
          applications: {
            select: {
                candidateId: true
            }
        } }
    });

    if (!job) {
        return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job, { status: 200 });
   } catch (e) {
      console.log(e);
      return NextResponse.json({ message: "Error fetching job" }, { status: 500 });
   }
}