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

### 1. Ollama Installation & Setup

Before running the application, make sure Ollama is installed and running on your system.

#### Windows
1. Download and run the installer from the [Ollama download page](https://ollama.com/download).
2. The Ollama service starts automatically in the system tray.
3. Open Command Prompt or PowerShell, and pull the desired model (e.g., Llama 3):
   ```cmd
   ollama pull llama3
   ```

#### macOS
1. Download the macOS zip file from the [Ollama download page](https://ollama.com/download) or install via Homebrew:
   ```bash
   brew install ollama
   ```
2. Start the Ollama application or run it via the terminal:
   ```bash
   ollama serve
   ```
3. In a separate terminal, pull your model of choice:
   ```bash
   ollama pull llama3
   ```

#### Linux
1. Install Ollama using the official script:
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```
2. Ensure the service is running (it typically starts automatically via systemd):
   ```bash
   sudo systemctl status ollama
   ```
3. Pull your model of choice:
   ```bash
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

## Configuration

Copy the example environment configuration file and adjust variables as necessary:

### Windows (PowerShell)
```powershell
Copy-Item backend/.env.example backend/.env
```

### Windows (Command Prompt)
```cmd
copy backend\.env.example backend\.env
```

### macOS & Linux
```bash
cp backend/.env.example backend/.env
```

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
