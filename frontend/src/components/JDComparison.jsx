import TagList from "./TagList";

export default function JDComparison({ analysis }) {
  const jd = analysis?.jd_comparison || analysis?.jd_match_analysis;
  if (!jd) return null;

  const match = Number(jd.match_percentage || 0);
  const semantic = Number(jd.semantic_similarity || 0);

  return (
    <div>
      <div className="two-column">
        <div className="card-elevated">
          <div className="metric-big">{match.toFixed(0)}%</div>
          <div className="muted">Match Percentage</div>
          <div className="progress-container large">
            <div className="progress-bar progress-primary" style={{ width: `${Math.max(0, Math.min(100, match))}%` }} />
          </div>

          <div className="metric-big secondary">{(semantic * 100).toFixed(0)}%</div>
          <div className="muted">Semantic Similarity</div>
          <div className="progress-container large">
            <div className="progress-bar progress-info" style={{ width: `${Math.max(0, Math.min(100, semantic * 100))}%` }} />
          </div>
        </div>

        <div className="card-elevated">
          <h3>✅ Matched keywords</h3>
          <TagList items={(jd.matched_keywords || []).slice(0, 20)} tone="success" empty="None matched yet" />
        </div>
      </div>

      <div className="two-column">
        <div className="card-soft">
          <h4>❌ Missing keywords</h4>
          {jd.missing_keywords?.length ? (
            <div className="bullet-list danger-list">
              {jd.missing_keywords.slice(0, 15).map((item, i) => <div key={i}><span>!</span>{item}</div>)}
            </div>
          ) : (
            <span className="empty-text">All key terms are present!</span>
          )}
        </div>

        <div className="card-soft">
          <h4>📊 Skills gap</h4>
          {jd.skills_gap?.length ? (
            <TagList items={jd.skills_gap.slice(0, 10)} tone="warning" empty="No significant skills gap detected" />
          ) : (
            <span className="empty-text">No significant skills gap detected.</span>
          )}
        </div>
      </div>
    </div>
  );
}