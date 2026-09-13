import { useState } from "react";
import { analyzeResume, getApiErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import FileDropzone from "../components/FileDropzone";
import ResultsDashboard from "../components/ResultsDashboard";
import ExportButtons from "../components/ExportButtons";

export default function Analyze() {
  const { accessToken } = useAuth();

  const [mode, setMode] = useState("general");
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jdFile, setJdFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleJdFile(event) {
    const next = event.target.files?.[0];
    setJdFile(next || null);

    if (!next) return;

    if (next.size > 5 * 1024 * 1024) {
      setError("The JD text file is larger than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setJobDescription(String(reader.result || ""));
    reader.onerror = () => setError("Could not read the JD text file.");
    reader.readAsText(next);
  }

  function validate() {
    if (!file) return "Please upload your resume.";
    if (file.size > 5 * 1024 * 1024) return "Resume exceeds the backend's 5 MB limit.";

    const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
    if (![".pdf", ".docx"].includes(extension)) {
      return "Supported resume types are PDF and DOCX.";
    }

    if (mode === "jd" && !jobDescription.trim()) {
      return "Please paste the job description or upload a .txt JD file.";
    }

    return "";
  }

  async function submit(event) {
    event.preventDefault();

    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await analyzeResume({
        file,
        jobDescription: mode === "jd" ? jobDescription : "",
        accessToken
      });

      setAnalysis(response.data);
      setSuccess("Analysis complete.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">ATS Scorer</span>
          <h1>Analyze your resume</h1>
          <p>Upload your resume — and optionally a job description — for a comprehensive analysis.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={submit} className="analysis-form">
        <div className="mode-switch">
          <button
            type="button"
            className={mode === "general" ? "active" : ""}
            onClick={() => {
              setMode("general");
              setError("");
            }}
          >
            📊 General ATS Score
          </button>
          <button
            type="button"
            className={mode === "jd" ? "active" : ""}
            onClick={() => {
              setMode("jd");
              setError("");
            }}
          >
            🎯 Job Description Comparison
          </button>
        </div>

        <div className="input-grid">
          <div className="form-card">
            <div className="form-card-heading">
              <div>
                <h2>📄 Upload Resume</h2>
                <p>Supported: PDF, DOCX · max 5 MB</p>
              </div>
            </div>

            <FileDropzone file={file} onChange={setFile} />
          </div>

          <div className="form-card">
            <div className="form-card-heading">
              <div>
                <h2>📋 Job Description</h2>
                <p>
                  {mode === "jd"
                    ? "Paste text or upload a .txt file."
                    : "Switch to comparison mode to enable JD matching."}
                </p>
              </div>
            </div>

            {mode === "jd" ? (
              <>
                <textarea
                  className="jd-textarea"
                  value={jobDescription}
                  onChange={(event) => {
                    setJdFile(null);
                    setJobDescription(event.target.value);
                  }}
                  placeholder="Paste the job description here..."
                />

                <div className="file-inline">
                  <span>Or upload .txt:</span>
                  <input
                    type="file"
                    accept=".txt,text/plain"
                    onChange={handleJdFile}
                  />
                  {jdFile && <small>{jdFile.name}</small>}
                </div>
              </>
            ) : (
              <div className="mode-info">
                <strong>General ATS Score</strong>
                <span>
                  The backend receives an empty job description and performs
                  resume-only analysis.
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="analyze-cta">
          <button
            className="btn btn-primary btn-lg"
            type="submit"
            disabled={loading}
          >
            🚀 {loading ? "Analyzing your resume…" : "Analyze Resume"}
          </button>
          {loading && (
            <span className="loading-hint">
              This can take 10–30 seconds while the backend loads/runs its models.
            </span>
          )}
        </div>
      </form>

      {analysis && (
        <>
          <div className="results-divider" />
          <ResultsDashboard analysis={analysis} />
          <ExportButtons analysis={analysis} />
        </>
      )}
    </div>
  );
}