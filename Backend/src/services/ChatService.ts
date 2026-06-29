import { ConversationRepository } from "../repositories/ConversationRepository";
import { MessageRepository } from "../repositories/MessageRepository";
import { GeminiService } from "./GeminiService";
import { RedisService } from "./RedisService";

type ChatMessage = {
  sender: "USER" | "AI";
  content: string;
};

const FALLBACK_RESPONSE =
  "Sorry, I am having trouble processing your request right now. Please try again in a moment.";

export class ChatService {
  private conversationRepository = new ConversationRepository();
  private messageRepository = new MessageRepository();
  private redisService = new RedisService();
  private geminiService = new GeminiService();

  async sendMessage(sessionId: string, userMessage: string) {
    try {
      const conversation =
        (await this.conversationRepository.getBySessionId(sessionId)) ??
        (await this.conversationRepository.create(sessionId));

      const history = await this.getHistory(sessionId, conversation.id);
      const response = await this.geminiService.generateReply(
        history,
        userMessage,
      );

      await this.messageRepository.create(conversation.id, "USER", userMessage);
      await this.messageRepository.create(conversation.id, "AI", response);

      await this.redisService.setConversationCache(sessionId, [
        ...history,
        { sender: "USER", content: userMessage },
        { sender: "AI", content: response },
      ]);

      return { sessionId, response };
    } catch {
      return { sessionId, response: FALLBACK_RESPONSE };
    }
  }

  private async getHistory(sessionId: string, conversationId: string) {
    const cachedHistory = await this.redisService.getConversationCache(sessionId);

    if (Array.isArray(cachedHistory)) {
      return cachedHistory
        .filter((message): message is ChatMessage => this.isChatMessage(message));
    }

    const messages =
      await this.messageRepository.getByConversationId(conversationId);

    const history = messages.map((message) => ({
      sender: message.sender,
      content: message.content,
    }));

    await this.redisService.setConversationCache(sessionId, history);

    return history;
  }

  private isChatMessage(message: unknown): message is ChatMessage {
    return (
      typeof message === "object" &&
      message !== null &&
      "sender" in message &&
      "content" in message &&
      (message.sender === "USER" || message.sender === "AI") &&
      typeof message.content === "string"
    );
  }
}
