import { useEffect, useRef } from "react";

import { type ChatMessage, MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

type ChatWindowProps = {
  error?: string;
  isLoading?: boolean;
  messages: ChatMessage[];
  onSend: (message: string) => void;
};

const FAQ_SUGGESTIONS = [
  { label: "Shipping Policy", question: "What is your shipping policy?" },
  {
    label: "International Shipping",
    question: "Do you offer international shipping?",
  },
  { label: "Return Policy", question: "What is your return policy?" },
  { label: "Refund Policy", question: "What is your refund policy?" },
  { label: "Support Hours", question: "What are your support hours?" },
];

function LoadingIndicator() {
  return (
    <div style={{ color: "#6b7280", fontSize: 14, padding: "4px 0" }}>
      AI is typing...
    </div>
  );
}

export function ChatWindow({
  error,
  isLoading = false,
  messages,
  onSend,
}: ChatWindowProps) {
  const latestMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isLoading]);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 760,
        height: "min(720px, calc(100vh - 32px))",
        margin: "0 auto",
        padding: 16,
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        background: "#ffffff",
      }}
    >
      <header
        style={{
          paddingBottom: 12,
          marginBottom: 12,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          Spur AI Support Assistant
        </h1>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 14,
            color: "#6b7280",
          }}
        >
          Instant support for shipping, returns, refunds, and store questions.
        </p>
      </header>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {messages.length === 0 && !isLoading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              padding: "24px 8px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 500,
                color: "#111827",
              }}
            >
              Welcome to Spur Store Support
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "center",
              }}
            >
              {FAQ_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  disabled={isLoading}
                  onClick={() => onSend(suggestion.question)}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: 999,
                    background: "#ffffff",
                    color: "#111827",
                    fontSize: 13,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    font: "inherit",
                  }}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <LoadingIndicator />}
        <div ref={latestMessageRef} />
      </div>
      {error && (
        <div style={{ color: "#b91c1c", fontSize: 14, paddingTop: 10 }}>
          {error}
        </div>
      )}
      <MessageInput disabled={isLoading} onSend={onSend} />
    </section>
  );
}
