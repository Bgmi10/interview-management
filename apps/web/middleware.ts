import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;
    declare module "next/server" {
        interface NextRequest {
            user?: any;
        }
    }

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  if (!token?.value) {
   return NextResponse.redirect(new URL('/login', req.url));
  }    
  try {
    const decoded = jwt.verify(token?.value, secret);
    console.log(decoded);
    req.user = decoded
    return NextResponse.next();
  } catch (e) {
    console.log(e);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
    matcher: [],
}