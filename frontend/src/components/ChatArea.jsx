import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatArea({ messages }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        // Scroll the entire window to the bottom when messages update
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        // No overflow-auto here. We let the page grow.
        <div className="w-full h-full">
            <div className="chat-container">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center opacity-40 mt-32 select-none text-[var(--text-secondary)]">
                        <svg height="48" viewBox="0 0 24 24" fill="currentColor" style={{ marginBottom: 16 }}>
                            <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
                        </svg>
                        <p className="font-semibold">Start a new discussion</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} role={msg.role} content={msg.content} />
                ))}

                <div ref={bottomRef} style={{ height: 1 }} />
            </div>
        </div>
    );
}
