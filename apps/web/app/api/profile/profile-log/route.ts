import { prisma } from "db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { viewerId, viewedId } = await req.json();

    if (!viewerId || !viewedId) {
        return NextResponse.json({ message: "Missing body" }, { status: 400 });
    }
    const intViewedId = parseInt(viewedId);

    try {
        await prisma.profileView.upsert({
            where: { viewedId_viewerId: { viewedId: intViewedId, viewerId }},
            update: { viewedAt: new Date() },
            create: { viewedId, viewerId }
        });

        return NextResponse.json({ message: "profile view recorded" }, { status: 200 })
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "error while log the profile view" }, { status: 500})
    }
} 