import { prisma } from "db";
import { generateToken, hashPassword } from "../utils/authutils";
import { serialize } from "cookie"; 

export async function POST(req: Request) {
    const { name, email, password, role }: { name: string; email: string; password: string; role?: string } = await req.json();
    
    if (!name || !email || !password) {
        return new Response(
            JSON.stringify({
                message: "Invalid body"
            }),
            { status: 400 }
        )
    }

    try{
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (user) {
        return new Response(
            JSON.stringify({
                message: "User already exist"
            }),
            { status: 400 }
        )
      }
      
      const hashPass = await hashPassword(password);
      
      const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPass,
            role: role === "candidate" ? "Candidate" : "Recruiter"
        }
      });

      const token = generateToken(createdUser);

      const cookie = serialize("token", token, {  
        httpOnly: false,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60
      });

      const headers = new Headers();
      headers.append("Set-Cookie", cookie);

      return new Response(
        JSON.stringify({
            message: "User created successfully"
        }),
        { status: 201, headers: headers }
    )
    } catch (e) {
        console.log(e);
        return new Response(
            JSON.stringify({
                message: "Internal server error"
            }),
            { status: 500 }
        )
    }
}