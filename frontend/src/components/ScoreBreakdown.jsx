import { COMPONENTS } from "../utils/analysis";

export default function ScoreBreakdown({ analysis }) {
  const scores = analysis?.component_scores || {};

  return (
    <div className="score-grid">
      {COMPONENTS.map(([label, key, max, icon]) => {
        const value = Number(scores[key] || 0);
        const pct = Math.max(0, Math.min(100, (value / max) * 100));
        const tone = pct >= 80 ? "excellent" : pct >= 60 ? "good" : "poor";

        return (
          <div className="metric-card" key={key}>
            <div className="metric-top">
              <div className="metric-label">{icon} {label}</div>
              <strong>{value.toFixed(0)}/{max}</strong>
            </div>
            <div className="progress-container">
              <div
                className={`progress-bar progress-${tone}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <small>{pct.toFixed(0)}% of available points</small>
          </div>
        );
      })}
    </div>
  );
}