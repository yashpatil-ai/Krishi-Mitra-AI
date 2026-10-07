import { useState } from "react"
import type { FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { Bot, Loader2, Send, User } from "lucide-react"

import { chatWithAI } from "@/services/aiApi"

interface Message {
  role: "user" | "assistant"
  content: string
}

const suggestedQuestionKeys = [
  "suggestedIrrigation",
  "suggestedActiveCrop",
  "suggestedFarmManagement",
  "suggestedWeather",
]

function AIAssistant() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! I am KrishiMitra AI. I can help you with your farm, crops, irrigation, weather, soil, fertilizer, and plant health.",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const message = input.trim()

    if (!message || loading) {
      return
    }

    setMessages((current) => [
      ...current,
      { role: "user", content: message },
    ])

    setInput("")
    setLoading(true)

    try {
      const result = await chatWithAI({
        message,
      })

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: result.response,
        },
      ])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? `${t("aiRequestFailed")}: ${error.message}`
              : t("aiRequestFailedNow"),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function askSuggestedQuestion(question: string) {
    setInput(t(question))
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <section>
        <p className="text-sm font-medium text-primary">
          {t("agriculturalIntelligence")}
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          KrishiMitra AI
        </h1>

        <p className="mt-2 text-muted-foreground">
          Ask questions about your farm, crops, irrigation, weather, soil,
          fertilizer, and plant health.
        </p>
      </section>

      <section className="flex min-h-[600px] flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b p-5">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bot className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">{t("farmAssistant")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("poweredByLocalAI")}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bot className="size-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>

              {message.role === "user" && (
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="size-4" />
              </div>

              <div className="rounded-xl bg-muted px-4 py-3">
                <Loader2 className="size-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestedQuestionKeys.map((question) => (
              <button
                key={t(question)}
                type="button"
                onClick={() => askSuggestedQuestion(question)}
                className="rounded-full border px-3 py-2 text-xs transition-colors hover:border-primary hover:bg-primary/5"
              >
                {t(question)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t("askKrishiMitra")}
              disabled={loading}
              className="min-w-0 flex-1 rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {t("send")}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default AIAssistant

