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
            <div className={`github-comment-box ${role}`}>
                <div className="github-comment-header">
                    <div className="comment-header-left">
                        {isUser ? (
                            <div className="avatar-squircle user">
                                <User size={12} />
                            </div>
                        ) : (
                            <div className="avatar-squircle assistant">
                                <Terminal size={12} />
                            </div>
                        )}
                        <span className="sender-title">{isUser ? 'You' : 'Assistant'}</span>
                        <span className="sender-tag-mono">{isUser ? '// SYS.IN' : '// SYS.OUT'}</span>
                    </div>

                    <div className="comment-header-actions">
                        {showEdit && (
                            <button className="comment-action-btn" onClick={() => onEdit(index)} title="Edit message">
                                <Edit2 size={11} />
                                <span>Edit</span>
                            </button>
                        )}
                        {showRegenerate && (
                            <button className="comment-action-btn" onClick={onRegenerate} title="Regenerate response">
                                <RotateCw size={11} />
                                <span>Regenerate</span>
                            </button>
                        )}
                        {!isUser && (
                            <CopyButton text={content} className="comment-action-btn" />
                        )}
                    </div>
                </div>

                <div className="github-comment-body">
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
                </div>
            </div>
        </div>
    );
}
