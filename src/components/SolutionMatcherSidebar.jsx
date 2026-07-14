import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertTriangle, Check, Copy, Flame, Info, CheckCircle2 } from 'lucide-react';
import { LEETCODE_QUESTIONS, getQuestionById } from '../utils/leetcodeDatabase';

export default function SolutionMatcherSidebar({
  isOpen,
  onClose,
  userCode,
  selectedLanguage
}) {
  const [questionMode, setQuestionMode] = useState('predefined'); // 'predefined' | 'custom'
  const [selectedQuestionId, setSelectedQuestionId] = useState(LEETCODE_QUESTIONS[0].id);
  const [customQuestionName, setCustomQuestionName] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Check if API key is configured in env
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Clear result and error when opening/closing or changing language
  useEffect(() => {
    setComparisonResult(null);
    setError('');
  }, [isOpen, selectedLanguage, questionMode, selectedQuestionId]);

  // Helper: map Monaco language to database solution keys
  const getMappedLanguageKey = (langId) => {
    const id = langId.toLowerCase();
    if (id.includes('python')) return 'python';
    if (id.includes('javascript') || id.includes('typescript') || id.includes('js') || id.includes('ts')) return 'javascript';
    if (id.includes('java')) return 'java';
    if (id.includes('cpp') || id.includes('c')) return 'cpp';
    if (id.includes('go')) return 'go';
    if (id.includes('rust') || id === 'rs') return 'rust';
    return 'javascript'; // default fallback
  };

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Local matching engine for zero-config mode
  const runLocalMatching = (questionId, codeStr, langId) => {
    const question = getQuestionById(questionId);
    if (!question) return null;

    const langKey = getMappedLanguageKey(langId);
    const dbSolution = question.solutions[langKey] || question.solutions['javascript'];

    // Basic heuristic checks to calculate similarity and complexity
    let matchPercentage = 80;
    let userTime = dbSolution.timeComplexity;
    let userSpace = dbSolution.spaceComplexity;
    const feedback = [];

    const cleanedCode = codeStr.replace(/\s+/g, '').toLowerCase();

    if (questionId === 'two-sum') {
      // Check for O(N^2) nested loops: e.g. two nested loops iterating over the same or indexing
      const hasDoubleLoop = (codeStr.match(/for/g) || []).length >= 2 ||
        (cleanedCode.includes('for') && (cleanedCode.includes('.indexof') || cleanedCode.includes('.includes') || cleanedCode.includes('.find')));
      const hasHashMap = cleanedCode.includes('map') || cleanedCode.includes('hashmap') || cleanedCode.includes('dict') || cleanedCode.includes('unordered_map') || cleanedCode.includes('complement');

      if (hasDoubleLoop && !hasHashMap) {
        matchPercentage = 50;
        userTime = 'O(N^2)';
        userSpace = 'O(1)';
        feedback.push('Your solution uses nested loops (O(N^2) time complexity). This will exceed time limits for large datasets.');
        feedback.push('Use a hash map to store elements as you iterate. This allows you to check for the complement in O(1) time, bringing total time complexity to O(N).');
      } else if (hasHashMap) {
        matchPercentage = 95;
        feedback.push('Excellent! You used a hash map to achieve optimal O(N) time complexity.');
        feedback.push('Ensure you handle cases where no two numbers sum up to the target correctly by returning an empty list or array.');
      } else {
        matchPercentage = 70;
        feedback.push('Make sure you are not using nested lookups. Try leveraging a Hash Table for linear time complexity.');
      }
    } else if (questionId === 'reverse-linked-list') {
      const hasPrevCurr = cleanedCode.includes('prev') && cleanedCode.includes('curr');
      const hasRecursive = cleanedCode.includes('reverse') && cleanedCode.includes('head.next');

      if (hasPrevCurr) {
        matchPercentage = 95;
        feedback.push('Great! You used the optimal iterative approach using three pointers (prev, curr, next).');
        feedback.push('Your space complexity is O(1) which is optimal.');
      } else if (hasRecursive) {
        matchPercentage = 85;
        userSpace = 'O(N)';
        feedback.push('You implemented a recursive solution. While clean, it takes O(N) space due to call stack overhead.');
        feedback.push('Try implementing it iteratively to achieve O(1) auxiliary space complexity.');
      } else {
        matchPercentage = 65;
        feedback.push('Linked list reversal is best achieved by updating next pointers in-place.');
        feedback.push('Ensure you are tracking prev, curr, and next pointers during the iteration.');
      }
    } else if (questionId === 'valid-parentheses') {
      const hasStack = cleanedCode.includes('stack') || cleanedCode.includes('push') || cleanedCode.includes('pop');
      if (hasStack) {
        matchPercentage = 95;
        feedback.push('Optimal stack structure detected! This ensures LIFO (Last-In-First-Out) bracket checking.');
        feedback.push('Make sure to verify if the stack is empty at the end, and check for empty stack pops during iteration to prevent null pointer errors.');
      } else {
        matchPercentage = 45;
        feedback.push('To solve this correctly, you must use a Stack data structure to track bracket hierarchy.');
        feedback.push('String replacements (e.g. repeatedly replacing "()", "{}", "[]") are suboptimal and take O(N^2) time.');
      }
    } else if (questionId === 'binary-search') {
      const hasMid = cleanedCode.includes('mid') || cleanedCode.includes('pivot') || cleanedCode.includes('middle');
      const hasWhile = cleanedCode.includes('while') && (cleanedCode.includes('<=') || cleanedCode.includes('<'));

      if (hasMid && hasWhile) {
        matchPercentage = 95;
        feedback.push('Perfect implementation of binary search bounds checking.');
        feedback.push('Ensure you guard against integer overflow when calculating mid: use `low + (high - low) / 2` instead of `(low + high) / 2`.');
      } else {
        matchPercentage = 60;
        userTime = 'O(N)';
        feedback.push('Your solution does not seem to employ active range narrowing (binary search).');
        feedback.push('Make sure to divide the sorted search space in half at each iteration to achieve O(log N) runtime.');
      }
    } else if (questionId === 'merge-intervals') {
      const hasSort = cleanedCode.includes('sort');
      const hasOverlapCheck = cleanedCode.includes('max') || cleanedCode.includes('[1]');

      if (hasSort && hasOverlapCheck) {
        matchPercentage = 95;
        feedback.push('Correct sorting logic! Intervals must be sorted by start time for a greedy merge to work.');
        feedback.push('Your time complexity is O(N log N) due to sorting, which is optimal.');
      } else {
        matchPercentage = 55;
        feedback.push('You must sort the intervals by their start times before merging. Otherwise, overlaps cannot be resolved in one pass.');
      }
    }

    if (feedback.length === 0) {
      feedback.push('Your code structure is readable and follows standard logic.');
      feedback.push('Review the optimum solution for minor syntax or structure optimizations.');
    }

    return {
      optimumSolution: dbSolution.code,
      matchPercentage,
      userComplexity: { time: userTime, space: userSpace },
      optimumComplexity: { time: dbSolution.timeComplexity, space: dbSolution.spaceComplexity },
      feedback,
      explanation: dbSolution.explanation
    };
  };

  // Gemini API matching engine for Custom mode
  const runGeminiMatching = async (questionName, codeStr, langName) => {
    if (!apiKey) {
      throw new Error('Gemini API Key is not configured. Please create a `.env` file with `VITE_GEMINI_API_KEY=YOUR_KEY` in the project root to enable custom question matching.');
    }

    const prompt = `
You are an expert algorithms interviewer and code reviewer.
The user is solving the following coding question:
"${questionName}"

The user has submitted this solution code in ${langName}:
\`\`\`
${codeStr}
\`\`\`

Perform these tasks:
1. Provide the absolute optimum/optimal solution code for this question in ${langName}. Follow clean-code conventions and provide the best possible time and space complexities.
2. Analyze the user's code and compare it to the optimum solution.
3. Determine:
   - User's Time Complexity and Space Complexity.
   - Optimum's Time Complexity and Space Complexity.
   - A Match/Similarity score between 0 and 100 (where 100 is identical optimal code, 80-90 is optimal but minor stylistic differences, 40-70 is suboptimal complexity or major bugs, and 0-30 is wrong approach or empty).
   - An explanation of the optimal approach.
   - A list of specific, actionable suggestions for optimizing or fixing the user's code.

Return the response STRICTLY as a JSON object matching this structure:
{
  "optimumSolution": "OPTIMAL_CODE_STRING",
  "matchPercentage": 85,
  "userComplexity": {
    "time": "O(N^2)",
    "space": "O(1)"
  },
  "optimumComplexity": {
    "time": "O(N)",
    "space": "O(N)"
  },
  "explanation": "Brief explanation of why the optimum solution is optimal.",
  "feedback": [
    "Feedback item 1...",
    "Feedback item 2..."
  ]
}
Do not include any wrapping markdown blocks (like \`\`\`json) or additional text in your response. Return raw JSON only.
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
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

    if (!response.ok) {
      const errDetails = await response.text();
      throw new Error(`Gemini API returned status ${response.status}: ${errDetails}`);
    }

    const resData = await response.json();
    const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error('Received an empty response from Gemini API.');
    }

    return JSON.parse(responseText.trim());
  };

  const handleCompare = async () => {
    setIsLoading(true);
    setError('');
    setComparisonResult(null);

    const isLanguageStaticallySupported = [
      'python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust'
    ].includes(selectedLanguage.id);

    try {
      if (questionMode === 'predefined') {
        if (isLanguageStaticallySupported || !apiKey) {
          const result = runLocalMatching(selectedQuestionId, userCode, selectedLanguage.id);
          if (result && !isLanguageStaticallySupported) {
            result.isFallback = true;
            result.originalLanguageName = selectedLanguage.name;
          }
          setComparisonResult(result);
        } else {
          try {
            // Dynamic matching via Gemini to output the predefined question in the custom language
            const name = `${currentPredefinedQuestion.title} (${currentPredefinedQuestion.description})`;
            const result = await runGeminiMatching(name, userCode, selectedLanguage.name);
            setComparisonResult(result);
          } catch (apiErr) {
            console.warn('Gemini API matching failed, falling back to local JavaScript solution:', apiErr);
            const result = runLocalMatching(selectedQuestionId, userCode, selectedLanguage.id);
            if (result) {
              result.isFallback = true;
              result.originalLanguageName = selectedLanguage.name;
              result.fallbackReason = apiErr.message;
            }
            setComparisonResult(result);
          }
        }
      } else {
        const name = customQuestionName.trim();
        if (!name) {
          throw new Error('Please enter the name of the question.');
        }
        const result = await runGeminiMatching(name, userCode, selectedLanguage.name);
        setComparisonResult(result);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPredefinedQuestion = getQuestionById(selectedQuestionId);

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      <div className={`matcher-drawer ${isOpen ? 'open' : ''}`}>
        <div className="matcher-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} className="text-primary" />
            <h2>Solution Matcher</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose} title="Close Panel">
            <X size={18} />
          </button>
        </div>

        <div className="matcher-body">
          {/* Question Mode Tabs */}
          <div className="matcher-tabs">
            <button
              className={`matcher-tab-btn ${questionMode === 'predefined' ? 'active' : ''}`}
              onClick={() => setQuestionMode('predefined')}
            >
              Popular Questions
            </button>
            <button
              className={`matcher-tab-btn ${questionMode === 'custom' ? 'active' : ''}`}
              onClick={() => setQuestionMode('custom')}
            >
              Custom Question (AI)
            </button>
          </div>

          {/* Form Controls */}
          <div className="matcher-form">
            {questionMode === 'predefined' ? (
              <div className="form-group">
                <label>Select Question</label>
                <select
                  className="matcher-select"
                  value={selectedQuestionId}
                  onChange={(e) => setSelectedQuestionId(e.target.value)}
                >
                  {LEETCODE_QUESTIONS.map(q => (
                    <option key={q.id} value={q.id}>{q.title} ({q.difficulty})</option>
                  ))}
                </select>
                {currentPredefinedQuestion && (
                  <p className="question-desc-text">
                    <strong>Description: </strong>{currentPredefinedQuestion.description}
                  </p>
                )}
              </div>
            ) : (
              <div className="form-group">
                <label>Question Title or Description</label>
                <input
                  type="text"
                  className="matcher-input"
                  placeholder="e.g. Merge K Sorted Lists, LRU Cache..."
                  value={customQuestionName}
                  onChange={(e) => setCustomQuestionName(e.target.value)}
                />
                {!apiKey && (
                  <div className="api-key-warning">
                    <Info size={16} style={{ flexShrink: 0 }} />
                    <span>
                      Please configure <code>VITE_GEMINI_API_KEY</code> in your <code>.env</code> file to enable Custom Question matching via Gemini AI.
                    </span>
                  </div>
                )}
              </div>
            )}

            <button
              className="btn btn-primary matcher-compare-btn"
              onClick={handleCompare}
              disabled={isLoading || (questionMode === 'custom' && !apiKey)}
            >
              {isLoading ? (
                <>
                  <div className="spinner-small" />
                  <span>Matching Code...</span>
                </>
              ) : (
                <>
                  <Flame size={16} />
                  <span>Compare Solution</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="matcher-error">
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Results Display */}
          {comparisonResult && (
            <div className="matcher-results">
              <div className="divider-glow" />

              {/* Fallback Banner */}
              {comparisonResult.isFallback && (
                <div className="api-key-warning" style={{ margin: '0 0 16px 0', border: '1px dashed var(--color-warning)' }}>
                  <Info size={16} style={{ flexShrink: 0, color: 'var(--color-warning)' }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    Showing optimal solution in <strong>JavaScript</strong> (fallback). Configure <code>VITE_GEMINI_API_KEY</code> in your <code>.env</code> file to enable dynamic AI matching in <strong>{comparisonResult.originalLanguageName}</strong>.
                    {comparisonResult.fallbackReason && (
                      <span style={{ display: 'block', marginTop: '4px', color: 'var(--color-warning)', fontSize: '0.75rem' }}>
                        API Note: {comparisonResult.fallbackReason}
                      </span>
                    )}
                  </span>
                </div>
              )}

              {/* Score and Complexity Badges */}
              <div className="results-summary-card glass-panel">
                <div className="score-gauge-container">
                  <div className="score-radial">
                    <span className="score-number">{comparisonResult.matchPercentage}%</span>
                    <span className="score-label">Match</span>
                  </div>
                  <div className="score-status">
                    {comparisonResult.matchPercentage >= 90 ? (
                      <span className="badge-optimal"><CheckCircle2 size={14} /> Optimal Approach</span>
                    ) : comparisonResult.matchPercentage >= 70 ? (
                      <span className="badge-passable">Passable Approach</span>
                    ) : (
                      <span className="badge-suboptimal">Suboptimal Approach</span>
                    )}
                  </div>
                </div>

                <div className="complexity-grid">
                  <div className="complexity-col">
                    <span className="complexity-title">Your Solution</span>
                    <span className="complexity-val">Time: <strong>{comparisonResult.userComplexity?.time || 'N/A'}</strong></span>
                    <span className="complexity-val">Space: <strong>{comparisonResult.userComplexity?.space || 'N/A'}</strong></span>
                  </div>
                  <div className="complexity-col border-left">
                    <span className="complexity-title text-primary">Optimum Solution</span>
                    <span className="complexity-val">Time: <strong>{comparisonResult.optimumComplexity?.time || 'N/A'}</strong></span>
                    <span className="complexity-val">Space: <strong>{comparisonResult.optimumComplexity?.space || 'N/A'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Feedback Bullet Points */}
              <div className="feedback-section">
                <h3>Code Feedback</h3>
                <ul className="feedback-list">
                  {comparisonResult.feedback.map((item, idx) => (
                    <li key={idx}>
                      <span className="list-dot">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explanation */}
              {comparisonResult.explanation && (
                <div className="feedback-section">
                  <h3>Approach Explanation</h3>
                  <p className="approach-explanation-text">
                    {comparisonResult.explanation}
                  </p>
                </div>
              )}

              {/* Optimal Solution Code Block */}
              <div className="optimal-code-section">
                <div className="optimal-code-header">
                  <h3>Optimum Solution Code</h3>
                  <button
                    className="btn btn-icon btn-small"
                    onClick={() => handleCopyCode(comparisonResult.optimumSolution)}
                    title="Copy Code"
                  >
                    {isCopied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="optimal-code-container">
                  <pre>
                    <code>{comparisonResult.optimumSolution}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
