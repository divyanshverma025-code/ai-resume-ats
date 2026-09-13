import { useEffect, useState } from "react";
import { healthCheck, getApiErrorMessage } from "../services/api";

export default function TopStatus() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    healthCheck()
      .then(({ data }) => {
        if (active && data?.status === "healthy") setStatus("healthy");
        else if (active) setStatus("error");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  const label =
    status === "healthy"
      ? "Backend ready"
      : status === "checking"
        ? "Checking backend…"
        : "Backend unavailable";

  return (
    <div className={`status-pill status-${status}`}>
      <span className="status-dot" />
      {label}
    </div>
  );
}