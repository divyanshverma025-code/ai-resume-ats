import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading, user, configError } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page-loading">Loading session…</div>;
  }

  if (configError && !user) {
    return (
      <div className="page page-narrow">
        <div className="alert alert-danger">
          <div className="alert-icon">⚠️</div>
          <div>{configError}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to={`/?signin=1&next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return children;
}