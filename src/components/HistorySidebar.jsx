import React from 'react';
import { X, Trash2, Clock, Terminal } from 'lucide-react';

export default function HistorySidebar({
  isOpen,
  onClose,
  historyList,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onClearAll
}) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Overlay to close when clicking outside */}
      <div 
        className={`drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      
      {/* Slide out panel */}
      <div className={`history-drawer ${isOpen ? 'open' : ''}`}>
        <div className="history-header">
          <h2>Execution History</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {historyList.length > 0 && (
              <button 
                className="btn" 
                onClick={onClearAll}
                style={{ color: 'var(--color-error)' }}
                title="Clear all history"
              >
                Clear All
              </button>
            )}
            <button 
              className="btn btn-icon" 
              onClick={onClose}
              title="Close Panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="history-list">
          {historyList.length === 0 ? (
            <div className="history-empty">
              <Clock size={32} />
              <span>No runs in history yet.</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>
                Your successful or failed code executions will be saved here automatically.
              </span>
            </div>
          ) : (
            historyList.map((item) => (
              <div 
                key={item.id} 
                className="history-item"
                onClick={() => onSelectHistoryItem(item)}
              >
                <div className="history-meta">
                  <span className="history-lang-badge">{item.languageName}</span>
                  <span className="history-time">
                    {formatDate(item.timestamp)} • {formatTime(item.timestamp)}
                  </span>
                </div>
                
                <div className="history-code-preview">
                  {item.code.substring(0, 100).trim() || 'Empty snippet'}
                  {item.code.length > 100 ? '...' : ''}
                </div>
                
                <div className="history-status">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        background: item.status === 'success' ? 'var(--color-success)' : 'var(--color-error)' 
                      }} 
                    />
                    <span>{item.status === 'success' ? 'Completed' : 'Error'}</span>
                  </div>
                  <button 
                    className="btn btn-icon"
                    style={{ padding: '4px', border: 'none', background: 'transparent' }}
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid triggering loading the code
                      onDeleteHistoryItem(item.id);
                    }}
                    title="Delete item"
                  >
                    <Trash2 size={14} className="text-dark" style={{ hover: { color: 'var(--color-error)' } }} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
