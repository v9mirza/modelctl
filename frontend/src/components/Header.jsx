import React, { useEffect, useState } from 'react';
import { ChevronDown, Cpu, Terminal } from 'lucide-react';

export default function Header({ selectedModel, onSelectModel }) {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);

    useEffect(() => {
        fetch('/api/models')
            .then(res => res.json())
            .then(data => {
                setModels(data.models || []);
                if (data.models?.length > 0 && !selectedModel) {
                    onSelectModel(data.models[0].name);
                }
            })
            .catch(() => setFetchError(true))
            .finally(() => setLoading(false));
    }, []);

    return (
        <header className="app-header">
            <div className="logo-container">
                <span className="logo-prompt-green">&gt;_</span>
                <span className="logo-text">modelctl</span>
            </div>

            <div className="header-center-telemetry">
                {loading ? (
                    <div className="telemetry-item amber">
                        <span className="status-dot pulsing"></span>
                        <span>Connecting...</span>
                    </div>
                ) : fetchError ? (
                    <div className="telemetry-item red">
                        <span className="status-dot"></span>
                        <span>Ollama Offline</span>
                    </div>
                ) : (
                    <div className="telemetry-item green">
                        <span className="status-dot pulsing"></span>
                        <span>Ollama Active</span>
                    </div>
                )}
            </div>

            <div className="model-select-outer">
                {!loading && !fetchError && (
                    <div className="model-select-wrapper">
                        <Cpu size={12} className="model-icon-prefix" />
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
                        <ChevronDown size={12} className="model-icon-suffix" />
                    </div>
                )}
            </div>
        </header>
    );
}
