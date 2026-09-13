import TagList from "./TagList";

export default function SkillValidation({ analysis }) {
  const details = analysis?.skill_validation_details || {};
  const validated = details.validated || [];
  const unvalidated = details.unvalidated || [];
  const total = Number(details.total ?? validated.length + unvalidated.length);
  const pct = Number(details.validation_pct || 0);

  if (!total) {
    return (
      <div className="empty-panel">
        No skills detected on the resume.
      </div>
    );
  }

  return (
    <div>
      <div className="mini-stats three">
        <div><strong>{total}</strong><span>Total Skills</span></div>
        <div><strong>{details.validated_count ?? validated.length}</strong><span>Validated</span></div>
        <div><strong>{pct.toFixed(0)}%</strong><span>Validation</span></div>
      </div>

      <div className="progress-container large">
        <div className="progress-bar progress-success" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
      </div>

      <div className="two-column">
        <div className="card-soft">
          <h4>✅ Validated skills</h4>
          {validated.length ? (
            <div className="validation-list">
              {validated.map((entry, index) => {
                const similarity = typeof entry?.similarity === "number"
                  ? ` (${(entry.similarity * 100).toFixed(0)}% match)`
                  : "";
                const projects = entry?.projects?.slice?.(0, 3)?.join?.(", ") || "experience section";

                return (
                  <div className="validation-item" key={`${entry?.skill || "skill"}-${index}`}>
                    <strong>{entry?.skill || "?"}{similarity}</strong>
                    <span>Demonstrated in: {projects}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="empty-text">No validated skills yet.</span>
          )}
        </div>

        <div className="card-soft">
          <h4>⚠️ Unvalidated skills</h4>
          <p className="muted">These skills are listed but not tied to a project or experience bullet.</p>
          <TagList items={unvalidated} tone="danger" empty="None" />
        </div>
      </div>
    </div>
  );
}