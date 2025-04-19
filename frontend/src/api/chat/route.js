import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { messages } = await req.json()
    const model = google("models/gemini-1.5-pro-latest")

    const result = await streamText({
      model,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
