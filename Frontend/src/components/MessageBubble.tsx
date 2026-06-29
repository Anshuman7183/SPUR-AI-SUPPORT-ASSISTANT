import { useState } from "react";

export type ChatMessage = {
  id: string;
  sender: "USER" | "AI";
  content: string;
  createdAt?: string;
};

type MessageBubbleProps = {
  message: ChatMessage;
};

function formatTimestamp(createdAt?: string) {
  if (!createdAt) {
    return "";
  }

  return new Date(createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "USER";
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      return;
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: 4,
      }}
    >
      <div
        style={{
          maxWidth: "min(75%, 560px)",
          padding: "10px 12px",
          borderRadius: 8,
          background: isUser ? "#1f2937" : "#f3f4f6",
          color: isUser ? "#ffffff" : "#111827",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
      >
        {message.content}
        {message.createdAt && (
          <div
            style={{
              marginTop: 6,
              fontSize: 11,
              opacity: 0.7,
            }}
          >
            {formatTimestamp(message.createdAt)}
          </div>
        )}
      </div>
      {!isUser && (
        <button
          type="button"
          onClick={handleCopy}
          style={{
            padding: 0,
            border: 0,
            background: "transparent",
            color: copied ? "#059669" : "#6b7280",
            fontSize: 12,
            cursor: "pointer",
            font: "inherit",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      )}
    </div>
  );
}
