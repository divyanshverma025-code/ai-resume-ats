import { useState } from "react";
import { generatePdf, getApiErrorMessage, downloadBlob } from "../services/api";
import { downloadText, summaryText } from "../utils/analysis";
import { useAuth } from "../context/AuthContext";

export default function ExportButtons({ analysis }) {
  const { accessToken } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function makePdf() {
    setBusy(true);
    setError("");
    try {
      const response = await generatePdf(analysis, accessToken);
      downloadBlob(response.data, "ats_resume_report.pdf");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="export-card">
      <div>
        <span className="eyebrow">Export Results</span>
        <h3>Take your analysis with you</h3>
      </div>

      <div className="export-actions">
        <button className="btn btn-primary" onClick={makePdf} disabled={busy}>
          📑 {busy ? "Generating PDF…" : "Generate PDF Report"}
        </button>

        <button
          className="btn btn-secondary"
          onClick={() =>
            downloadText(summaryText(analysis), "ats_summary.txt")
          }
        >
          📄 Download Summary
        </button>
      </div>

      {error && <div className="alert alert-danger compact-alert">{error}</div>}
    </div>
  );
}