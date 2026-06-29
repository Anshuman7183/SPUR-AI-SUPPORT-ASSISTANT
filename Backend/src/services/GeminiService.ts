import { env } from "../config/env";

type ChatMessage = {
  sender: "USER" | "AI";
  content: string;
};

type GeminiContent = {
  role: "user" | "model";
  parts: { text: string }[];
};

type ApiErrorLike = {
  status: number;
  message: string;
};

const MODEL = "gemini-2.5-flash";
const MAX_CONTEXT_MESSAGES = 10;
const SYSTEM_PROMPT =
  "You are a helpful support agent for a small ecommerce business.\nAnswer customer questions clearly, professionally and concisely.";
const FALLBACK_MESSAGE =
  "Sorry, I am having trouble responding right now. Please try again in a moment.";
const INVALID_API_KEY_MESSAGE =
  "Sorry, the assistant is temporarily unavailable. Please try again later.";
const RATE_LIMIT_MESSAGE =
  "We're experiencing high demand right now. Please wait a moment and try again.";
const TIMEOUT_MESSAGE =
  "The request took too long to complete. Please try again.";

export class GeminiService {
  async generateReply(history: ChatMessage[], userMessage: string) {
    if (!env.GEMINI_API_KEY) {
      console.error("[GeminiService] GEMINI_API_KEY is not configured");
      return INVALID_API_KEY_MESSAGE;
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
      const recentHistory = history.slice(-MAX_CONTEXT_MESSAGES);
      const response = await client.models.generateContent({
        model: MODEL,
        contents: [
          ...recentHistory.map((message) => this.toContent(message)),
          this.toContent({ sender: "USER", content: userMessage }),
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });

      return response.text?.trim() || FALLBACK_MESSAGE;
    } catch (error) {
      this.logGeminiFailure(error);
      return this.getUserFriendlyErrorMessage(error);
    }
  }

  private getUserFriendlyErrorMessage(error: unknown) {
    if (this.isApiError(error)) {
      if (error.status === 401 || error.status === 403) {
        return INVALID_API_KEY_MESSAGE;
      }

      if (error.status === 429) {
        return RATE_LIMIT_MESSAGE;
      }
    }

    if (this.isTimeoutError(error)) {
      return TIMEOUT_MESSAGE;
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      if (
        message.includes("api key") ||
        message.includes("api_key") ||
        message.includes("unauthorized")
      ) {
        return INVALID_API_KEY_MESSAGE;
      }

      if (
        message.includes("rate limit") ||
        message.includes("quota") ||
        message.includes("resource exhausted")
      ) {
        return RATE_LIMIT_MESSAGE;
      }
    }

    return FALLBACK_MESSAGE;
  }

  private isApiError(error: unknown): error is ApiErrorLike {
    return (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as ApiErrorLike).status === "number" &&
      "message" in error &&
      typeof (error as ApiErrorLike).message === "string"
    );
  }

  private isTimeoutError(error: unknown) {
    if (!(error instanceof Error)) {
      return false;
    }

    const message = error.message.toLowerCase();
    const code = (error as NodeJS.ErrnoException).code;

    return (
      error.name === "AbortError" ||
      error.name === "TimeoutError" ||
      code === "ETIMEDOUT" ||
      code === "ESOCKETTIMEDOUT" ||
      message.includes("timeout") ||
      message.includes("timed out")
    );
  }

  private logGeminiFailure(error: unknown) {
    if (this.isApiError(error)) {
      console.error("[GeminiService] Gemini API error", {
        status: error.status,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error) {
      console.error("[GeminiService] Gemini request failed", {
        name: error.name,
        message: error.message,
      });
      return;
    }

    console.error("[GeminiService] Gemini request failed with unknown error", error);
  }

  private toContent(message: ChatMessage): GeminiContent {
    return {
      role: message.sender === "USER" ? "user" : "model",
      parts: [{ text: message.content }],
    };
  }
}
