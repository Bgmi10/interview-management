import { prisma } from "db";
import { serialize } from "cookie";
import { comparePassword, generateToken } from "../utils/authutils";

export async function POST(req: Request) {
    const { email, password }: { email: string, password: string } = await req.json();

    if (!email || !password) {
        return new Response(
            JSON.stringify({ message: "Invalid data" }),
            { status: 400 }
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }

        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            return new Response(
                JSON.stringify({ message: "Invalid password" }),
                { status: 401 }
            );
        }

        // Generate auth token
        const token = generateToken(user);

        // Set both token and role in cookies
        const tokenCookie = serialize("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60,
            sameSite: "lax"
        });

        const roleCookie = serialize("role", user.role, {
            httpOnly: false,  // Accessible by client-side for UI changes
            path: "/",
            maxAge: 60 * 60,
            sameSite: "lax"
        });

        const headers = new Headers();
        headers.append("Set-Cookie", tokenCookie);
        headers.append("Set-Cookie", roleCookie);

        return new Response(
            JSON.stringify({ message: "User authorized", role: user.role }),
            { status: 200, headers: headers }
        );
    } catch (e) {
        console.error(e);
        return new Response(
            JSON.stringify({ message: "Internal server error" }),
            { status: 500 }
        );
    }
}
