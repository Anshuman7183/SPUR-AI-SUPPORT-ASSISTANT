import { type FormEvent, useState } from "react";

type MessageInputProps = {
  disabled?: boolean;
  onSend: (message: string) => void;
};

export function MessageInput({ disabled = false, onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) {
      return;
    }

    onSend(trimmedMessage);
    setMessage("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: 8,
        paddingTop: 12,
      }}
    >
      <input
        value={message}
        disabled={disabled}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type your message..."
        style={{
          flex: 1,
          minWidth: 0,
          padding: "10px 12px",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          font: "inherit",
        }}
      />
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        style={{
          padding: "10px 16px",
          border: 0,
          borderRadius: 8,
          background: "#111827",
          color: "#ffffff",
          cursor: disabled ? "not-allowed" : "pointer",
          font: "inherit",
        }}
      >
        Send
      </button>
    </form>
  );
}
