import { randomUUID } from "node:crypto";

import { type RequestHandler } from "express";

import { ConversationRepository } from "../repositories/ConversationRepository";
import { MessageRepository } from "../repositories/MessageRepository";
import { ChatService } from "../services/ChatService";

type SendMessageBody = {
  message: string;
  sessionId?: string;
};

export class ChatController {
  private chatService = new ChatService();
  private conversationRepository = new ConversationRepository();
  private messageRepository = new MessageRepository();

  sendMessage: RequestHandler = async (req, res, next) => {
    try {
      const { message, sessionId } = req.body as SendMessageBody;
      const result = await this.chatService.sendMessage(
        sessionId ?? randomUUID(),
        message,
      );

      res.status(200).json({
        reply: result.response,
        sessionId: result.sessionId,
      });
    } catch (error) {
      next(error);
    }
  };

  getHistory: RequestHandler = async (req, res, next) => {
    try {
      const { sessionId } = req.params as { sessionId: string };
      const conversation =
        await this.conversationRepository.getBySessionId(sessionId);

      if (!conversation) {
        res.status(200).json([]);
        return;
      }

      const messages = await this.messageRepository.getByConversationId(
        conversation.id,
      );

      res.status(200).json(
        messages.map((message) => ({
          id: message.id,
          sender: message.sender,
          content: message.content,
          createdAt: message.createdAt,
        })),
      );
    } catch (error) {
      next(error);
    }
  };
}
