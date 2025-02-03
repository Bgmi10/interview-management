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
            const user = await prisma.user.findUnique({
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
            const reponse =  new NextResponse(
                JSON.stringify({ token }),
                {status: 200}
            );
            reponse.cookies.set("token", token);
            return reponse;
        } else {
            const signupUser = await prisma.user.findUnique({
                where: {
                    email
                }
            });

            if (signupUser) {
                return new NextResponse(
                    JSON.stringify({ error: "User already exist. try login" }),
                    {status: 400}
                );
            }

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
            const response = new NextResponse(
                JSON.stringify({ token }),
                {status: 200}
            );
            response.cookies.set("token", token);
            return response;
        }
    } catch (e) {
        console.log(e);
        return new NextResponse(
            JSON.stringify({ error: "Something went wrong" }),
            {status: 500}
        )
    }
}