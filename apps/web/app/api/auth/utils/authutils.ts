import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async (password: string, hashedPassword: string) => {
   return await bcrypt.compare(password, hashedPassword);
}

export const generateToken = (user: any) => {
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role}, process.env.JWT_SECRET as string, {expiresIn: "1d"});
    return token;
}

export const verifyToken = (cookies: any) => {
    const token = cookies.get("token");
    if (!token) {
        return new Response(
            JSON.stringify({ message: "Invalid Token" }),
            { status: 400 }
        )
    };

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET as string);
    return decoded;
}

export const generateRandomOtp = () => {
    return Math.floor(Math.random() * 900000) + 100000;
}
