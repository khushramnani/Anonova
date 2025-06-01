import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "edge"; // if you're deploying on Vercel Edge

export async function POST(req: Request) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

  try {
    const prompt =
      "Create a list of three short, open-ended, and engaging anonymous messages formatted as a single string. Each message should be separated by '||'. These messages are for an anonymous social messaging platform, like NGL or Qooh.me, where the recipient cannot reply directly. Avoid explicit or sensitive content, and focus on light confessions, playful curiosity, anonymous compliments, and creative thoughts. Messages should feel spontaneous and safe for all audiences. Keep the tone casual, feedbacks , questions, or flirty to spark intrigue and fun. Return only the string, without any introduction, explanation, or formatting";

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/^"(.*)"$/, '$1');

    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
