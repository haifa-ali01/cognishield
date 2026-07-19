import { Radar, AlertTriangle, Bug, RotateCcw } from 'lucide-react';

export function CodeInputPanel({
  language,
  code,
  onLanguageChange,
  onCodeChange,
  onLoadSample,
  onAnalyze,
  onReset,
  status,
  error,
  samples,
}) {
  return (
    <section className="csa-panel">
      <div className="csa-panel-label">
        <Radar size={13} /> Source input
      </div>

      <div className="csa-lang-toggle">
        <button
          type="button"
          className={`csa-lang-btn ${language === 'javascript' ? 'active' : ''}`}
          onClick={() => onLanguageChange('javascript')}
        >
          JavaScript
        </button>
        <button
          type="button"
          className={`csa-lang-btn ${language === 'python' ? 'active' : ''}`}
          onClick={() => onLanguageChange('python')}
        >
          Python
        </button>
      </div>

      <textarea
        className="csa-textarea csa-mono"
        placeholder={`Paste ${language === 'javascript' ? 'JavaScript' : 'Python'} code here…`}
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        spellCheck={false}
      />

      <div className="csa-samples">
        {Object.entries(samples).map(([key, sample]) => (
          <button
            key={key}
            type="button"
            className="csa-sample-btn"
            onClick={() => onLoadSample(key)}
          >
            Load: {sample.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="csa-error">
          <AlertTriangle size={14} style={{ marginTop: 1, flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <div className="csa-actions">
        <button
          type="button"
          className="csa-btn-primary"
          onClick={onAnalyze}
          disabled={status === 'analyzing'}
        >
          <Bug size={15} />
          {status === 'analyzing' ? 'Analyzing…' : 'Analyze code'}
        </button>
        {status !== 'idle' && (
          <button type="button" className="csa-btn-ghost" onClick={onReset}>
            <RotateCcw size={14} /> Reset
          </button>
        )}
      </div>
    </section>
  );
}
