import { Router } from "express";

import { ChatController } from "../controllers/ChatController";
import { validateRequest } from "../middleware/validateRequest";
import {
  chatHistoryParamsSchema,
  sendMessageSchema,
} from "../validators/chat.validators";

const chatController = new ChatController();

export const chatRouter = Router();

chatRouter.post(
  "/message",
  validateRequest({ body: sendMessageSchema }),
  chatController.sendMessage,
);

chatRouter.get(
  "/history/:sessionId",
  validateRequest({ params: chatHistoryParamsSchema }),
  chatController.getHistory,
);
