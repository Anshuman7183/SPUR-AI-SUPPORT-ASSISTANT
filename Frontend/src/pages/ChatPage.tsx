import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { ChatWindow } from "../components/ChatWindow";
import { type ChatMessage } from "../components/MessageBubble";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";
const SESSION_ID_KEY = "chatSessionId";

type HistoryMessage = ChatMessage & {
  createdAt: string;
};

type SendMessageResponse = {
  reply: string;
  sessionId: string;
};

function getSessionId() {
  const existingSessionId = localStorage.getItem(SESSION_ID_KEY);

  if (existingSessionId) {
    return existingSessionId;
  }

  const sessionId = crypto.randomUUID();
  localStorage.setItem(SESSION_ID_KEY, sessionId);

  return sessionId;
}

export function ChatPage() {
  const [sessionId, setSessionId] = useState(getSessionId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const hasLoadedHistory = useRef(false);

  useEffect(() => {
    if (hasLoadedHistory.current) {
      return;
    }

    hasLoadedHistory.current = true;
    setIsLoading(true);

    axios
      .get<HistoryMessage[]>(
        `${API_BASE_URL}/chat/history/${encodeURIComponent(sessionId)}`,
      )
      .then((response) => {
        setMessages(
          response.data.map((message) => ({
            id: message.id,
            sender: message.sender,
            content: message.content,
            createdAt: message.createdAt,
          })),
        );
      })
      .catch(() => {
        setError("Could not load chat history. You can still send a message.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sessionId]);

  async function handleSend(message: string) {
    setError("");
    const userCreatedAt = new Date().toISOString();
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: crypto.randomUUID(),
        sender: "USER",
        content: message,
        createdAt: userCreatedAt,
      },
    ]);
    setIsLoading(true);

    try {
      const response = await axios.post<SendMessageResponse>(
        `${API_BASE_URL}/chat/message`,
        {
          message,
          sessionId,
        },
      );

      localStorage.setItem(SESSION_ID_KEY, response.data.sessionId);
      setSessionId(response.data.sessionId);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          sender: "AI",
          content: response.data.reply,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch {
      setError("Could not send your message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 16,
        background: "#f9fafb",
        boxSizing: "border-box",
      }}
    >
      <ChatWindow
        error={error}
        isLoading={isLoading}
        messages={messages}
        onSend={handleSend}
      />
    </main>
  );
}
