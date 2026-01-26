import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-auto p-4 flex flex-col">
            {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-fg-muted)]">
                    <svg className="mb-4 text-[var(--color-border-default)]" aria-hidden="true" height="48" viewBox="0 0 16 16" version="1.1" width="48" fill="currentColor">
                        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z"></path>
                    </svg>
                    <p>Select a model to start chatting</p>
                </div>
            )}
            {messages.map((msg, index) => (
                <MessageBubble key={index} role={msg.role} content={msg.content} />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
