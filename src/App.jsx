import { useEffect, useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { CodeInputPanel } from './components/analysis/CodeInputPanel';
import { ResultsPanel } from './components/analysis/ResultsPanel';
import { SAMPLES, STAGES, calcScore, detectVulnerabilities } from './data/vulnerabilityData';
import './App.css';

const MAX_CODE_LENGTH = 20000;

const sanitizeCodeInput = (value = '') => {
  const normalized = value.replace(/\r\n?/g, '\n');

  return Array.from(normalized)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code === 9 || code === 10 || code >= 32;
    })
    .join('');
};

const JS_LANGUAGE_MARKERS = [
  /\bconst\b/,
  /\blet\b/,
  /\bvar\b/,
  /\bfunction\b/,
  /=>/,
  /\brequire\s*\(/,
  /\bconsole\./,
  /\bdocument\./,
  /\bwindow\./,
  /\bmodule\.exports\b/,
  /\bprocess\./,
  /\bMath\./,
];

const PYTHON_LANGUAGE_MARKERS = [
  /\bdef\b/,
  /\bfrom\b/,
  /\bprint\s*\(/,
  /\blambda\b/,
  /\bself\b/,
  /\basync def\b/,
  /\bawait\b/,
  /\bTrue\b/,
  /\bFalse\b/,
  /\bNone\b/,
  /\brequest\./,
  /\bos\./,
  /\b@app\./,
];

const validateCodeForLanguage = (snippet, selectedLanguage) => {
  const normalizedSnippet = sanitizeCodeInput(snippet);
  const trimmed = normalizedSnippet.trim();
  if (!trimmed) {
    return {
      valid: false,
      error: 'Paste some code before running an analysis — there is nothing to scan yet.',
    };
  }

  if (normalizedSnippet.length > MAX_CODE_LENGTH) {
    return {
      valid: false,
      error: `The pasted input is too long. Keep snippets under ${MAX_CODE_LENGTH.toLocaleString()} characters for a safe scan.`,
    };
  }

  if (trimmed.length < 20) {
    return {
      valid: false,
      error:
        selectedLanguage === 'javascript'
          ? 'The pasted input does not look like JavaScript code. Please paste a complete JavaScript snippet and make sure the selected language matches it.'
          : 'The pasted input does not look like Python code. Please paste a complete Python snippet and make sure the selected language matches it.',
    };
  }

  const hasJavaScriptSignals = JS_LANGUAGE_MARKERS.some((pattern) => pattern.test(trimmed));
  const hasPythonSignals = PYTHON_LANGUAGE_MARKERS.some((pattern) => pattern.test(trimmed));

  if (selectedLanguage === 'javascript') {
    if (hasPythonSignals && !hasJavaScriptSignals) {
      return {
        valid: false,
        error: 'The pasted input looks like Python code. Switch to Python or paste JavaScript code.',
      };
    }

    if (!hasJavaScriptSignals && !hasPythonSignals) {
      return {
        valid: false,
        error:
          'The pasted input does not look like JavaScript code. Please paste a complete JavaScript snippet and make sure the selected language matches it.',
      };
    }
  }

  if (selectedLanguage === 'python') {
    if (hasJavaScriptSignals && !hasPythonSignals) {
      return {
        valid: false,
        error: 'The pasted input looks like JavaScript code. Switch to JavaScript or paste Python code.',
      };
    }

    if (!hasJavaScriptSignals && !hasPythonSignals) {
      return {
        valid: false,
        error:
          'The pasted input does not look like Python code. Please paste a complete Python snippet and make sure the selected language matches it.',
      };
    }
  }

  return { valid: true, error: null };
};

function App() {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle');
  const [stageIndex, setStageIndex] = useState(0);
  const [findings, setFindings] = useState([]);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const timers = useRef([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const handleAnalyze = () => {
    const sanitizedCode = sanitizeCodeInput(code);
    const validation = validateCodeForLanguage(sanitizedCode, language);

    clearTimers();
    setStageIndex(0);
    setExpandedId(null);
    setFindings([]);

    if (!validation.valid) {
      setError(validation.error);
      setStatus('idle');
      return;
    }

    setError(null);
    setStatus('analyzing');

    STAGES.forEach((_, index) => {
      const stageTimer = setTimeout(() => setStageIndex(index), index * 480);
      timers.current.push(stageTimer);
    });

    const completeTimer = setTimeout(() => {
      try {
        const results = detectVulnerabilities(sanitizedCode, language);
        setFindings(results);
        setStatus('complete');
      } catch {
        setError('Unable to analyze this input. Please paste valid JavaScript or Python code and try again.');
        setStatus('idle');
      }
    }, STAGES.length * 480 + 350);

    timers.current.push(completeTimer);
  };

  const handleReset = () => {
    clearTimers();
    setStatus('idle');
    setFindings([]);
    setError(null);
    setExpandedId(null);
    setStageIndex(0);
    setCode('');
  };

  const handleCodeChange = (nextValue) => {
    const sanitizedValue = sanitizeCodeInput(nextValue);
    setCode(sanitizedValue.length > MAX_CODE_LENGTH ? sanitizedValue.slice(0, MAX_CODE_LENGTH) : sanitizedValue);
  };

  const loadSample = (key) => {
    const sample = SAMPLES[key];
    if (!sample) return;

    clearTimers();
    setLanguage(sample.language);
    setCode(sanitizeCodeInput(sample.code));
    setStatus('idle');
    setFindings([]);
    setError(null);
    setExpandedId(null);
  };

  const score = status === 'complete' ? calcScore(findings) : null;
  const counts = ['critical', 'high', 'medium', 'low'].map((severity) => ({
    severity,
    count: findings.filter((finding) => finding.severity === severity).length,
  }));
  const progress = status === 'analyzing' ? Math.round(((stageIndex + 1) / STAGES.length) * 100) : null;

  return (
    <div className="csa-root">
      <div className="csa-shell">
        <header className="csa-header">
          <div className="csa-brand">
            <div className="csa-logo">
              <ShieldCheck size={19} />
            </div>
            <div>
              <div className="csa-title">CogniShield</div>
              <div className="csa-tagline">Secure code analysis, explained in plain language</div>
            </div>
          </div>

          <div className="csa-status-pill" role="status" aria-live="polite">
            <span className="csa-status-dot" />
            {status === 'analyzing'
              ? 'Scanning…'
              : status === 'complete'
              ? 'Scan complete'
              : 'Ready to scan'}
          </div>
        </header>

        <div className="csa-grid">
          <CodeInputPanel
            language={language}
            code={code}
            onLanguageChange={setLanguage}
            onCodeChange={handleCodeChange}
            onLoadSample={loadSample}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
            status={status}
            error={error}
            samples={SAMPLES}
          />

          <ResultsPanel
            status={status}
            findings={findings}
            score={score}
            counts={counts}
            expandedId={expandedId}
            onToggleFinding={(id) => setExpandedId(expandedId === id ? null : id)}
            stageIndex={stageIndex}
            stages={STAGES}
            progress={progress}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
