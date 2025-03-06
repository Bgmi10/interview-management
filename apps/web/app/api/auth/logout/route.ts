import { serialize } from "cookie";

export function POST () {
    try{
      const cookie = serialize("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: -1,
        sameSite: "lax",
      });

      const headers = new Headers();

      headers.append("Set-Cookie", cookie);
      return new Response(
        JSON.stringify({ message: "logout success" }),
        { status: 200, headers: headers } 
      )
    } catch (e) {
        console.log(e);
        return new Response(
            JSON.stringify({ message: "Internal server error" }),
            { status: 500 } 
          )
    }
}