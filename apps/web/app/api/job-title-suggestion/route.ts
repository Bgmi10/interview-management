import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { query } = await req.json();

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!query) {
    return NextResponse.json({ message: "Missing query parameter" }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an advanced job title suggestion engine. Analyze the following partial input and provide 10 relevant, modern job title suggestions that match or complete the query. 
    
    Consider:
    1. Emerging roles in tech, healthcare, green energy, and other growing industries
    2. Hybrid roles that combine multiple disciplines
    3. AI-related and future-oriented positions
    4. Popular job titles from major job boards
    5. Variations including seniority levels (Junior, Senior, Lead, etc.)
    
    Input: "${query}"
    
    Format your response as a JSON array of strings with no additional text or explanation:
    ["suggestion 1", "suggestion 2", ...]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json|```/g, '').trim();
    const suggestions = JSON.parse(cleanText);

    return NextResponse.json({ suggestions }, { status: 200 });

  } catch (error) {
    console.error("Error generating job suggestions:", error);
    return NextResponse.json(
      { message: "Failed to generate suggestions", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}