import React, { useState } from 'react';

export default function Sidebar({ conversations, currentId, onNewChat, onSelect, onDelete }) {
    const [search, setSearch] = useState('');

    const filtered = search.trim()
        ? conversations.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
        : conversations;

    return (
        <aside className="sidebar">
            <button className="new-chat-btn" onClick={onNewChat} title="New chat (Ctrl+Shift+O)">
                + New Chat
            </button>

            <div className="sidebar-search-wrapper">
                <input
                    className="sidebar-search"
                    type="text"
                    placeholder="Search conversations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button className="sidebar-search-clear" onClick={() => setSearch('')} title="Clear">✕</button>
                )}
            </div>

            <div className="conv-list">
                {filtered.length === 0 && (
                    <p className="conv-empty">No results</p>
                )}
                {filtered.map(conv => (
                    <div
                        key={conv.id}
                        className={`conv-item ${conv.id === currentId ? 'active' : ''}`}
                        onClick={() => onSelect(conv.id)}
                    >
                        <span className="conv-title">{conv.title}</span>
                        <button
                            className="conv-delete"
                            onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                            title="Delete conversation"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </aside>
    );
}
