import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const { messages } = await req.json();

  // Add context here
  const systemMessage = {
    role: "system",
    content: `You are DWA's AI assistant. 
    Help with short messages like 10-30 words.
    respond in a helpful, respectful tone. 
    If a user asks about DWA, explain it's a software development agency providing web development, SEO, and social media automation services.`,
  };

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [systemMessage, ...messages], // Inject system context
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Groq Response:", response.data);
    const reply = response.data.choices?.[0]?.message?.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Groq Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "❌ Failed to fetch Groq response." },
      { status: 500 }
    );
  }
}
