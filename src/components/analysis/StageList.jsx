export function StageList({ stages, activeIndex }) {
  return (
    <div className="csa-stage-list">
      {stages.map((stage, index) => (
        <div
          key={stage}
          className={`csa-stage ${index === activeIndex ? 'active' : index < activeIndex ? 'done' : ''}`}
        >
          <span className="csa-stage-dot" />
          {stage}
        </div>
      ))}
    </div>
  );
}
