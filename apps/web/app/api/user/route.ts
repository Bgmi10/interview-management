import { prisma } from "db";
import { verifyToken } from "../auth/utils/authutils";

//@ts-ignore
export async function GET (req) {
    
    const cookies = req.cookies;
    const token = cookies.get("token");

    if (!token) {
        return new Response(
            JSON.stringify({ message: "Invalid Token" }),
            { status: 400 }
        )
    };
    const user = verifyToken(token?.value);

    try{
        const existingUser = await prisma.user.findUnique({
            //@ts-ignore
            where: { email: user?.email }, 
            select: {
                name: true,
                email: true,
                role: true,
            }
        });

        if (!existingUser) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            )
        }

        return new Response(
            JSON.stringify({ message: "success", data: existingUser }),
            { status: 200 }
        )

    } catch (e) {
        console.log(e);
        return new Response(
            JSON.stringify({ message: "Internal server error" }),
            { status: 500 }
        )
    }
}