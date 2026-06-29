import { Router } from "express";

import { chatRouter } from "./chat.routes";

export const router = Router();

router.use("/chat", chatRouter);
