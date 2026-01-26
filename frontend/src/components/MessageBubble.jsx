import React from 'react';

export default function MessageBubble({ role, content }) {
    const isUser = role === 'user';
    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[85%] p-3 rounded-md text-sm leading-6 border ${isUser
                        ? 'bg-[#1f6feb] text-white border-[#1f6feb]'
                        : 'bg-[var(--color-canvas-subtle)] text-[var(--color-fg-default)] border-[var(--color-border-default)]'
                    }`}
            >
                <div className={`text-xs mb-1 font-bold ${isUser ? 'text-blue-100' : 'text-[var(--color-fg-muted)]'}`}>
                    {isUser ? 'You' : 'Assistant'}
                </div>
                <div className="whitespace-pre-wrap font-mono break-words">
                    {content}
                </div>
            </div>
        </div>
    );
}
