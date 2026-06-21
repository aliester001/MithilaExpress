import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini client lazily to avoid crash if API key is not yet set
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return null or throw clear handleable error
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, chatHistory = [] } = await req.json();
    const ai = getAiClient();
    
    if (!ai) {
      return NextResponse.json({
        text: "Mithila AI Support is currently operating in offline mode. How can I help you navigate Mithila Express today?"
      });
    }

    const systemInstruction = 
      "You are 'Mithila Express Assistant', a friendly, direct, and culturally authentic food delivery guide for Mahottari District, Nepal.\n" +
      "Provide helpful food recommendations, explain delivery charges, list local specialities from Bardibas (such as pedas and sweets), Gaushala, or Jaleshwar, and help users pick popular dishes (Momo, Chowmein, Biryani, traditional Maithil Thali, Chiura, Ghugni).\n" +
      "If asked about delivery areas, mention that Mithila Express exclusively serves Mahottari District, including Bardibas, Gaushala, Jaleshwar, Aurahi, Balwa, Bhangaha, Loharpatti, Pipra, Samsi, and other local municipalities.\n" +
      "Keep answers concise (maximum 3 short paragraphs), warm, and write in clear English with a touch of hospitality. If relevant, say 'Pranam' or use warm Maithili greeting 'Sitasaran'.";

    // Format chat history for Gemini API
    const contents = [];
    for (const msg of chatHistory) {
      contents.push({
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }]
      });
    }
    
    // Add the current prompt
    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Assistant Route Error:", error);
    return NextResponse.json(
      { text: "Sitasaran! I'm experiencing a quick connection hiccup, but I am ready to help. To order Momo, Burger, or local foods, please select they from the menu below!" },
      { status: 200 } // Keep it graceful for simulator
    );
  }
}
