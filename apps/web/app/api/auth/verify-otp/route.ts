import { prisma } from "db";
import { comparePassword, hashPassword } from "../utils/authutils";

export async function POST(req: Request) {
    const { otp, newpassword, email } = await req.json();

    if (!otp || !newpassword || !email) {
        return new Response(
            JSON.stringify({ message: "Invalid request" }),
            { status: 400 }
        )
    }

    try{
      const otpMatch = await prisma.otp.findUnique({
        where: { email }
      });

      if (!otpMatch) {
        return new Response(JSON.stringify({ message: "Otp not found" }), { status: 400 })
      }

      const isValidOtp = await comparePassword(otp, otpMatch?.otp);

      if (!isValidOtp) {
        return new Response(
            JSON.stringify({ message: "Incorrect otp" }),
            { status: 404 }
        )
      }

      if (otpMatch) {
        if (otpMatch.createdAt > otpMatch.expTime) {
            return new Response(
                JSON.stringify({ message: "Otp expired" }),
                { status: 401}
            )
        }
        const newHashPass = await hashPassword(newpassword);
        const user = await prisma.user.update({ 
            where: { email },
            data: {
                password: newHashPass
            }
        });

        if (user) {
            return new Response(
                JSON.stringify({ message: "Password changed successfully" }),
                { status: 200 }
            )
        }
      }
    } catch (e) {
      console.log(e);
      return new Response(
        JSON.stringify({ message: "Internal server error" }),
        { status: 500 }
      )
    }
}