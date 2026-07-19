import { useEffect, useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { CodeInputPanel } from './components/analysis/CodeInputPanel';
import { ResultsPanel } from './components/analysis/ResultsPanel';
import { SAMPLES, STAGES, calcScore, detectVulnerabilities } from './data/vulnerabilityData';
import './App.css';

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

  const isCodeLikelyValid = (snippet, languageOption) => {
    const trimmed = snippet.trim();
    if (trimmed.length < 20) {
      return false;
    }

    const validators = {
      javascript: /\b(const|let|var|function|class|=>|import|export|require|console|document|Math|process)\b/,
      python: /\b(def|class|import|from|print|lambda|async|await|self)\b/,
    };

    const pattern = validators[languageOption];
    return pattern.test(trimmed) || trimmed.length > 80;
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const handleAnalyze = () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("Paste some code before running an analysis — there's nothing to scan yet.");
      return;
    }

    if (!isCodeLikelyValid(trimmedCode, language)) {
      setError(
        `The pasted input does not look like ${language === 'javascript' ? 'JavaScript' : 'Python'} code. ` +
          'Please paste a complete code snippet and make sure the selected language matches it.'
      );
      return;
    }

    setError(null);
    clearTimers();
    setStatus('analyzing');
    setStageIndex(0);
    setExpandedId(null);

    STAGES.forEach((_, index) => {
      const stageTimer = setTimeout(() => setStageIndex(index), index * 480);
      timers.current.push(stageTimer);
    });

    const completeTimer = setTimeout(() => {
      try {
        const results = detectVulnerabilities(code, language);
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
  };

  const loadSample = (key) => {
    const sample = SAMPLES[key];
    if (!sample) return;

    clearTimers();
    setLanguage(sample.language);
    setCode(sample.code);
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

          <div className="csa-status-pill">
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
            onCodeChange={setCode}
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
