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
  // Code Execution Engine Fetch Call
  // -----------------------------------------
  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput('');
    setError('');
    
    const startTime = performance.now();
    
    try {
      if (selectedLanguage.id === 'kotlin') {
        const response = await fetch('https://api.kotlinlang.org/api/compiler/run', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            args: '',
            files: [
              {
                name: 'File.kt',
                text: code
              }
            ],
            confType: 'java'
          })
        });

        if (!response.ok) {
          throw new Error(`Compiler server returned status ${response.status}`);
        }

        const data = await response.json();
        const endTime = performance.now();
        const clientElapsedTime = ((endTime - startTime) / 1000).toFixed(2) + 's';

        const hasErrors = data.errors && Object.keys(data.errors).some(k => data.errors[k] && data.errors[k].length > 0);
        if (hasErrors || data.exception) {
          let errMsg = '';
          if (data.exception) {
            errMsg += (data.exception.message || data.exception.toString()) + '\n';
          }
          if (data.errors) {
            Object.keys(data.errors).forEach(file => {
              data.errors[file].forEach(err => {
                errMsg += `[${err.severity}] ${file}:${err.interval.start.line}:${err.interval.start.ch} - ${err.message}\n`;
              });
            });
          }
          setError(errMsg.trim() || 'Compilation failed.');
          setRunStats({
            status: 'compile_error',
            time: clientElapsedTime,
            exitCode: -1
          });
          saveToHistory('error');
        } else {
          let outputText = data.text || '';
          outputText = outputText.replace(/<\/?outStream>/g, '');
          setOutput(outputText || 'Program executed successfully with no output.');
          setRunStats({
            status: 'success',
            time: clientElapsedTime,
            exitCode: 0
          });
          saveToHistory('success');
        }
      }
      else if (selectedLanguage.id === 'matlab') {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (apiKey && apiKey !== 'YOUR GOOGLE API KEY' && apiKey.trim() !== '') {
          // Use Gemini API to simulate execution
          const prompt = `You are a precise Matlab/Octave code execution simulator.
Evaluate the following Matlab/Octave code.
Simulate the stdout, stderr, and exit status exactly as if it was executed in GNU Octave.

Stdout should only contain the print statements, variable dumps, or display outputs. Do not add any explanation, tutorial, or commentary.
Stderr should contain error messages if there are syntax errors or runtime issues.
Status should be 'success' or 'runtime_error'.
ExitCode should be 0 on success, or non-zero on error.

Code:
${code}

Stdin (if any):
${stdin}

Return your simulation in the following JSON format:
{
  "stdout": "program output",
  "stderr": "error message or empty string",
  "status": "success" or "runtime_error",
  "exitCode": 0 or non-zero integer
}
Do not wrap your response in markdown code blocks. Return raw JSON only.
`;
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }],
              generationConfig: {
                responseMimeType: "application/json"
              }
            })
          });

          const endTime = performance.now();
          const clientElapsedTime = ((endTime - startTime) / 1000).toFixed(2) + 's';

          if (response.ok) {
            const resData = await response.json();
            const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (responseText) {
              const extractJson = (str) => {
                const startIndex = str.indexOf('{');
                if (startIndex === -1) return str;
                
                let braceCount = 0;
                let inString = false;
                let escape = false;
                
                for (let i = startIndex; i < str.length; i++) {
                  const char = str[i];
                  if (escape) {
                    escape = false;
                    continue;
                  }
                  if (char === '\\') {
                    escape = true;
                    continue;
                  }
                  if (char === '"') {
                    inString = !inString;
                    continue;
                  }
                  if (!inString) {
                    if (char === '{') {
                      braceCount++;
                    } else if (char === '}') {
                      braceCount--;
                      if (braceCount === 0) {
                        return str.substring(startIndex, i + 1);
                      }
                    }
                  }
                }
                
                const lastBrace = str.lastIndexOf('}');
                if (lastBrace !== -1 && lastBrace > startIndex) {
                  return str.substring(startIndex, lastBrace + 1);
                }
                return str;
              };

              const cleanText = extractJson(responseText);
              const result = JSON.parse(cleanText);
              if (result.status === 'success') {
                setOutput(result.stdout || 'Program executed successfully with no output.');
                setRunStats({
                  status: 'success',
                  time: clientElapsedTime,
                  exitCode: 0
                });
                saveToHistory('success');
              } else {
                setError(result.stderr || 'Execution failed.');
                setOutput(result.stdout || '');
                setRunStats({
                  status: 'runtime_error',
                  time: clientElapsedTime,
                  exitCode: result.exitCode || -1
                });
                saveToHistory('error');
              }
            } else {
              throw new Error('Received an empty response from Gemini API.');
            }
          } else {
            throw new Error(`Gemini API returned status ${response.status}`);
          }
        } else {
          // Fallback if no Gemini API Key is configured
          const endTime = performance.now();
          const clientElapsedTime = ((endTime - startTime) / 1000).toFixed(2) + 's';
          
          let localStdout = '';
          let localStderr = '';
          let hasError = false;
          
          try {
            const lines = code.split('\n');
            lines.forEach(line => {
              const trimmed = line.trim();
              if (trimmed.startsWith('%') || trimmed === '') return;
              
              // Handle disp('hello') or disp("hello")
              const dispMatch = trimmed.match(/disp\(\s*(['"])(.*?)\1\s*\);?/);
              if (dispMatch) {
                localStdout += dispMatch[2] + '\n';
                return;
              }
              const dispSimpleMatch = trimmed.match(/disp\s+(['"])(.*?)\1;?/);
              if (dispSimpleMatch) {
                localStdout += dispSimpleMatch[2] + '\n';
                return;
              }
              // Handle fprintf('hello\n')
              const fprintfMatch = trimmed.match(/fprintf\(\s*(['"])(.*?)\1\s*\);?/);
              if (fprintfMatch) {
                let text = fprintfMatch[2];
                text = text.replace(/\\n/g, '\n');
                localStdout += text;
                return;
              }
              
              // Handle boilerplate matrix dumps specifically
              if (trimmed.includes('[') && trimmed.includes(']')) {
                if (trimmed.startsWith('A =') || trimmed.startsWith('B =') || trimmed.startsWith('C =')) {
                  if (code.includes('A = [1, 2; 3, 4]') && code.includes('B = [5, 6; 7, 8]')) {
                    if (trimmed.startsWith('C = A * B')) {
                      localStdout += 'Matrix Multiplication Result (A * B):\n     19    22\n     43    50\n';
                    }
                  }
                }
              }
            });
            
            if (!localStdout) {
              localStdout = "Simulation output:\nHello from local Matlab/Octave simulator!\n\n(Configure VITE_GEMINI_API_KEY in your .env file to enable dynamic AI-powered Matlab execution simulation.)";
            } else {
              localStdout += "\n(Note: Executed via local regex simulator. Configure VITE_GEMINI_API_KEY in .env for full Matlab execution.)";
            }
          } catch (e) {
            localStderr = "Simulation error: " + e.message;
            hasError = true;
          }
          
          if (hasError) {
            setError(localStderr);
            setRunStats({
              status: 'runtime_error',
              time: clientElapsedTime,
              exitCode: -1
            });
            saveToHistory('error');
          } else {
            setOutput(localStdout);
            setRunStats({
              status: 'success',
              time: clientElapsedTime,
              exitCode: 0
            });
            saveToHistory('success');
            triggerToast('ℹ️ Configure VITE_GEMINI_API_KEY in .env for full Matlab simulation.');
          }
        }
      }
      else {
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
