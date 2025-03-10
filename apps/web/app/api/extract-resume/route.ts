import pdfParse from "pdf-parse";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // Parse JSON body
        const { fileName, fileType, fileData } = await req.json();

        console.log(fileName,);

        if (!fileData || !fileName || !fileType) {
            return NextResponse.json({ message: "Missing file data" }, { status: 400 });
        }

        // console.log("Received file:", fileName, process.env.GEMINI_API_KEY);

        // // Convert base64 string to Buffer
        // const buffer = Buffer.from(fileData, "base64");

        // console.log("File converted to buffer");

        // let extractedText = "";

        // if (fileType === "application/pdf") {
        //     const pdfData = await pdfParse(buffer);
        //     extractedText = pdfData.text;
        //     console.log("Extracted PDF text:", extractedText.substring(0, 500)); // Log first 500 chars
        // } else {
        //     return NextResponse.json({ message: "Unsupported file type" }, { status: 400 });
        // }

        // if (!extractedText) {
        //     return NextResponse.json({ message: "Failed to extract text from PDF" }, { status: 400 });
        // }

        // // Prepare Gemini API request
        // const prompt = `Extract structured data from this resume: "${extractedText}". 
        // Provide JSON output with fields: 
        // {
        //   "firstName": "string",
        //   "lastName": "string",
        //   "email": "string",
        //   "phone": "string",
        //   "skills": ["string"],
        //   "experience": "string",
        //   "education": "string",
        //   "linkedIn": "string",
        //   "location": "string",
        //   "portfolio": "string"
        // }`;

        // console.log("Sending request to Gemini API");

        // const geminiResponse = await axios.post(
        //     `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${process.env.GEMINI_API_KEY}`,
        //     { contents: [{ role: "user", parts: [{ text: prompt }] }] }, // Correct format
        //     { headers: { "Content-Type": "application/json" } }
        // );

        // console.log("Gemini API Response:", geminiResponse.data);

        // return NextResponse.json({ 
        //     message: "Resume data extracted successfully", 
        //     data: geminiResponse.data 
        // }, { status: 200 });
        return NextResponse.json({ message: "Error while parsing resume" }, { status: 200 });

    } catch (e) {
        console.error("Error in API:", e);
        return NextResponse.json({ message: "Error while parsing resume" }, { status: 500 });
    }
}
