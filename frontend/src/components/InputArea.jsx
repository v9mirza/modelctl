import React, { useState, useEffect, useRef } from 'react';

function TokenCounter({ tokenCount, contextLimit }) {
    const pct = tokenCount / contextLimit;
    const color = pct > 0.85 ? '#f85149' : pct > 0.6 ? '#d29922' : 'var(--text-secondary)';
    const warning = pct > 0.85 ? '⚠ Near context limit' : pct > 0.6 ? '⚠ Long conversation' : '';

    return (
        <div className="token-counter">
            <div className="token-bar-track">
                <div
                    className="token-bar-fill"
                    style={{ width: `${Math.min(pct * 100, 100)}%`, background: color }}
                />
            </div>
            <span style={{ color }}>
                ~{tokenCount.toLocaleString()} / {contextLimit.toLocaleString()} tokens
                {warning && <span className="token-warn"> · {warning}</span>}
            </span>
        </div>
    );
}

export default function InputArea({ onSend, onStop, isStreaming, disabled, prefill, tokenCount, contextLimit }) {
    const [text, setText] = useState('');
    const inputRef = useRef(null);

    // Prefill from edit action
    useEffect(() => {
        if (prefill?.ts > 0) {
            setText(prefill.text || '');
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [prefill?.ts]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() || disabled || isStreaming) return;
        onSend(text);
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    const placeholder = disabled
        ? 'Select a model to start...'
        : isStreaming
            ? 'Responding...'
            : 'Message... (Enter · Shift+Enter for newline)';

    return (
        <div className="input-dock">
            {tokenCount > 0 && (
                <TokenCounter tokenCount={tokenCount} contextLimit={contextLimit} />
            )}

            <form onSubmit={handleSubmit} className="input-bar">
                <input
                    ref={inputRef}
                    className="chat-input"
                    placeholder={placeholder}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled || isStreaming}
                />
                {isStreaming ? (
                    <button type="button" className="stop-btn" onClick={onStop} title="Stop generating">■</button>
                ) : (
                    <button type="submit" className="send-btn" disabled={disabled || !text.trim()} title="Send">↑</button>
                )}
            </form>
        </div>
    );
}
