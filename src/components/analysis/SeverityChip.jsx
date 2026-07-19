import { SEVERITY } from '../../data/vulnerabilityData';

export function SeverityChip({ severity, count }) {
  const meta = SEVERITY[severity];
  return (
    <div className="csa-chip" style={{ '--chip-color': meta.color }}>
      <span className="csa-chip-dot" />
      <span className="csa-chip-label">{meta.label}</span>
      <span className="csa-chip-count csa-mono">{count}</span>
    </div>
  );
}
