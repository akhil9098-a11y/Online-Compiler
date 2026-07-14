import React, { useState } from 'react';
import { Play, Terminal, Database, ShieldAlert, Clock, Sparkles } from 'lucide-react';

export default function Console({
  isRunning,
  output,
  error,
  stdin,
  setStdin,
  runStats,
  onRun
}) {
  const [activeTab, setActiveTab] = useState('output');

  const getStatusBadge = () => {
    if (isRunning) {
      return <span className="stat-badge badge-running">Running...</span>;
    }
    
    switch (runStats.status) {
      case 'success':
        return <span className="stat-badge badge-success">Success</span>;
      case 'compile_error':
        return <span className="stat-badge badge-error">Compile Error</span>;
      case 'runtime_error':
        return <span className="stat-badge badge-error">Runtime Error</span>;
      default:
        return <span className="stat-badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>Idle</span>;
    }
  };

  return (
    <div className="console-section glass-panel">
      {/* Tabs Header */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'output' ? 'active' : ''}`}
          onClick={() => setActiveTab('output')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={14} />
            <span>Output Terminal</span>
          </div>
        </button>
        
        <button
          className={`tab-btn ${activeTab === 'input' ? 'active' : ''}`}
          onClick={() => setActiveTab('input')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={14} />
            <span>Stdin Input</span>
          </div>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="console-body">
        {activeTab === 'output' ? (
          <div className="console-tab-content">
            {isRunning ? (
              <div className="console-terminal empty">
                <div className="spinner"></div>
                <span style={{ color: 'var(--text-muted)' }}>Compiling and executing code...</span>
              </div>
            ) : error ? (
              <div className="console-terminal error">
                {error}
              </div>
            ) : output ? (
              <div className="console-terminal">
                {output}
              </div>
            ) : (
              <div className="console-terminal empty">
                <Sparkles size={28} className="text-primary" />
                <span style={{ textAlign: 'center' }}>
                  Write some code and press Run or <kbd className="kbd">Ctrl + Enter</kbd> to see output.
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="console-tab-content">
            <textarea
              className="console-stdin-textarea"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter standard input (stdin) values here. If your program reads input at runtime, type it here first."
            />
            <div className="stdin-info">
              💡 Feed input lines matching your code's input requests. Multiple inputs can be written on separate lines.
            </div>
          </div>
        )}
      </div>

      {/* Footer / Stats Bar */}
      <div className="console-footer">
        <div className="run-stats">
          <div className="stat-item">
            {getStatusBadge()}
          </div>
          {runStats.time !== undefined && (
            <div className="stat-item">
              <Clock size={12} />
              <span>Time: {runStats.time}</span>
            </div>
          )}
          {runStats.exitCode !== undefined && (
            <div className="stat-item">
              <span>Exit Code: {runStats.exitCode}</span>
            </div>
          )}
        </div>

        <button
          className="btn btn-primary"
          onClick={onRun}
          disabled={isRunning}
          style={{ paddingLeft: '24px', paddingRight: '24px' }}
        >
          <Play size={16} fill="white" />
          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
        </button>
      </div>
    </div>
  );
}
