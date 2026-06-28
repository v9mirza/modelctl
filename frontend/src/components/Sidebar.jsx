import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Terminal, Trash2, X } from 'lucide-react';

export default function Sidebar({ conversations, currentId, onNewChat, onSelect, onDelete }) {
    const [search, setSearch] = useState('');
    const searchInputRef = useRef(null);

    // Focus search on Ctrl+K or Cmd+K
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const filtered = search.trim()
        ? conversations.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
        : conversations;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-brand-wrapper">
                    <span className="logo-prompt-green">&gt;_</span>
                    <span className="sidebar-brand">modelctl</span>
                </div>
                <span className="sidebar-dot-active"></span>
            </div>

            <button className="new-chat-btn" onClick={onNewChat} title="New chat (Ctrl+Shift+O)">
                <div className="new-chat-btn-left">
                    <Plus size={14} className="btn-icon" />
                    <span className="btn-text">New Chat</span>
                </div>
            </button>

            <div className="sidebar-search-wrapper">
                <Search size={13} className="search-icon" />
                <input
                    ref={searchInputRef}
                    className="sidebar-search"
                    type="text"
                    placeholder="Search conversations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button className="sidebar-search-clear" onClick={() => setSearch('')} title="Clear">
                        <X size={12} />
                    </button>
                )}
            </div>

            <div className="conv-list-header">
                <span>Recent Conversations</span>
                <span className="conv-count">{conversations.length}</span>
            </div>

            <div className="conv-list">
                {filtered.length === 0 && (
                    <p className="conv-empty">No conversations found</p>
                )}
                {filtered.map(conv => (
                    <div
                        key={conv.id}
                        className={`conv-item ${conv.id === currentId ? 'active' : ''}`}
                        onClick={() => onSelect(conv.id)}
                    >
                        <Terminal size={12} className="conv-icon" />
                        <span className="conv-title">{conv.title}</span>
                        <button
                            className="conv-delete"
                            onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                            title="Delete session"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </aside>
    );
}
