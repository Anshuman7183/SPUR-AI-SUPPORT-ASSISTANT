import { createClient } from "redis";

import { env } from "../config/env";

const CONVERSATION_CACHE_TTL_SECONDS = 30 * 60;

export class RedisService {
  private client = createClient({
    url: env.REDIS_URL,
  });

  private isReady = false;

  constructor() {
    this.client.on("ready", () => {
      this.isReady = true;
    });

    this.client.on("end", () => {
      this.isReady = false;
    });

    this.client.on("error", () => {
      this.isReady = false;
    });
  }

  async getConversationCache(sessionId: string) {
    try {
      await this.connect();
      const cachedMessages = await this.client.get(this.getCacheKey(sessionId));

      return cachedMessages ? JSON.parse(cachedMessages) : null;
    } catch {
      return null;
    }
  }

  async setConversationCache(sessionId: string, messages: unknown) {
    try {
      await this.connect();
      await this.client.set(this.getCacheKey(sessionId), JSON.stringify(messages), {
        EX: CONVERSATION_CACHE_TTL_SECONDS,
      });
    } catch {
      return;
    }
  }

  async deleteConversationCache(sessionId: string) {
    try {
      await this.connect();
      await this.client.del(this.getCacheKey(sessionId));
    } catch {
      return;
    }
  }

  private async connect() {
    if (!this.isReady) {
      await this.client.connect();
    }
  }

  private getCacheKey(sessionId: string) {
    return `conversation:${sessionId}`;
  }
}
