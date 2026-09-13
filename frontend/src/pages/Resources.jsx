export default function Resources() {
  return (
    <div className="page page-narrow">
      <div className="page-header">
        <div>
          <span className="eyebrow">Resources</span>
          <h1>How the analyzer works</h1>
          <p>The React UI is a replacement for Streamlit; the analysis engine remains in FastAPI.</p>
        </div>
      </div>

      <div className="resource-stack">
        <article className="resource-card">
          <h2>📦 Supported resume files</h2>
          <p>PDF, DOC, and DOCX. The backend enforces a maximum resume size of 5 MB.</p>
        </article>

        <article className="resource-card">
          <h2>📊 Score dimensions</h2>
          <p>
            Formatting 20 points, Keywords & Skills 25, Content Quality 25,
            Skill Validation 15, and ATS Compatibility 15.
          </p>
        </article>

        <article className="resource-card">
          <h2>🎯 JD comparison</h2>
          <p>
            When you provide a job description, the backend returns match
            percentage, semantic similarity, matched keywords, missing
            keywords, and a skills gap.
          </p>
        </article>

        <article className="resource-card">
          <h2>🔐 Authentication</h2>
          <p>
            Supabase manages sign-in/sign-up and issues the JWT access token.
            React sends that token to FastAPI as a Bearer token for protected endpoints.
          </p>
        </article>
      </div>
    </div>
  );
}