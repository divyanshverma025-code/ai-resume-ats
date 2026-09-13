import { severityMeta, severityRank } from "../utils/analysis";

const ORDER = ["critical", "high", "medium", "low"];

export default function DetailedFeedback({ analysis }) {
  const issues = [...(analysis?.detailed_feedback || [])].sort(
    (a, b) =>
      severityRank(a?.severity_level) - severityRank(b?.severity_level)
  );

  if (!issues.length) return null;

  return (
    <div>
      <p className="muted">{issues.length} issue(s) flagged — grouped by severity.</p>

      {ORDER.map((level) => {
        const items = issues.filter(
          (item) => (item?.severity_level || "low").toLowerCase() === level
        );

        if (!items.length) return null;

        return (
          <div key={level} className="feedback-group">
            <h3>{level[0].toUpperCase() + level.slice(1)} <span>({items.length})</span></h3>

            {items.map((issue, index) => {
              const meta = severityMeta(issue?.severity_level);

              return (
                <details className={`feedback-item ${meta.className}`} key={`${issue?.issue_title || "issue"}-${index}`}>
                  <summary>
                    <span className="feedback-title">
                      {meta.icon} {issue?.issue_title || "Untitled issue"}
                    </span>
                    <span className="feedback-impact">{issue?.ats_impact || ""}</span>
                  </summary>

                  <div className="feedback-body">
                    {issue?.explanation && (
                      <p><strong>What's happening:</strong> {issue.explanation}</p>
                    )}
                    {issue?.where_it_appears && (
                      <p><strong>Where it appears:</strong> {issue.where_it_appears}</p>
                    )}
                    {issue?.how_to_fix && (
                      <p><strong>How to fix:</strong> {issue.how_to_fix}</p>
                    )}
                    {issue?.action_items?.length > 0 && (
                      <div>
                        <strong>Action items:</strong>
                        <div className="bullet-list">
                          {issue.action_items.map((item, i) => (
                            <div key={i}><span>•</span>{item}</div>
                          ))}
                        </div>
                      </div>
                    )}
                    {issue?.example_improvement && (
                      <div>
                        <strong>Example improvement:</strong>
                        <pre className="example-code">{issue.example_improvement}</pre>
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}