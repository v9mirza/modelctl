import React, { useState } from 'react';

export default function InputArea({ onSend, disabled }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() || disabled) return;
        onSend(text);
        setText('');
    };

    return (
        <div className="input-dock">
            <form onSubmit={handleSubmit} className="input-bar">
                <input
                    className="chat-input"
                    placeholder={disabled ? "Waiting for response..." : "Type your message..."}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={disabled}
                />
                <button type="submit" className="send-btn" disabled={disabled || !text.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
}
