import { prisma } from "db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = await req.json();
    
    if (!userId) {
        return NextResponse.json({ message: "Missing body" }, { status: 400 });
    }

    try { 
      const viewes = await prisma.profileView.findMany({ 
        where: {
            viewedId: Number(userId),
        },
        include: { 
            viewed: {
                select: {
                    id: true,
                    createdAt: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    profilePic: true,
                }
            }
        },
        orderBy: { viewedAt: "desc" }
      });

      return NextResponse.json({ message: "viewed by" , data: viewes }, { status: 200 });
    } catch (e) {
        console.log(e);
        NextResponse.json({ message: "Error while getting viewed data"});
    }
} 