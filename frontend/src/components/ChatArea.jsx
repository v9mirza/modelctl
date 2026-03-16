import React, { useEffect, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import MessageBubble from './MessageBubble';

function EmptyState() {
    return (
        <div className="empty-state">
            <svg height="48" viewBox="0 0 24 24" fill="currentColor" style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>
                <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
            </svg>
            <p className="empty-state-title">Start a new discussion</p>
            <p className="empty-state-hint">Ctrl+Shift+O · new chat</p>
        </div>
    );
}

export default function ChatArea({ messages, isStreaming, onRegenerate, onEditMessage }) {
    const parentRef = useRef(null);
    // true = we're pinned to the bottom, auto-scroll on new content
    const autoScrollRef = useRef(true);

    const virtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 120,
        overscan: 5,
    });

    // When user scrolls up manually, disengage auto-scroll
    const handleScroll = useCallback(() => {
        const el = parentRef.current;
        if (!el) return;
        const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        autoScrollRef.current = distFromBottom < 80;
    }, []);

    // Re-engage auto-scroll whenever a new message is appended
    useEffect(() => {
        autoScrollRef.current = true;
    }, [messages.length]);

    // Scroll to bottom when content grows (streaming tokens or new message)
    useEffect(() => {
        if (messages.length === 0 || !autoScrollRef.current) return;
        const el = parentRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages]);

    const virtualItems = virtualizer.getVirtualItems();

    return (
        <div ref={parentRef} className="chat-scroll-area" onScroll={handleScroll}>
            {messages.length === 0 ? (
                <EmptyState />
            ) : (
                <div
                    className="chat-virtual-container"
                    style={{ height: `${virtualizer.getTotalSize()}px` }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                        }}
                    >
                        {virtualItems.map(vItem => (
                            <div
                                key={vItem.key}
                                data-index={vItem.index}
                                ref={virtualizer.measureElement}
                            >
                                <MessageBubble
                                    role={messages[vItem.index].role}
                                    content={messages[vItem.index].content}
                                    index={vItem.index}
                                    isLast={vItem.index === messages.length - 1}
                                    isStreaming={isStreaming}
                                    onRegenerate={onRegenerate}
                                    onEdit={onEditMessage}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
