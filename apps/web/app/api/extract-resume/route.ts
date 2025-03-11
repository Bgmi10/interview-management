import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CONVERT_API_KEY = process.env.CONVERT_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      console.error('Missing Gemini API key');
      return NextResponse.json(
        { error: 'Server configuration error (missing Gemini API key)' }, 
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ error: 'No resume file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    const extractedTextUrl = await convertPdfToText(file);
    
    const textContent = await fetchTextContent(extractedTextUrl);
    
    const resumeData = await parseResumeWithGemini(textContent);
    
    return NextResponse.json(resumeData);
  } catch (error: any) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: `Failed to process resume: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

async function convertPdfToText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    const response: any = await axios.post(
      "https://v2.convertapi.com/convert/pdf/to/txt",
      {
        Parameters: [
          {
            Name: "File",
            FileValue: {
              Name: file.name,
              Data: base64Data,
            },
          },
          {
            Name: "StoreFile",
            Value: true,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${CONVERT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.Files && response.data.Files.length > 0) {
      return response.data.Files[0].Url;
    }

    throw new Error("Failed to extract text from PDF");
  } catch (error: any) {
    console.error("Error in ConvertAPI:", error);
    throw new Error(`ConvertAPI error: ${error.message || "Unknown error"}`);
  }
}

async function fetchTextContent(url: string): Promise<string> {
  try {
    const response: any = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching text content:", error);
    throw new Error(`Failed to fetch text content: ${error.message || "Unknown error"}`);
  }
}

async function parseResumeWithGemini(resumeText: string): Promise<any> {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const truncatedText = resumeText.slice(0, 15000); 
    
    const prompt = `
      Parse the following resume text and extract the relevant information in JSON format.
      If you can't find a specific field, leave it empty.
      
      Return data in this JSON format:
      {
        "firstName": "",
        "lastName": "",
        "email": "",
        "phoneNumber": "",
        "linkedIn": "",
        "portfolioUrl": "",
        "collageName": "", 
        "skills": [],
        "experience": "",
        "specilization": ""
      }
      
      Resume text:
      ${truncatedText}
      
      Return only valid JSON, nothing else.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(responseText);
  } catch (error: any) {
    console.error('Error with Gemini API:', error);
    throw new Error(`Gemini API error: ${error.message || "Unknown error"}`);
  }
}