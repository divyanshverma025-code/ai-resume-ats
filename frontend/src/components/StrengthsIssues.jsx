export default function StrengthsIssues({ analysis }) {
  const strengths = analysis?.strengths || [];
  const critical = analysis?.critical_issues || [];
  const summary = analysis?.issues_summary || [];
  const extra = summary.filter((item) => !critical.includes(item));

  return (
    <div className="two-column">
      <div className="card-elevated">
        <h3>💪 Strengths</h3>
        {strengths.length ? (
          <div className="bullet-list success-list">
            {strengths.map((item, index) => (
              <div key={index}><span>✓</span>{item}</div>
            ))}
          </div>
        ) : (
          <div className="empty-panel">Keep improving your resume to unlock strengths.</div>
        )}
      </div>

      <div className="card-elevated">
        <h3>🚨 Critical Issues</h3>
        {critical.length || summary.length ? (
          <>
            <div className="alert alert-warning compact-alert">
              These issues should be addressed first for better ATS performance.
            </div>

            {critical.length > 0 && (
              <div className="bullet-list danger-list">
                {critical.map((item, index) => (
                  <div key={index}><span>!</span>{item}</div>
                ))}
              </div>
            )}

            {extra.length > 0 && (
              <details className="details-block">
                <summary>📋 Additional flagged items</summary>
                <div className="bullet-list">
                  {extra.map((item, index) => (
                    <div key={index}><span>•</span>{item}</div>
                  ))}
                </div>
              </details>
            )}
          </>
        ) : (
          <div className="empty-panel success-panel">
            <strong>✅ No Critical Issues Found!</strong>
            <span>Your resume doesn't have any urgent issues. Nice work.</span>
          </div>
        )}
      </div>
    </div>
  );
}