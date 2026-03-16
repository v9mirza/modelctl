import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CopyButton({ text, className = 'copy-btn' }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return (
        <button className={className} onClick={handleCopy} title="Copy">
            {copied ? '✓ Copied' : '⧉ Copy'}
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
                    PreTag="div"
                    customStyle={{ borderRadius: '0 0 6px 6px', fontSize: 13, margin: 0 }}
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
        <div className={`message-row animate-enter ${role}`}>
            <div className="bubble-wrapper">
                <div className={`bubble ${role}`}>
                    {!isUser && <span className="role-label">Assistant</span>}
                    <CopyButton text={content} className="copy-btn" />

                    <div className="md-content">
                        {isUser ? (
                            <span style={{ whiteSpace: 'pre-wrap' }}>{content}</span>
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

                <div className="message-actions" style={isUser ? { justifyContent: 'flex-end' } : {}}>
                    {showEdit && (
                        <button className="action-btn" onClick={() => onEdit(index)}>✏ Edit</button>
                    )}
                    {showRegenerate && (
                        <button className="action-btn" onClick={onRegenerate}>↺ Regenerate</button>
                    )}
                </div>
            </div>
        </div>
    );
}
