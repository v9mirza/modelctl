import React from 'react';

export default function MessageBubble({ role, content }) {
    const isUser = role === 'user';

    return (
        <div className={`message-row animate-enter ${role}`}>
            <div className={`bubble ${role}`}>
                {!isUser && (
                    <span className="role-label">Assistant</span>
                )}
                <div className="md-content">
                    {content}
                </div>
            </div>
        </div>
    );
}
