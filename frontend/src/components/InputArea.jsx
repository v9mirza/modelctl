import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Square } from 'lucide-react';

function TokenCounter({ tokenCount, contextLimit }) {
    const pct = tokenCount / contextLimit;
    const color = pct > 0.85 ? '#ef4444' : pct > 0.6 ? '#f59e0b' : 'var(--accent-primary)';

    return (
        <div className="token-counter-minimal">
            <div className="token-bar-track">
                <div
                    className="token-bar-fill"
                    style={{ width: `${Math.min(pct * 100, 100)}%`, background: color }}
                />
            </div>
            <span className="token-counter-text">
                {tokenCount.toLocaleString()} / {contextLimit.toLocaleString()} tokens
            </span>
        </div>
    );
}

export default function InputArea({ onSend, onStop, isStreaming, disabled, prefill, tokenCount, contextLimit }) {
    const [text, setText] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (prefill?.ts > 0) {
            setText(prefill.text || '');
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.style.height = 'auto';
                    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
                }
            }, 0);
        }
    }, [prefill?.ts]);

    useEffect(() => {
        if (text === '') {
            if (inputRef.current) {
                inputRef.current.style.height = 'auto';
            }
        }
    }, [text]);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!text.trim() || disabled || isStreaming) return;
        onSend(text);
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleInput = (e) => {
        const target = e.target;
        target.style.height = 'auto';
        target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
        setText(target.value);
    };

    const placeholder = disabled
        ? 'Select a model to start...'
        : isStreaming
            ? 'Responding...'
            : 'Message modelctl...';

    return (
        <div className="input-dock-minimal">
            {tokenCount > 0 && (
                <TokenCounter tokenCount={tokenCount} contextLimit={contextLimit} />
            )}

            <form onSubmit={handleSubmit} className="input-bar-minimal">
                <textarea
                    ref={inputRef}
                    className="chat-input-textarea-minimal"
                    rows={1}
                    placeholder={placeholder}
                    value={text}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    disabled={disabled || isStreaming}
                />
                
                <div className="input-actions-wrapper">
                    {isStreaming ? (
                        <button type="button" className="stop-btn-minimal" onClick={onStop} title="Stop generating">
                            <Square size={12} fill="currentColor" />
                        </button>
                    ) : (
                        <button type="submit" className="send-btn-minimal" disabled={disabled || !text.trim()} title="Send message">
                            <ArrowUp size={14} />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
