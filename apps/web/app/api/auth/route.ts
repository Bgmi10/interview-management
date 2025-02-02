import { NextRequest, NextResponse } from "next/server";
import { prisma } from "db";
import { comparePassword, generateToken, hashPassword } from "./authUtils";


export async function POST(req: NextRequest, res: NextResponse) {
    const { email, password, action, name, role } = await req.json();

    if (!email || !password) {
        return new NextResponse(
            JSON.stringify({ error: "Email and password is required" }),
            {status: 400}
        )
    }

    try {
        if (action === "login") {
            const user = await prisma.user.findFirst({
                where: {
                    email
                }
            });

            if (!user) {
                return new NextResponse(
                    JSON.stringify({ error: "User not found" }),
                    {status: 404}
                )
            }

            const isValidPassword = await comparePassword(password, user.password);

            if (!isValidPassword) {
                return new NextResponse(
                    JSON.stringify({ error: "Invalid password" }),
                    {status: 401}
                )
            }

            const token = generateToken(user);
            res.cookies.set("token", token);
            return new NextResponse(
                JSON.stringify({ token }),
                {status: 200}
            )
        } else {
            const hashPass = await hashPassword(password);
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashPass,
                    role: role === "candidate" ? "Candidate" : "Recruiter"
                }
            });

            const token = generateToken(user);
            res.cookies.set("token", token);
            return new NextResponse(
                JSON.stringify({ token }),
                {status: 201}
            )
        }
    } catch (e) {
        console.log(e);
        return new NextResponse(
            JSON.stringify({ error: "Something went wrong" }),
            {status: 500}
        )
    }
}



export async function GET(req: NextRequest) { 
return new NextResponse(JSON.stringify({ message: "Hello" }), {status: 200});
}
