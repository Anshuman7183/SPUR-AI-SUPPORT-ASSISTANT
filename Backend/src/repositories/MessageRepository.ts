import { prisma } from "../config/prisma";

type MessageSender = "USER" | "AI";

export class MessageRepository {
  create(conversationId: string, sender: MessageSender, content: string) {
    return prisma.message.create({
      data: {
        conversationId,
        sender,
        content,
      },
    });
  }

  getByConversationId(conversationId: string) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
  }
}
