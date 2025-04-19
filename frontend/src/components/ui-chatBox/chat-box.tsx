/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "bot"
  content: string
  timestamp: Date
}

async function getGeminiResponse(prompt: string) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("Gemini API key is not configured")
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    console.error("Lỗi từ Gemini API:", errorData)
    throw new Error(
      `Lỗi khi gọi Gemini API: ${response.status} - ${JSON.stringify(
        errorData
      )}`
    )
  }

  return response.json()
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const trimmedInput = input.trim()
    if (!trimmedInput) return

    const userMessage: Message = {
      role: "user",
      content: trimmedInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const result = await getGeminiResponse(trimmedInput)
      const botMessage: Message = {
        role: "bot",
        content:
          result.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Không có dữ liệu trả về",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (err: any) {
      setError(err.message)
      const errorMessage: Message = {
        role: "bot",
        content: `Error: ${err.message}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      // Focus input after sending message
      if (inputRef.current) inputRef.current.focus()
    }
  }

  // Format timestamp to display as HH:MM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-96 max-w-md mx-auto rounded-lg border shadow overflow-hidden">
      {/* Chat header */}
      <div className="bg-primary p-3 text-primary-foreground flex items-center gap-2">
        <Avatar className="h-8 w-8 bg-primary-foreground text-primary flex items-center justify-center">
          <span className="text-xs font-bold">AI</span>
        </Avatar>
        <div>
          <h3 className="font-medium text-sm">Gemini Assistant</h3>
          <p className="text-xs opacity-90">Powered by Google Gemini</p>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
            Gửi tin nhắn để bắt đầu cuộc trò chuyện
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "flex mb-4",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-xs sm:max-w-sm relative group",
                msg.role === "user" ? "order-1" : "order-0"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-lg",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted rounded-bl-none"
                )}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {msg.content}
                </p>
                <span className="text-xs opacity-70 block text-right mt-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex mb-4">
            <div className="bg-muted p-3 rounded-lg rounded-bl-none max-w-xs">
              <div className="flex justify-center items-center h-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex mb-4">
            <div className="bg-destructive/10 p-3 rounded-lg text-destructive text-sm max-w-xs">
              <p>{error}</p>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="p-3 border-t bg-background">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập tin nhắn của bạn..."
            className="flex-1"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="rounded-full h-10 w-10 flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
