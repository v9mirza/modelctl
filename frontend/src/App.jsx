import { useState, useRef, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import Sidebar from './components/Sidebar';

const STORAGE_KEY = 'modelctl_conversations';
export const CONTEXT_LIMIT = 8192;

function createConversation() {
    return {
        id: Date.now().toString(),
        title: 'New conversation',
        messages: [],
        createdAt: Date.now(),
    };
}

function loadConversations() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return [];
}

function estimateTokens(messages) {
    return Math.ceil(messages.reduce((s, m) => s + (m.content?.length || 0), 0) / 4);
}

function App() {
    const [selectedModel, setSelectedModel] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState('');
    const [prefill, setPrefill] = useState({ text: '', ts: 0 });

    const [conversations, setConversations] = useState(() => {
        const saved = loadConversations();
        return saved.length > 0 ? saved : [createConversation()];
    });

    const [currentId, setCurrentId] = useState(() => {
        const saved = loadConversations();
        return saved.length > 0 ? saved[0].id : createConversation().id;
    });

    const abortRef = useRef(null);

    const currentConv = conversations.find(c => c.id === currentId) || conversations[0];
    const messages = currentConv?.messages || [];
    const tokenCount = estimateTokens(messages);

    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations)); } catch {}
    }, [conversations]);

    // Ctrl+Shift+O → new chat
    useEffect(() => {
        const handler = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'O') {
                e.preventDefault();
                handleNewChat();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const updateConversation = useCallback((id, updater) => {
        setConversations(prev => prev.map(c => c.id === id ? updater(c) : c));
    }, []);

    const handleNewChat = useCallback(() => {
        const conv = createConversation();
        setConversations(prev => [conv, ...prev]);
        setCurrentId(conv.id);
        setError('');
    }, []);

    const handleSelectConversation = useCallback((id) => {
        setCurrentId(id);
        setError('');
    }, []);

    const handleDeleteConversation = useCallback((id) => {
        setConversations(prev => {
            const next = prev.filter(c => c.id !== id);
            if (next.length === 0) {
                const fresh = createConversation();
                setCurrentId(fresh.id);
                return [fresh];
            }
            if (id === currentId) setCurrentId(next[0].id);
            return next;
        });
    }, [currentId]);

    const handleStop = useCallback(() => { abortRef.current?.abort(); }, []);

    // explicitBase = optional override for message history context (used by regenerate/edit)
    const handleSend = async (text, explicitBase = null) => {
        if (!selectedModel) return;
        setError('');

        const baseMessages = explicitBase !== null ? explicitBase : messages;
        const userMsg = { role: 'user', content: text };
        const convId = currentId;
        const isFirstMessage = baseMessages.length === 0;

        updateConversation(convId, c => ({
            ...c,
            title: isFirstMessage ? text.slice(0, 50) : c.title,
            messages: [...baseMessages, userMsg, { role: 'assistant', content: '' }],
        }));

        setIsStreaming(true);
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: [...baseMessages, userMsg],
                }),
                signal: controller.signal,
            });

            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const json = JSON.parse(line);
                        const content = json.message?.content || '';
                        if (content) {
                            updateConversation(convId, c => {
                                const msgs = [...c.messages];
                                const lastIdx = msgs.length - 1;
                                if (msgs[lastIdx]?.role === 'assistant') {
                                    msgs[lastIdx] = { ...msgs[lastIdx], content: msgs[lastIdx].content + content };
                                }
                                return { ...c, messages: msgs };
                            });
                        }
                    } catch {}
                }
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message);
                updateConversation(convId, c => {
                    const msgs = [...c.messages];
                    const lastIdx = msgs.length - 1;
                    if (msgs[lastIdx]?.role === 'assistant' && !msgs[lastIdx].content) msgs.splice(lastIdx, 1);
                    return { ...c, messages: msgs };
                });
            }
        } finally {
            setIsStreaming(false);
            abortRef.current = null;
        }
    };

    const handleRegenerate = useCallback(() => {
        if (isStreaming) return;
        let lastUserIdx = -1;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].role === 'user') { lastUserIdx = i; break; }
        }
        if (lastUserIdx === -1) return;
        const lastUser = messages[lastUserIdx];
        const base = messages.slice(0, lastUserIdx);
        updateConversation(currentId, c => ({ ...c, messages: base }));
        handleSend(lastUser.content, base);
    }, [messages, currentId, isStreaming, selectedModel]);

    const handleEditMessage = useCallback((msgIndex) => {
        if (isStreaming) return;
        const msg = messages[msgIndex];
        const base = messages.slice(0, msgIndex);
        updateConversation(currentId, c => ({ ...c, messages: base }));
        setPrefill({ text: msg.content, ts: Date.now() });
    }, [messages, currentId, isStreaming]);

    return (
        <div className="app-layout">
            <Sidebar
                conversations={conversations}
                currentId={currentId}
                onNewChat={handleNewChat}
                onSelect={handleSelectConversation}
                onDelete={handleDeleteConversation}
            />
            <div className="main-area">
                <Header selectedModel={selectedModel} onSelectModel={setSelectedModel} />

                {error && (
                    <div className="error-banner">
                        <span>{error}</span>
                        <button onClick={() => setError('')}>✕</button>
                    </div>
                )}

                <ChatArea
                    messages={messages}
                    isStreaming={isStreaming}
                    onRegenerate={handleRegenerate}
                    onEditMessage={handleEditMessage}
                />

                <InputArea
                    onSend={handleSend}
                    onStop={handleStop}
                    isStreaming={isStreaming}
                    disabled={!selectedModel}
                    prefill={prefill}
                    tokenCount={tokenCount}
                    contextLimit={CONTEXT_LIMIT}
                />
            </div>
        </div>
    );
}

export default App;
