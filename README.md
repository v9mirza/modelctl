# modelctl

A local-first chat interface for [Ollama](https://ollama.com). Run and chat with local LLMs entirely on your machine — no cloud, no accounts, no data leaving your device.

---

## Features

- **Streaming responses** — tokens appear as they're generated, with a live cursor indicator
- **Multi-conversation history** — sidebar with persistent chat history saved to `localStorage`
- **Conversation search** — filter chats by title in the sidebar
- **Markdown rendering** — full markdown support including tables, blockquotes, and lists
- **Syntax-highlighted code blocks** — language label + per-block copy button
- **Virtualized message list** — only visible messages are rendered, so long conversations stay fast
- **Regenerate response** — re-run the last assistant reply with one click
- **Edit user message** — click ✏ on any message to edit and re-send from that point
- **Stop generation** — cancel a response mid-stream
- **Token counter** — estimated context usage shown above the input with a fill bar and warnings
- **Keyboard shortcuts** — `Ctrl+Shift+O` for new chat, `Enter` to send, `Shift+Enter` for newline
- **Model switching** — dropdown lists all models available in your Ollama instance
- **Environment config** — Ollama URL configurable via `.env`

---

## Requirements

| Dependency | Version |
|---|---|
| [Ollama](https://ollama.com) | any recent |
| Python | 3.10+ |
| Node.js | 18+ |

---

## Getting Started

### 1. Start Ollama

```bash
ollama serve
```

Pull a model if you haven't already:

```bash
ollama pull llama3
```

### 2. Start the backend

```bash
cd backend

python3 -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload
```

The API server runs at `http://localhost:8000`.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Configuration

Copy the example env file and edit as needed:

```bash
cp backend/.env.example backend/.env
```

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | URL of your Ollama instance |

This is useful if Ollama is running on a different machine or port.

---

## Architecture

```
Browser (React + Vite :5173)
    │
    │  fetch /api/*  →  Vite dev proxy
    ▼
FastAPI (:8000)
    │
    │  httpx async stream
    ▼
Ollama (:11434)  →  Local LLM
```

The Vite dev server proxies all `/api/*` requests to the FastAPI backend, so there are no CORS issues during development. The backend streams Ollama's NDJSON response directly to the browser using FastAPI's `StreamingResponse`.

---

## Tech Stack

| Layer | Libraries |
|---|---|
| Backend | FastAPI, Uvicorn, httpx, Pydantic, python-dotenv |
| Frontend | React 18, Vite 5, react-markdown, react-syntax-highlighter |
| Virtualization | @tanstack/react-virtual |
| LLM runtime | Ollama (external) |

---

## Development Notes

**Token counter** estimates usage as `total characters ÷ 4` — a rough approximation for English text. It's intended as a general indicator, not a precise measurement. Accuracy varies by model and language.

**Context limit** is set to a conservative 8192 tokens. Most models support at least this much; many support significantly more. The counter warns at 60% and 85% of this value.
