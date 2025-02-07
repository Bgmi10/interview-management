import { prisma } from "db";
import { generateRandomOtp, hashPassword } from "../utils/authutils";

export async function POST (req: Request) {
   const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ message: "Email is required" }),
        { status: 400 }
      )
    }
    
    const existingUser = await prisma.user.findUnique({ 
        where: { email }
    })

    if (!existingUser) {
        return new Response(
            JSON.stringify({ message: "User not found" }),
            { status: 404 }
        )
    }

    const otp: number = generateRandomOtp();
    console.log(otp);
    //const success = await SenOtpEmail();

    const expTime = new Date(Date.now() + 1 * 60 * 1000);

    try {
       const hashedOtp = await  hashPassword(otp.toString());
       await prisma.otp.upsert({
        where: { email },
        update: {
          otp: hashedOtp,   
          expTime,          
          updatedAt: new Date()
        },
        create: {
          otp: hashedOtp,    
          expTime,           
          createdAt: new Date(),
          updatedAt: new Date(),
          email           
        }
      });

       return new Response(
        JSON.stringify({ message: "Otp sent successfully" }),
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