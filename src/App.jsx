import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EditorContainer from './components/EditorContainer';
import Console from './components/Console';
import HistorySidebar from './components/HistorySidebar';
import SolutionMatcherSidebar from './components/SolutionMatcherSidebar';
import { SUPPORTED_LANGUAGES, getLanguageById } from './utils/languages';
import { Copy, Check, X, ShieldAlert, Cpu } from 'lucide-react';

export default function App() {
  // -----------------------------------------
  // State Initialization
  // -----------------------------------------
  const [selectedLanguage, setSelectedLanguageState] = useState(SUPPORTED_LANGUAGES[0]);
  const [code, setCode] = useState(SUPPORTED_LANGUAGES[0].boilerplate);
  const [fontSize, setFontSize] = useState(16);
  const [showMinimap, setShowMinimap] = useState(false);
  const [stdin, setStdin] = useState('');
  
  // Output & Execution
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [runStats, setRunStats] = useState({ status: 'idle', time: undefined, exitCode: undefined });
  
  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMatcherOpen, setIsMatcherOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  // Local History List
  const [historyList, setHistoryList] = useState([]);

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('compiler-theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('compiler-theme', theme);
  }, [theme]);

  // -----------------------------------------
  // Helper: Toast Trigger
  // -----------------------------------------
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // -----------------------------------------
  // Language Change handler (with templates)
  // -----------------------------------------
  const setSelectedLanguage = (langId) => {
    const lang = getLanguageById(langId);
    if (!lang) return;
    setSelectedLanguageState(lang);
    
    // Only set boilerplate if user hasn't typed anything meaningful, 
    // or if the current code matches the template of another language.
    const isCurrentCodeBoilerplate = SUPPORTED_LANGUAGES.some(l => l.boilerplate.trim() === code.trim());
    if (isCurrentCodeBoilerplate || code.trim() === '') {
      setCode(lang.boilerplate);
    }
  };

  // -----------------------------------------
  // Sharing Code: URL Hash Serialization
  // -----------------------------------------
  // Encode language + code into a base64 hash in URL
  const handleShare = () => {
    try {
      const payload = {
        langId: selectedLanguage.id,
        code: code
      };
      const jsonStr = JSON.stringify(payload);
      // Use encodeURIComponent & unescape to support Unicode characters in base64
      const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
      const url = `${window.location.origin}${window.location.pathname}#code=${base64}`;
      setShareUrl(url);
      setIsShareModalOpen(true);
    } catch (e) {
      triggerToast('⚠️ Failed to generate share link.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    triggerToast('📋 Share link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Load shared code on startup if present
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#code=')) {
      try {
        const base64 = hash.replace('#code=', '');
        const jsonStr = decodeURIComponent(escape(atob(base64)));
        const payload = JSON.parse(jsonStr);
        if (payload && payload.langId && payload.code !== undefined) {
          const lang = getLanguageById(payload.langId);
          if (lang) {
            setSelectedLanguageState(lang);
            setCode(payload.code);
            triggerToast(`📥 Loaded shared ${lang.name} snippet!`);
          }
        }
      } catch (e) {
        console.error('Error parsing shared code hash:', e);
      }
    }
  }, []);

  // -----------------------------------------
  // Local History Management
  // -----------------------------------------
  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('compiler_history');
    if (saved) {
      try {
        setHistoryList(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveToHistory = (statusValue) => {
    const newHistoryItem = {
      id: Date.now().toString(),
      languageId: selectedLanguage.id,
      languageName: selectedLanguage.name,
      code: code,
      timestamp: Date.now(),
      status: statusValue
    };
    
    // Keep max 20 history items
    const updated = [newHistoryItem, ...historyList].slice(0, 20);
    setHistoryList(updated);
    localStorage.setItem('compiler_history', JSON.stringify(updated));
  };

  const handleSelectHistoryItem = (item) => {
    const lang = getLanguageById(item.languageId);
    if (lang) {
      setSelectedLanguageState(lang);
      setCode(item.code);
      setIsHistoryOpen(false);
      triggerToast(`Loaded code run from history (${lang.name})`);
    }
  };

  const handleDeleteHistoryItem = (id) => {
    const updated = historyList.filter(item => item.id !== id);
    setHistoryList(updated);
    localStorage.setItem('compiler_history', JSON.stringify(updated));
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all code run history?')) {
      setHistoryList([]);
      localStorage.removeItem('compiler_history');
      triggerToast('History cleared.');
    }
  };

  // -----------------------------------------
  // File Import & Export
  // -----------------------------------------
  // Import code from local file
  const handleImportFile = (fileContent, filename) => {
    setCode(fileContent);
    triggerToast(`📄 File "${filename}" uploaded successfully!`);
    
    // Auto-detect language by file extension
    const ext = filename.split('.').pop().toLowerCase();
    const matchedLang = SUPPORTED_LANGUAGES.find(lang => lang.extension === ext);
    if (matchedLang) {
      setSelectedLanguageState(matchedLang);
      triggerToast(`📄 Loaded "${filename}" and switched language to ${matchedLang.name}`);
    }
  };

  // Download code as a local file
  const handleDownloadFile = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Main class logic override for java
    const filename = selectedLanguage.id === 'java' ? 'Main.java' : `main.${selectedLanguage.extension}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast(`💾 Downloaded ${filename}`);
  };

  // -----------------------------------------
  // Code Reset
  // -----------------------------------------
  const handleReset = () => {
    if (window.confirm(`Reset current changes and load default ${selectedLanguage.name} template?`)) {
      setCode(selectedLanguage.boilerplate);
      setOutput('');
      setError('');
      setRunStats({ status: 'idle', time: undefined, exitCode: undefined });
      triggerToast('Code reset to boilerplate template.');
    }
  };

  // -----------------------------------------
  // Piston Execution Engine Fetch call
  // -----------------------------------------
  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput('');
    setError('');
    
    const startTime = performance.now();
    
    try {
      const response = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          compiler: selectedLanguage.wandboxCompiler,
          code: selectedLanguage.id === 'java' ? code.replace(/\bpublic\s+class\b/g, 'class') : code,
          stdin: stdin
        })
      });

      const data = await response.json();
      const endTime = performance.now();
      const clientElapsedTime = ((endTime - startTime) / 1000).toFixed(2) + 's';

      if (response.ok && data) {
        const hasCompilerError = data.compiler_error && data.compiler_error.trim().length > 0;
        const hasProgramError = data.program_error && data.program_error.trim().length > 0;
        const exitCode = parseInt(data.status, 10);

        // 1. Compile Error check
        if (hasCompilerError && (!data.program_output && !data.program_error)) {
          setError(data.compiler_error || data.compiler_message);
          setRunStats({
            status: 'compile_error',
            time: clientElapsedTime,
            exitCode: isNaN(exitCode) ? -1 : exitCode
          });
          saveToHistory('error');
        } 
        // 2. Runtime execution error check (exit code is non-zero OR we have program stderr)
        else if (exitCode !== 0 || hasProgramError) {
          setError(data.program_error || 'Execution failed.');
          setOutput(data.program_output);
          setRunStats({
            status: 'runtime_error',
            time: clientElapsedTime,
            exitCode: isNaN(exitCode) ? -1 : exitCode
          });
          saveToHistory('error');
        } 
        // 3. Success
        else {
          setOutput(data.program_output || 'Program executed successfully with no output.');
          setRunStats({
            status: 'success',
            time: clientElapsedTime,
            exitCode: 0
          });
          saveToHistory('success');
        }
      } else {
        setError(data.message || 'Execution request failed. Service might be overloaded.');
        setRunStats({ status: 'runtime_error', time: clientElapsedTime, exitCode: response.status });
        saveToHistory('error');
      }
    } catch (err) {
      const endTime = performance.now();
      setError(`Network error: Failed to connect to code execution server.\nDetails: ${err.message}`);
      setRunStats({ 
        status: 'runtime_error', 
        time: ((endTime - startTime) / 1000).toFixed(2) + 's', 
        exitCode: -1 
      });
      saveToHistory('error');
    } finally {
      setIsRunning(false);
    }
  };

  // -----------------------------------------
  // Keyboard Shortcuts Listener
  // -----------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Enter to run code
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
      // Ctrl + S to download code file
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleDownloadFile();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, selectedLanguage, stdin, isRunning]); // recreate listener when deps change

  // -----------------------------------------
  // Render App UI
  // -----------------------------------------
  return (
    <div className="app-container">
      {/* Toast alert */}
      <div className={`toast ${showToast ? 'show' : ''}`}>
        {toastMessage}
      </div>

      {/* Header controls */}
      <Header
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        showMinimap={showMinimap}
        setShowMinimap={setShowMinimap}
        theme={theme}
        setTheme={setTheme}
        onReset={handleReset}
        onShare={handleShare}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenMatcher={() => setIsMatcherOpen(true)}
        onImportFile={handleImportFile}
        onDownloadFile={handleDownloadFile}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      {/* Split Layout Workspace */}
      <main className="workspace">
        <EditorContainer
          code={code}
          onChange={(val) => setCode(val || '')}
          language={selectedLanguage.monacoLanguage}
          fontSize={fontSize}
          showMinimap={showMinimap}
          theme={theme}
        />
        
        <Console
          isRunning={isRunning}
          output={output}
          error={error}
          stdin={stdin}
          setStdin={setStdin}
          runStats={runStats}
          onRun={handleRunCode}
        />
      </main>

      {/* History Drawer */}
      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={historyList}
        onSelectHistoryItem={handleSelectHistoryItem}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />

      {/* Solution Matcher Drawer */}
      <SolutionMatcherSidebar
        isOpen={isMatcherOpen}
        onClose={() => setIsMatcherOpen(false)}
        userCode={code}
        selectedLanguage={selectedLanguage}
      />

      {/* Share Modal Dialog */}
      {isShareModalOpen && (
        <div className="modal-overlay" onClick={() => setIsShareModalOpen(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Code Snippet</h3>
              <button className="btn btn-icon" onClick={() => setIsShareModalOpen(false)} style={{ border: 'none', background: 'transparent' }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Anyone with this link can view and run your code. Copy the URL below:
            </p>
            <div className="share-url-container">
              <input 
                type="text" 
                readOnly 
                value={shareUrl} 
                className="share-url-input"
                onClick={(e) => e.target.select()}
              />
              <button className="btn btn-primary" onClick={handleCopyLink} style={{ minWidth: '100px' }}>
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info / Keyboard Shortcuts Modal */}
      {isInfoOpen && (
        <div className="modal-overlay" onClick={() => setIsInfoOpen(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} className="text-primary" />
                <h3>Compiler Info & Shortcuts</h3>
              </div>
              <button className="btn btn-icon" onClick={() => setIsInfoOpen(false)} style={{ border: 'none', background: 'transparent' }}>
                <X size={18} />
              </button>
            </div>
            <div className="shortcuts-info">
              <div className="shortcut-row">
                <span>Run Program</span>
                <kbd className="kbd">Ctrl + Enter</kbd>
              </div>
              <div className="shortcut-row">
                <span>Save/Download File</span>
                <kbd className="kbd">Ctrl + S</kbd>
              </div>
              <div className="shortcut-row">
                <span>Reset Editor template</span>
                <span style={{ fontSize: '0.85rem' }}>Header → Reset</span>
              </div>
              <div className="shortcut-row">
                <span>Change Font Size</span>
                <span style={{ fontSize: '0.85rem' }}>Header → Min/Plus button</span>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dark)', marginTop: '8px', lineHeight: '1.4' }}>
              Built with React, Monaco Editor and powered by the Piston API. Files are executed in sandboxed virtual containers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
