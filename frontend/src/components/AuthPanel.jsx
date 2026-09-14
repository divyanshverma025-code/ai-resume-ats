import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPanel() {
  const { user, supabase, configError } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const forcedOpen = searchParams.get("signin") === "1";
  const [open, setOpen] = useState(forcedOpen);
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (forcedOpen) setOpen(true);
  }, [forcedOpen]);

  const nextPath = useMemo(
    () => searchParams.get("next") || "/analyze",
    [searchParams]
  );

  if (user || !supabase) return null;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signin") {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });

        if (signInError) throw signInError;
        setOpen(false);
        setSearchParams({});
        window.location.assign(nextPath);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      });

      if (signUpError) throw signUpError;

      if (data.session) {
        setOpen(false);
        setSearchParams({});
        window.location.assign(nextPath);
      } else {
        setMessage(`Check your inbox — confirmation email sent to ${email}.`);
      }
    } catch (err) {
      setError(err?.message || "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  async function googleSignIn() {
    setBusy(true);
    setError("");
    try {
      const redirectTo = `${window.location.origin}${nextPath}`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo }
      });
      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err?.message || "Google sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <>
    

      {open && (
        <div className="modal-backdrop" onMouseDown={() => setOpen(false)}>
          <div className="auth-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            <div className="auth-heading">
              <span className="auth-icon">🎯</span>
              <div>
                <h2>{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
                <p>Sign in to analyze resumes and save your history.</p>
              </div>
            </div>

            {configError && (
              <div className="alert alert-danger">{configError}</div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={submit} className="form-stack">
              <label>
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                />
              </label>

              <button className="btn btn-primary btn-lg full-width" disabled={busy}>
                {busy
                  ? "Please wait…"
                  : mode === "signin"
                    ? "Sign in"
                    : "Create account"}
              </button>
            </form>

            <div className="or-divider"><span>or</span></div>

            <button
              className="btn btn-secondary btn-lg full-width"
              onClick={googleSignIn}
              disabled={busy}
            >
              <span>G</span> Continue with Google
            </button>

            <p className="switch-auth">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                className="link-button"
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError("");
                  setMessage("");
                }}
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}