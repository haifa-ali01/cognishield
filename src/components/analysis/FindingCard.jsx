import {
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  GitBranch,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export function FindingCard({ finding, expanded, onToggle, index }) {
  const metaColor = `var(--${finding.severity})`;
  return (
    <div className="csa-finding" style={{ '--sev-color': metaColor }} onClick={onToggle}>
      <div className="csa-finding-head">
        <span className="csa-finding-index csa-mono">{String(index + 1).padStart(2, '0')}</span>
        <div className="csa-finding-bar" />
        <div className="csa-finding-title">
          <div className="csa-finding-name">{finding.name}</div>
          <div className="csa-finding-meta csa-mono">
            Line {finding.lineNumber}
            {finding.sourceLine ? ` (source: line ${finding.sourceLine})` : ''} · {finding.cwe}
          </div>
        </div>
        <span className="csa-badge" style={{ '--badge-color': metaColor }}>
          {finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)}
        </span>
        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>

      {expanded && (
        <div className="csa-finding-body">
          {finding.sourceLine ? (
            <div className="csa-finding-section">
              <div className="csa-finding-label">
                <GitBranch size={13} /> Tainted data flow
              </div>
              <div className="csa-flow">
                <div className="csa-flow-row">
                  <span className="csa-flow-tag csa-mono">line {finding.sourceLine} · source</span>
                  <code className="csa-mono">{finding.sourceSnippet}</code>
                </div>
                <div className="csa-flow-row">
                  <span className="csa-flow-tag csa-mono">line {finding.lineNumber} · sink</span>
                  <code className="csa-mono">{finding.snippet}</code>
                </div>
              </div>
            </div>
          ) : (
            <div className="csa-finding-snippet csa-mono">{finding.snippet}</div>
          )}

          <div className="csa-finding-section">
            <div className="csa-finding-label">
              <Sparkles size={13} /> What's happening
            </div>
            <p>{finding.explanation}</p>
          </div>

          <div className="csa-finding-section">
            <div className="csa-finding-label">
              <AlertTriangle size={13} /> Why it matters
            </div>
            <p>{finding.whyItMatters}</p>
          </div>

          <div className="csa-finding-section">
            <div className="csa-finding-label">
              <ShieldCheck size={13} /> Recommended fix
            </div>
            <p>{finding.remediation.summary}</p>
            <div className="csa-diff">
              <div className="csa-diff-row csa-diff-before">
                <span className="csa-diff-tag csa-mono">− before</span>
                <code className="csa-mono">{finding.remediation.before}</code>
              </div>
              <div className="csa-diff-row csa-diff-after">
                <span className="csa-diff-tag csa-mono">+ after</span>
                <code className="csa-mono">{finding.remediation.after}</code>
              </div>
            </div>
          </div>

          <div className="csa-finding-tags">
            <span className="csa-tag csa-mono">{finding.cwe}</span>
            <span className="csa-tag csa-mono">{finding.owasp}</span>
          </div>
        </div>
      )}
    </div>
  );
}
