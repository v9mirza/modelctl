import { useState } from 'react';

export default function InputBox({ onSend, disabled }) {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() || disabled) return;
        onSend(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t bg-subtle">
            <div className="flex gap-3">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={disabled}
                    placeholder="Type your message..."
                    className="flex-1 input-base p-2 text-sm"
                />
                <button
                    type="submit"
                    disabled={disabled || !text.trim()}
                    className="btn-primary px-4 py-2 text-sm"
                >
                    Send
                </button>
            </div>
        </form>
    );
}
