import React from 'react';
import MonacoEditor from '@monaco-editor/react';

export default function EditorContainer({ 
  code, 
  onChange, 
  language, 
  fontSize, 
  showMinimap,
  theme
}) {
  const options = {
    fontSize: fontSize,
    minimap: { enabled: showMinimap },
    automaticLayout: true,
    padding: { top: 16, bottom: 16 },
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontWeight: '500',
    tabSize: 4,
    insertSpaces: true,
    wordWrap: 'on',
    backgroundColor: '#00000000',
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      vertical: 'visible',
      horizontal: 'visible'
    }
  };

  return (
    <div className="editor-section glass-panel">
      <div className="panel-header">
        <div className="panel-title">
          <span style={{ color: 'var(--text-main)', letterSpacing: '0.5px' }}>Source Code Editor</span>
        </div>
        <div className="panel-actions">
          <span style={{ 
            fontSize: '0.75rem', 
            color: 'var(--text-dark)', 
            fontFamily: 'var(--font-mono)',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid var(--panel-border)'
          }}>
            tabSize: 4
          </span>
        </div>
      </div>
      <div className="editor-wrapper">
        <MonacoEditor
          height="100%"
          language={language}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          value={code}
          onChange={onChange}
          options={options}
          loading={
            <div className="editor-loading-placeholder">
              <div className="spinner"></div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Initializing Monaco Editor...
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
}
