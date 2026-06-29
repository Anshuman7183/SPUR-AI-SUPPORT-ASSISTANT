import { prisma } from "../config/prisma";

export class ConversationRepository {
  getBySessionId(sessionId: string) {
    return prisma.conversation.findUnique({
      where: { sessionId },
    });
  }

  create(sessionId: string) {
    return prisma.conversation.create({
      data: { sessionId },
    });
  }
}
