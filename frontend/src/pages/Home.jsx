import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopStatus from "../components/TopStatus";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">🎯 AI-powered ATS analysis</div>
          <h1>Optimize your resume for applicant tracking systems.</h1>
          <p>
            Upload your resume and get a comprehensive ATS score, skill
            validation, job-description matching, and actionable feedback.
          </p>

          <div className="hero-actions">
            <Link className="btn btn-white btn-lg" to={user ? "/analyze" : "/?signin=1&next=/analyze"}>
              🚀 Start Analyzing Your Resume
            </Link>
            <Link className="btn btn-ghost btn-lg" to="/resources">
              Learn how it works
            </Link>
          </div>

          <TopStatus />
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Comprehensive Scoring</h3>
          <p>Five backend-scored dimensions covering the repository's real ATS weights.</p>
          <div className="weight-list">
            <span>Formatting <b>20</b></span>
            <span>Keywords & Skills <b>25</b></span>
            <span>Content Quality <b>25</b></span>
            <span>Skill Validation <b>15</b></span>
            <span>ATS Compatibility <b>15</b></span>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">✅</div>
          <h3>Skill Validation</h3>
          <p>
            Claimed skills can be checked against projects and experience using
            the backend's semantic validation output.
          </p>
          <div className="feature-note">No more empty claims.</div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>JD Comparison</h3>
          <p>
            Compare your resume with a job description using keyword matching
            and semantic similarity.
          </p>
          <div className="feature-note">See missing keywords and skills gaps.</div>
        </div>
      </section>

      <section className="how-it-works">
        <div>
          <span className="eyebrow">How it works</span>
          <h2>From upload to actionable feedback</h2>
        </div>

        <div className="step-grid">
          <div className="step-card">
            <span>1</span>
            <h3>Upload</h3>
            <p>PDF, DOC, or DOCX resume up to 5 MB.</p>
          </div>
          <div className="step-card">
            <span>2</span>
            <h3>Analyze</h3>
            <p>FastAPI runs the existing NLP and transformer pipeline.</p>
          </div>
          <div className="step-card">
            <span>3</span>
            <h3>Improve</h3>
            <p>Use score breakdowns, issues, and recommendations to revise.</p>
          </div>
        </div>
      </section>
    </div>
  );
}