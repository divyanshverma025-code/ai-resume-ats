import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import AuthPanel from "./AuthPanel";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, supabase } = useAuth();
  const navigate = useNavigate();

  async function signOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    navigate("/");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">🎯</span>
          <span>
            <strong>ATS Resume Scorer</strong>
            <small>AI-powered resume analysis</small>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            Home
          </NavLink>
          <NavLink to="/analyze" className={({ isActive }) => isActive ? "active" : ""}>
            ATS Scorer
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? "active" : ""}>
            History
          </NavLink>
          <NavLink to="/resources" className={({ isActive }) => isActive ? "active" : ""}>
            Resources
          </NavLink>
        </nav>

        <div className="account-area">
          {user ? (
            <>
              <span className="user-chip">{user.email}</span>
              <button className="btn btn-secondary btn-sm" onClick={signOut}>
                Sign out
              </button>
            </>
          ) : (
            <a href="/?signin=1" className="btn btn-primary btn-sm">
              Sign in
            </a>
          )}
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <span>ATS Resume Scorer</span>
        <span>FastAPI + React + Supabase</span>
      </footer>

      {!user && <AuthPanel />}
    </div>
  );
}