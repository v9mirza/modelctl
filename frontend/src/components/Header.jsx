import React, { useEffect, useState } from 'react';

export default function Header({ selectedModel, onSelectModel }) {
    const [models, setModels] = useState([]);

    useEffect(() => {
        fetch('/api/models')
            .then(res => res.json())
            .then(data => {
                setModels(data.models || []);
                if (data.models?.length > 0 && !selectedModel) {
                    onSelectModel(data.models[0].name);
                }
            })
            .catch(console.error);
    }, []);

    return (
        <header className="app-header flex items-center justify-between">
            <div className="flex items-center gap-3">
                <svg height="24" width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 17 10 11 4 5"></polyline>
                    <line x1="12" y1="19" x2="20" y2="19"></line>
                </svg>
                <span className="logo-text">modelctl</span>
            </div>

            <div className="model-select-wrapper">
                <select
                    className="model-select"
                    value={selectedModel}
                    onChange={(e) => onSelectModel(e.target.value)}
                >
                    <option value="" disabled>Select Model</option>
                    {models.map(m => (
                        <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                </select>
            </div>
        </header>
    );
}
