import { scoreTone, scoreValue } from "../utils/analysis";

export default function ScoreHero({ analysis }) {
  const score = scoreValue(analysis);
  const tone = scoreTone(score);

  const label =
    tone === "excellent"
      ? "Excellent ATS readiness"
      : tone === "good"
        ? "Good ATS foundation"
        : "Needs improvement";

  return (
    <div className={`score-hero score-${tone}`}>
      <div className="score-ring">
        <span className="score-emoji">
          {tone === "excellent" ? "🏆" : tone === "good" ? "👍" : "🚨"}
        </span>
        <strong>{score.toFixed(0)}</strong>
        <small>/ 100</small>
      </div>
      <div className="score-copy">
        <span className="eyebrow">Overall ATS Score</span>
        <h2>{label}</h2>
        <p>
          {analysis?.interpretation ||
            "Your score summarizes the resume's ATS-focused checks."}
        </p>
      </div>
    </div>
  );
}