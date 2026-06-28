import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Square } from 'lucide-react';

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
                    {tokenCount > 0 && (
                        <div className="token-counter-inline" title="Token limit usage">
                            <span className="token-counter-text">
                                [TOK: {tokenCount.toLocaleString()} / {contextLimit.toLocaleString()}]
                            </span>
                        </div>
                    )}
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
