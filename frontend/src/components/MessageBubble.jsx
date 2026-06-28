import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Edit2, RotateCw, User, Terminal, ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';

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

// Parses <think>thinking process</think> main response
function parseContent(content) {
    if (!content) return { thinking: '', response: '' };
    
    const thinkStart = content.indexOf('<think>');
    if (thinkStart === -1) {
        return { thinking: '', response: content };
    }

    const thinkEnd = content.indexOf('</think>');
    if (thinkEnd === -1) {
        // Thinking tag is open and currently streaming
        return {
            thinking: content.slice(thinkStart + 7),
            response: '',
            isThinkingStreaming: true
        };
    }

    return {
        thinking: content.slice(thinkStart + 7, thinkEnd),
        response: content.slice(thinkEnd + 8),
        isThinkingStreaming: false
    };
}

export default function MessageBubble({ role, content, index, isLast, isStreaming, onRegenerate, onEdit }) {
    const isUser = role === 'user';
    const showCursor = !isUser && isLast && isStreaming;
    const showRegenerate = !isUser && isLast && !isStreaming && content;
    const showEdit = isUser && !isStreaming;

    const [isThinkingExpanded, setIsThinkingExpanded] = useState(true);

    const { thinking, response, isThinkingStreaming } = isUser 
        ? { thinking: '', response: content, isThinkingStreaming: false }
        : parseContent(content);

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
                    {/* Initial Loading State before first token arrives */}
                    {!isUser && !content && isStreaming ? (
                        <div className="thinking-loader">
                            <span className="status-dot pulsing"></span>
                            <span className="loader-text">Thinking...</span>
                        </div>
                    ) : (
                        <>
                            {/* Collapsible Thinking Process block */}
                            {(thinking || isThinkingStreaming) && (
                                <div className="thinking-accordion">
                                    <button 
                                        type="button"
                                        className="thinking-toggle-btn"
                                        onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
                                    >
                                        <div className="thinking-toggle-left">
                                            {isThinkingExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            <HelpCircle size={13} className="thinking-toggle-icon" />
                                            <span>
                                                {isThinkingStreaming 
                                                    ? 'Thinking...' 
                                                    : 'Thinking Process'}
                                            </span>
                                        </div>
                                        {isThinkingStreaming && <span className="thinking-pulse-dot"></span>}
                                    </button>
                                    {isThinkingExpanded && (
                                        <div className="thinking-content">
                                            {thinking ? (
                                                <ReactMarkdown components={markdownComponents}>
                                                    {thinking}
                                                </ReactMarkdown>
                                            ) : (
                                                <span style={{ fontStyle: 'italic', opacity: 0.5 }}>
                                                    Starting thought process...
                                                </span>
                                            )}
                                            {isThinkingStreaming && showCursor && <span className="streaming-cursor">▋</span>}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Main Response block */}
                            {(response || (!thinking && !isThinkingStreaming && !isUser)) && (
                                <div className="md-content">
                                    <ReactMarkdown components={markdownComponents}>
                                        {response}
                                    </ReactMarkdown>
                                    {!isThinkingStreaming && showCursor && <span className="streaming-cursor">▋</span>}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
