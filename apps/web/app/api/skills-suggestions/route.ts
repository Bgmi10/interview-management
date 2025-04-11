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

    const prompt = `You are a smart skill suggestion engine. Based on the user's partial input, suggest 10 relevant, modern technical or soft skills that match or complete the input.
    
    Consider:
    1. In-demand skills across tech, product, design, marketing, and data
    2. AI-related, cloud, and automation skills
    3. Soft skills like leadership, critical thinking, or collaboration
    4. Popular skills found on resumes, LinkedIn, and job descriptions
    5. Variants of skill types (e.g., frameworks, tools, practices)

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
    console.error("Error generating skill suggestions:", error);
    return NextResponse.json(
      { message: "Failed to generate suggestions", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
