# modelctl

A minimal, local-first web interface for Ollama.

## Features

- **Local LLM Chat**: Interact with models running on your local machine.
- **Streaming**: Real-time token streaming for fast responses.
- **Model Switching**: Dynamic selection of available Ollama models.
- **Privacy**: All data remains local.

## Prerequisites

- **Ollama**: running locally (`ollama serve`)
- **Python 3.10+**
- **Node.js 18+**

## Setup

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to use the application.

## architecture

The application uses a FastAPI backend to proxy requests to a local Ollama instance, ensuring proper stream handling and CORS management. The frontend is built with React/Vite and uses `ReadableStream` for handling NDJSON responses.
