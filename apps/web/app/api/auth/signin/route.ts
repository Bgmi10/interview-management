import { prisma } from "db";
import { serialize } from "cookie";
import { comparePassword, generateToken } from "../utils/authutils";

export async function POST(req: Request) {
    const { email, password }: { email: string, password: string } = await req.json();

    if (!email || !password) {
        return new Response(
            JSON.stringify({ message: "Invalid data"}),
            { status: 400 }
        )
    }

    try {
      const user = await prisma.user.findUnique({
          where: { email }
      });
  
      if (!user) {
        return new Response(
         JSON.stringify({ message: "user not found" }),
         { status: 404 }
        )
      }
  
      const isValidPassword = await comparePassword(password, user.password);
  
      if (!isValidPassword) {
        return new Response(
          JSON.stringify({ message: "Invalid password" }),
          { status: 401 }
        )
      }
  
      const token = generateToken(user);
      const cookie = serialize("token", token, {  
          httpOnly: false,
          path: "/",
          maxAge: 60 * 60,
          sameSite: "lax"
      });
  
      const headers = new Headers();
      headers.append("Set-Cookie", cookie);
  
      return new Response(
        JSON.stringify({ message: "User authorized" }),
        { status: 200, headers: headers }
      )
    } catch (e) {
        console.log(e);
        new Response(
            JSON.stringify({ message: "Internal server error" }),
            { status: 500 } 
        )
    }

}