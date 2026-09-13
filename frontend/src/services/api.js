import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 120000
});

async function withAuth(accessToken, request) {
  if (!accessToken) {
    const error = new Error("You must be signed in to use this feature.");
    error.code = "NO_AUTH";
    throw error;
  }

  return request({
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
}

export async function analyzeResume({
  file,
  jobDescription = "",
  accessToken
}) {
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("job_description", jobDescription);

  return withAuth(accessToken, (config) =>
    api.post("/analyze-resume", formData, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data"
      }
    })
  );
}

export async function getHistory(accessToken) {
  return withAuth(accessToken, (config) =>
    api.get("/history", config)
  );
}

export async function deleteHistory(analysisId, accessToken) {
  return withAuth(accessToken, (config) =>
    api.delete(`/history/${encodeURIComponent(analysisId)}`, config)
  );
}

export async function generatePdf(analysis, accessToken) {
  return withAuth(accessToken, (config) =>
    api.post("/generate-pdf", analysis, {
      ...config,
      responseType: "blob"
    })
  );
}

export async function generateHistoryPdf(analysisId, accessToken) {
  return withAuth(accessToken, (config) =>
    api.get(`/history/${encodeURIComponent(analysisId)}/pdf`, {
      ...config,
      responseType: "blob"
    })
  );
}

export async function healthCheck() {
  return api.get("/health");
}

export function getApiErrorMessage(error) {
  if (error?.code === "NO_AUTH") return error.message;

  if (error?.response) {
    const status = error.response.status;
    const detail = error.response.data?.detail;

    if (status === 401) {
      return detail || "Your session expired. Please sign in again.";
    }

    if (status === 422) {
      return detail || "The uploaded file or request could not be validated.";
    }

    return detail
      ? `Backend returned ${status}: ${detail}`
      : `Backend returned ${status}.`;
  }

  if (error?.request) {
    return "Could not reach the FastAPI backend. Make sure it is running on port 8000.";
  }

  return error?.message || "Unexpected error.";
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}