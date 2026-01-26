import { useState } from 'react';
import ModelSelector from './components/ModelSelector';
import ChatWindow from './components/ChatWindow';
import InputBox from './components/InputBox';

function App() {
    const [selectedModel, setSelectedModel] = useState('');
    const [messages, setMessages] = useState([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const handleSend = async (text) => {
        if (!selectedModel) return;

        const userMsg = { role: 'user', content: text };

        // Optimistically update UI
        setMessages(prev => [...prev, userMsg]);
        setIsStreaming(true);

        try {
            // Create placeholder for assistant response
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: [...messages, userMsg]
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // Decode chunk and add to buffer
                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                // Split buffer by newlines to process complete JSON objects
                const lines = buffer.split('\n');
                // Keep the last part in buffer (it might be incomplete)
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.trim()) continue;
                    try {
                        const json = JSON.parse(line);
                        // Extract content from Ollama format: { message: { content: "..." } }
                        const content = json.message?.content || '';

                        if (content) {
                            setMessages(prev => {
                                const newArr = [...prev];
                                const lastIndex = newArr.length - 1;
                                const lastMsg = newArr[lastIndex];

                                if (lastMsg.role !== 'assistant') return newArr;

                                newArr[lastIndex] = {
                                    ...lastMsg,
                                    content: lastMsg.content + content
                                };
                                return newArr;
                            });
                        }
                    } catch (e) {
                        console.warn('Failed to parse JSON chunk:', line);
                    }
                }
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: `\n[Error: ${err.message}]` }
            ]);
        } finally {
            setIsStreaming(false);
        }
    };

    return (
        <div className="flex flex-col h-full font-sans">
            <ModelSelector
                selectedModel={selectedModel}
                onSelectModel={setSelectedModel}
            />

            <ChatWindow messages={messages} />

            <InputBox
                onSend={handleSend}
                disabled={isStreaming || !selectedModel}
            />
        </div>
    );
}

export default App;
