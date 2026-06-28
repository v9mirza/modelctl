import React, { useEffect, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import MessageBubble from './MessageBubble';
import { Terminal, Database, Palette, Code2, Cpu } from 'lucide-react';

function EmptyState({ onPrefill }) {
    const suggestions = [
        {
            number: "1",
            title: "Write log parser",
            desc: "Create a Python script to scan server log records and summarize errors.",
            prompt: "Write a Python script to parse log files, extract error messages, and output a summary count of each unique error type.",
            icon: <Terminal size={13} />
        },
        {
            number: "2",
            title: "Optimize SQL query",
            desc: "Refactor a grouped transaction count statement for high performance.",
            prompt: "Optimize this SQL query to retrieve the top 5 most active users in the past month, grouped by their transaction count and status.",
            icon: <Database size={13} />
        },
        {
            number: "3",
            title: "CSS glassmorphic styles",
            desc: "Create Vanilla CSS tokens for frosted glass borders and shadows.",
            prompt: "Provide a Vanilla CSS snippet for a glassmorphic card component with a thin glowing border, backdrop blur, and smooth shadow.",
            icon: <Palette size={13} />
        },
        {
            number: "4",
            title: "Optimize React renders",
            desc: "Identify and resolve hook render cycles in virtual lists.",
            prompt: "Explain how to debug and optimize a slow rendering React component that processes large lists, showing examples using memoization.",
            icon: <Code2 size={13} />
        }
    ];

    return (
        <div className="empty-state-minimal">
            <div className="empty-state-logo-wrapper">
                <Cpu size={28} />
            </div>
            
            <h1 className="empty-title">What can we build today?</h1>
            <p className="empty-subtitle">Choose a model to begin, or select a preset command below.</p>

            <div className="suggestions-menu-list">
                {suggestions.map((s, idx) => (
                    <div
                        key={idx}
                        className="suggestion-menu-item"
                        onClick={() => onPrefill(s.prompt)}
                    >
                        <div className="item-left-side">
                            <span className="item-icon-tag">{s.icon}</span>
                            <span className="item-title">{s.title}</span>
                            <span className="item-desc-inline">— {s.desc}</span>
                        </div>
                        <kbd className="item-kbd-badge">{s.number}</kbd>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ChatArea({ messages, isStreaming, onRegenerate, onEditMessage, onPrefill }) {
    const parentRef = useRef(null);
    const autoScrollRef = useRef(true);

    const virtualizer = useVirtualizer({
        count: messages.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 120,
        overscan: 5,
    });

    const handleScroll = useCallback(() => {
        const el = parentRef.current;
        if (!el) return;
        const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        autoScrollRef.current = distFromBottom < 80;
    }, []);

    useEffect(() => {
        autoScrollRef.current = true;
    }, [messages.length]);

    useEffect(() => {
        if (messages.length === 0 || !autoScrollRef.current) return;
        const el = parentRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [messages]);

    const virtualItems = virtualizer.getVirtualItems();

    return (
        <div ref={parentRef} className="chat-scroll-area" onScroll={handleScroll}>
            {messages.length === 0 ? (
                <EmptyState onPrefill={onPrefill} />
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
