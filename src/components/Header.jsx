import React, { useRef } from 'react';
import { 
  Terminal, 
  History, 
  Share2, 
  Download, 
  Upload, 
  RotateCcw, 
  Plus, 
  Minus, 
  Info, 
  Eye, 
  EyeOff,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

export default function Header({
  selectedLanguage,
  setSelectedLanguage,
  fontSize,
  setFontSize,
  showMinimap,
  setShowMinimap,
  theme,
  setTheme,
  onReset,
  onShare,
  onOpenHistory,
  onImportFile,
  onDownloadFile,
  onOpenInfo,
  onOpenMatcher
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onImportFile(event.target.result, file.name);
    };
    reader.readAsText(file);
    // Reset file input value to allow uploading the same file again
    e.target.value = '';
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <header>
      <div className="logo">
        <Terminal size={24} />
        <span>Pro Compiler</span>
        
        {/* SVG Gradient definition for logo styling */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="header-controls">
        {/* Language Selection */}
        <div className="lang-select-wrapper">
          <select 
            value={selectedLanguage.id} 
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="lang-select"
            title="Select programming language"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <div className="lang-select-icon">
            <Terminal size={16} />
          </div>
        </div>

        {/* Editor Settings (Font Size, Minimap) */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            className="btn btn-icon" 
            onClick={() => setFontSize(prev => Math.max(12, prev - 1))}
            title="Decrease Font Size"
          >
            <Minus size={16} />
          </button>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 4px', fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {fontSize}px
          </span>
          <button 
            className="btn btn-icon" 
            onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
            title="Increase Font Size"
          >
            <Plus size={16} />
          </button>
        </div>

        <button 
          className={`btn btn-icon ${showMinimap ? '' : 'text-dark'}`}
          onClick={() => setShowMinimap(!showMinimap)}
          title={showMinimap ? "Hide Minimap" : "Show Minimap"}
        >
          {showMinimap ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>

        {/* Reset Template */}
        <button 
          className="btn" 
          onClick={onReset}
          title="Reset to boilerplate code"
        >
          <RotateCcw size={16} />
          <span className="btn-label-desktop">Reset</span>
        </button>

        {/* Import/Export File */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
          accept=".py,.js,.ts,.cpp,.c,.java,.go,.rs,.php,.rb,.swift,.kt,.sh,text/plain"
        />
        <button 
          className="btn" 
          onClick={triggerFileSelect}
          title="Upload local file"
        >
          <Upload size={16} />
          <span className="btn-label-desktop">Upload</span>
        </button>

        <button 
          className="btn" 
          onClick={onDownloadFile}
          title="Download code file"
        >
          <Download size={16} />
          <span className="btn-label-desktop">Download</span>
        </button>

        {/* GitHub Link */}
        <a 
          href="https://github.com/new"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-github-link"
          title="Go to GitHub to upload/publish your files"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-main)'
          }}
        >
          <svg 
            viewBox="0 0 24 24" 
            width="16" 
            height="16" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ flexShrink: 0 }}
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          <span className="btn-label-desktop">GitHub</span>
        </a>

        {/* Share Code */}
        <button 
          className="btn btn-primary" 
          onClick={onShare}
          title="Share code snippet"
        >
          <Share2 size={16} />
          <span className="btn-label-desktop">Share</span>
        </button>

        {/* Solution Matcher */}
        <button 
          className="btn btn-matcher-glow" 
          onClick={onOpenMatcher}
          title="Match your code with the optimal solution"
          style={{ 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
            borderColor: 'var(--color-primary-glow)',
            boxShadow: '0 0 10px var(--panel-border-glow)',
            gap: '6px'
          }}
        >
          <Sparkles size={16} className="text-primary" style={{ color: 'var(--color-primary)' }} />
          <span className="btn-label-desktop">Match Code</span>
        </button>

        {/* Theme Toggle */}
        <button 
          className="btn btn-icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Info & History */}
        <button 
          className="btn btn-icon" 
          onClick={onOpenInfo}
          title="Keyboard Shortcuts & Info"
        >
          <Info size={16} />
        </button>

        <button 
          className="btn btn-icon" 
          onClick={onOpenHistory}
          title="Execution History"
        >
          <History size={16} />
        </button>
      </div>
    </header>
  );
}
