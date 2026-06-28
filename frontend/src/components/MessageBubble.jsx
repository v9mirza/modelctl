import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Edit2, RotateCw, User, Terminal } from 'lucide-react';

function CopyButton({ text, className = 'copy-btn' }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button className={className} onClick={handleCopy} title="Copy contents">
            {copied ? <Check size={11} /> : <Copy size={11} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
    );
}

const markdownComponents = {
    code({ className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        if (!match) {
            return <code className={className} {...props}>{children}</code>;
        }
        const codeText = String(children).replace(/\n$/, '');
        return (
            <div className="code-block-wrapper">
                <div className="code-block-header">
                    <span className="code-lang">{match[1]}</span>
                    <CopyButton text={codeText} className="code-copy-btn" />
                </div>
                <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="pre"
                    customStyle={{ background: 'var(--bg-input)', border: 'none', borderRadius: '0 0 8px 8px', fontSize: 13, margin: 0, padding: '12px' }}
                >
                    {codeText}
                </SyntaxHighlighter>
            </div>
        );
    },
};

export default function MessageBubble({ role, content, index, isLast, isStreaming, onRegenerate, onEdit }) {
    const isUser = role === 'user';
    const showCursor = !isUser && isLast && isStreaming;
    const showRegenerate = !isUser && isLast && !isStreaming && content;
    const showEdit = isUser && !isStreaming;

    return (
        <div className={`message-row ${role} animate-enter`}>
            <div className="message-avatar-col">
                {isUser ? (
                    <div className="avatar-squircle user">
                        <User size={13} />
                    </div>
                ) : (
                    <div className="avatar-squircle assistant">
                        <Terminal size={13} />
                    </div>
                )}
            </div>

            <div className="bubble-wrapper">
                <div className="bubble-meta-info">
                    <span className="sender-title">{isUser ? 'You' : 'Assistant'}</span>
                    <span className="sender-tag-mono">{isUser ? '// SYS.IN' : '// SYS.OUT'}</span>
                </div>

                <div className={`bubble-card ${role}`}>
                    <div className="md-content">
                        {isUser ? (
                            <span className="user-message-text">{content}</span>
                        ) : (
                            <>
                                <ReactMarkdown components={markdownComponents}>
                                    {content}
                                </ReactMarkdown>
                                {showCursor && <span className="streaming-cursor">▋</span>}
                            </>
                        )}
                    </div>
                    {!isUser && <CopyButton text={content} className="bubble-copy-btn-modern" />}
                </div>

                {(showEdit || showRegenerate) && (
                    <div className="message-actions-modern">
                        {showEdit && (
                            <button className="action-btn-modern" onClick={() => onEdit(index)}>
                                <Edit2 size={10} />
                                <span>Edit</span>
                            </button>
                        )}
                        {showRegenerate && (
                            <button className="action-btn-modern" onClick={onRegenerate}>
                                <RotateCw size={10} />
                                <span>Regenerate</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
