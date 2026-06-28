# modelctl

A local-first chat interface for [Ollama](https://ollama.com). Run and chat with local LLMs entirely on your machine—no cloud, no accounts, and no data leaving your device.

---

## Features

- **Streaming responses**: Tokens appear as they are generated, with a live cursor indicator.
- **Multi-conversation history**: Sidebar with persistent chat history saved to `localStorage`.
- **Conversation search**: Filter chats by title in the sidebar.
- **Markdown rendering**: Full markdown support including tables, blockquotes, and lists.
- **Syntax-highlighted code blocks**: Language label with a copy-to-clipboard button.
- **Virtualized message list**: Only visible messages are rendered to keep long conversations fast.
- **Regenerate response**: Re-run the last assistant reply with a single click.
- **Edit user message**: Edit any sent message to re-send and fork the conversation from that point.
- **Stop generation**: Cancel a response mid-stream.
- **Token counter**: Estimated context usage shown above the input with a progress bar and warnings.
- **Keyboard shortcuts**: `Ctrl+Shift+O` for a new chat, `Enter` to send, `Shift+Enter` for a newline.
- **Model switching**: Dropdown listing all models available in your Ollama instance.
- **Environment configuration**: Ollama URL configurable via `.env`.

---

## Requirements

| Dependency | Version |
|---|---|
| [Ollama](https://ollama.com) | Any recent version |
| Python | 3.10+ |
| Node.js | 18+ |

---

## Installation and Setup

### 1. Ollama Setup

Ensure [Ollama](https://ollama.com) is installed on your system. For installation details, please visit the [official Ollama download page](https://ollama.com/download).

Once installed, make sure the Ollama service is running and you have pulled a model to use:

```bash
# Start Ollama (if not already running)
ollama serve

# Pull your model of choice
ollama pull llama3
```

---

### 2. Backend Setup

The backend is built with FastAPI and handles communication with the Ollama service.

#### Windows (Command Prompt / PowerShell)
1. Navigate to the backend directory:
   ```cmd
   cd backend
   ```
2. Create a virtual environment:
   ```cmd
   python -m venv .venv
   ```
3. Activate the virtual environment:
   - **Command Prompt**:
     ```cmd
     .venv\Scripts\activate.bat
     ```
   - **PowerShell**:
     ```powershell
     .venv\Scripts\Activate.ps1
     ```
4. Install dependencies:
   ```cmd
   pip install -r requirements.txt
   ```
5. Start the FastAPI server:
   ```cmd
   uvicorn main:app --reload
   ```

#### macOS & Linux
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python3 -m venv .venv
   ```
3. Activate the virtual environment:
   ```bash
   source .venv/bin/activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

The backend server runs locally at `http://localhost:8000`.

---

### 3. Frontend Setup

The frontend is a React application built with Vite.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the package dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

Once started, open `http://localhost:5173` in your web browser.

---

## Configuration (Optional)

By default, the application connects to Ollama at `http://localhost:11434`. 

If your Ollama service is hosted on a different machine or port, copy the example environment configuration file to `backend/.env` and update the variables:

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | The API endpoint of your running Ollama service |

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

The Vite dev server proxies all `/api/*` requests to the FastAPI backend to prevent CORS issues during development. The backend streams Ollama's NDJSON response directly to the browser using FastAPI's `StreamingResponse`.

---

## Tech Stack

| Layer | Technologies and Libraries |
|---|---|
| **Backend** | FastAPI, Uvicorn, httpx, Pydantic, python-dotenv |
| **Frontend** | React 18, Vite 5, react-markdown, react-syntax-highlighter |
| **Virtualization** | @tanstack/react-virtual |
| **LLM Runtime** | Ollama |

---

## Development Notes

- **Token counter**: Estimates usage as `total characters ÷ 4` — a rough approximation for English text. It is intended as a general indicator, not a precise measurement. Accuracy varies by model and language.
- **Context limit**: Set to a conservative 8192 tokens. Most models support at least this much; many support significantly more. The counter warns at 60% and 85% of this value.
