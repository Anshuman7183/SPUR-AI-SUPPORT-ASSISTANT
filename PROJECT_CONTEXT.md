# Spur AI Live Chatbot — Project Context

## Project Goal

Build a production-quality AI customer support chatbot for a fictional ecommerce store as part of a software engineering take-home assignment.

The application should simulate a real customer support experience while demonstrating strong software engineering practices including modular architecture, persistence, caching, error handling, and deployment readiness.

---

## Current Status

### Backend

Backend implementation is mostly complete.

Implemented components:

* Express server
* TypeScript backend
* Prisma ORM integration
* PostgreSQL persistence
* Redis caching layer
* Gemini 2.5 Flash integration
* ChatService orchestration
* Repository layer
* Controllers and routes
* Request validation with Zod
* Environment variable configuration

Expected endpoints:

### GET /health

Response:

```json
{
  "status": "ok"
}
```

### POST /chat/message

Request:

```json
{
  "message": "What are your support hours?",
  "sessionId": "optional-session-id"
}
```

Response:

```json
{
  "reply": "We are available Monday to Friday from 9 AM to 6 PM IST.",
  "sessionId": "generated-or-existing-session-id"
}
```

### GET /chat/history/:sessionId

Response:

```json
{
  "messages": [...]
}
```

---

### Frontend

Frontend implementation is mostly complete.

Expected features:

* Chat interface
* Scrollable message history
* Message bubbles
* Input field
* Send button
* Loading indicator
* Session persistence via localStorage
* History restoration after refresh
* Responsive design

---

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express
* TypeScript

### Database

* PostgreSQL
* Prisma ORM

### Cache

* Redis
* Upstash Redis

### LLM

* Google Gemini 2.5 Flash
* @google/genai SDK

### Deployment Targets

Frontend:

* Vercel

Backend:

* Render

Database:

* Neon PostgreSQL

Cache:

* Upstash Redis

---

## Architecture

Frontend
↓
Backend API
↓
Redis Cache
↓
PostgreSQL
↓
Gemini API

---

## Database Schema

Conversation:

* id
* sessionId
* createdAt

Message:

* id
* conversationId
* sender
* content
* createdAt

One conversation contains multiple messages.

---

## Redis Usage

Redis caches conversation history.

Cache key format:

conversation:{sessionId}

TTL:

30 minutes

Redis failures must not break the application.

Application should gracefully fallback to PostgreSQL.

---

## Gemini Requirements

Gemini should receive:

* system prompt
* previous conversation history
* current user message

The assistant acts as an ecommerce support representative.

Supported knowledge:

* shipping policy
* return policy
* refund policy
* support hours
* international shipping
* order cancellation policy

The assistant should avoid hallucinating unsupported information.

---

## Explicitly Avoid

Do not introduce:

* LangChain
* Vector databases
* RAG
* Authentication
* Docker
* Multi-agent architectures
* WebSockets
* Additional frameworks
* Additional state management libraries

Keep architecture simple and production ready.

---

## Coding Constraints

* Keep business logic inside services.
* Repositories contain database logic only.
* Controllers remain thin.
* Avoid introducing unnecessary abstractions.
* Follow existing project structure exactly.

---

## Current Objective

The remaining work is:

1. Verify backend endpoints.
2. Verify frontend integration.
3. Test session persistence.
4. Test Redis fallback behavior.
5. Test Gemini failure handling.
6. Test edge cases.
7. Prepare deployment.
8. Prepare README.
9. Fix bugs discovered during testing.

Assume the implementation already exists and prioritize debugging, validation, and completion over rewriting existing code.
