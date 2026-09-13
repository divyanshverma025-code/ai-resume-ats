import { useEffect, useState } from "react";
import {
  deleteHistory,
  generateHistoryPdf,
  getApiErrorMessage,
  getHistory,
  downloadBlob
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function scoreClass(value) {
  const score = Number(value || 0);
  return score >= 80 ? "score-excellent" : score >= 60 ? "score-good" : "score-needs-improvement";
}

function formatDate(value) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function History() {
  const { accessToken } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await getHistory(accessToken);
      setHistory(response.data || []);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!window.confirm("Delete this analysis from your history?")) return;

    setBusyId(`delete-${id}`);
    setError("");

    try {
      await deleteHistory(id, accessToken);
      setHistory((items) => items.filter((item) => item.id !== id));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusyId("");
    }
  }

  async function pdf(id) {
    setBusyId(`pdf-${id}`);
    setError("");

    try {
      const response = await generateHistoryPdf(id, accessToken);
      downloadBlob(response.data, `ats_report_${id}.pdf`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">History</span>
          <h1>Analysis history</h1>
          <p>Past analyses saved against your account.</p>
        </div>
        <button className="btn btn-secondary" onClick={load} disabled={loading}>
          ↻ Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="page-loading">Loading history…</div>
      ) : !history.length ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h2>No analyses yet</h2>
          <p>Run your first resume scoring analysis and it will appear here.</p>
          <a className="btn btn-primary" href="/analyze">🎯 Go to ATS Scorer</a>
        </div>
      ) : (
        <>
          <div className="history-summary">
            <strong>{history.length}</strong> total analyses
          </div>

          <div className="history-list">
            {history.map((entry) => {
              const analysis = entry.analysis_result || {};
              const components = analysis.component_scores || {};
              const jd = analysis.jd_comparison || analysis.jd_match_analysis;

              return (
                <details className="history-card" key={entry.id}>
                  <summary>
                    <div className="history-main">
                      <span className="history-file">📄 {entry.filename || "resume"}</span>
                      <span className={`history-score ${scoreClass(entry.ats_score)}`}>
                        {Number(entry.ats_score || 0).toFixed(0)}/100
                      </span>
                      <span className="history-date">{formatDate(entry.created_at)}</span>
                    </div>
                  </summary>

                  <div className="history-body">
                    <div className="history-metrics">
                      <div><span>Overall</span><strong>{Number(entry.ats_score || 0).toFixed(0)}/100</strong></div>
                      <div><span>Formatting</span><strong>{Number(components.formatting || 0).toFixed(0)}/20</strong></div>
                      <div><span>Keywords</span><strong>{Number(components.keywords || 0).toFixed(0)}/25</strong></div>
                      <div><span>Content</span><strong>{Number(components.content || 0).toFixed(0)}/25</strong></div>
                      <div><span>Skill Validation</span><strong>{Number(components.skill_validation || 0).toFixed(0)}/15</strong></div>
                      <div><span>ATS Compatibility</span><strong>{Number(components.ats_compatibility || 0).toFixed(0)}/15</strong></div>
                    </div>

                    {jd && (
                      <div className="history-jd">
                        🎯 JD Match: <strong>{Number(jd.match_percentage || 0).toFixed(0)}%</strong>
                      </div>
                    )}

                    <div className="history-actions">
                      {entry.id && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => pdf(entry.id)}
                          disabled={busyId === `pdf-${entry.id}`}
                        >
                          📑 {busyId === `pdf-${entry.id}` ? "Generating…" : "Download PDF"}
                        </button>
                      )}

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => remove(entry.id)}
                        disabled={busyId === `delete-${entry.id}`}
                      >
                        🗑️ {busyId === `delete-${entry.id}` ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}