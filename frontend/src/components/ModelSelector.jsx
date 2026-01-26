import { useState, useEffect } from 'react';

export default function ModelSelector({ selectedModel, onSelectModel }) {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/models')
            .then(res => res.json())
            .then(data => {
                setModels(data.models || []);
                if (data.models && data.models.length > 0 && !selectedModel) {
                    onSelectModel(data.models[0].name);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch models', err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-4 text-sm text-[var(--color-fg-muted)]">Loading models...</div>;

    return (
        <div className="flex items-center justify-between p-4 border-b bg-subtle">
            <div className="flex items-center gap-2">
                <svg height="24" viewBox="0 0 16 16" version="1.1" width="24" aria-hidden="true" fill="var(--color-fg-default)">
                    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z"></path>
                </svg>
                <span className="font-bold text-sm">modelctl</span>
            </div>
            <select
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value)}
                className="select-base"
            >
                <option value="" disabled>Select a model</option>
                {models.map((m) => (
                    <option key={m.name} value={m.name}>
                        {m.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
