export function ScoreGauge({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = score >= 80 ? 'var(--accent)' : score >= 50 ? 'var(--high)' : 'var(--crit)';
  const verdict = score >= 80 ? 'Low risk' : score >= 50 ? 'Needs attention' : 'High risk';

  return (
    <div className="csa-gauge-wrap">
      <svg width="132" height="132" viewBox="0 0 132 132" className="csa-gauge-svg">
        <circle
          cx="66"
          cy="66"
          r={radius}
          fill="none"
          stroke="var(--border-hair)"
          strokeWidth="10"
        />
        <circle
          cx="66"
          cy="66"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 66 66)"
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="csa-gauge-center">
        <div className="csa-gauge-score csa-mono">{score}</div>
        <div className="csa-gauge-max csa-mono">/100</div>
      </div>
      <div className="csa-gauge-verdict" style={{ color }}>{verdict}</div>
    </div>
  );
}
