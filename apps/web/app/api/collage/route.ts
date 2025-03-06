import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();

  try {
        const encodedData = btoa(JSON.stringify({ domain: "national", experiment: "", keyword: query }));
      
        const response = await fetch(
          `https://apis.shiksha.com/apigateway/autosuggestorApi/v1/info/getAutosuggestorResults?data=${encodedData}`
        );
        const data = await response.json();
    return NextResponse.json({ result: data });
  } catch (e) {
    return NextResponse.json({ message: "Error in Shiksha API" });
  }
}
