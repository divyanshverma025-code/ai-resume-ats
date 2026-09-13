export const COMPONENTS = [
  ["Formatting", "formatting", 20, "📝"],
  ["Keywords & Skills", "keywords", 25, "🔑"],
  ["Content Quality", "content", 25, "📄"],
  ["Skill Validation", "skill_validation", 15, "✅"],
  ["ATS Compatibility", "ats_compatibility", 15, "🤖"]
];

export function scoreValue(analysis) {
  return Number(analysis?.ATS_score ?? analysis?.ats_score ?? 0);
}

export function scoreTone(score) {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  return "poor";
}

export function severityRank(level) {
  return {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3
  }[(level || "low").toLowerCase()] ?? 99;
}

export function severityMeta(level) {
  const normalized = (level || "low").toLowerCase();
  return {
    critical: { icon: "🔴", className: "severity-critical" },
    high: { icon: "🟠", className: "severity-high" },
    medium: { icon: "🟡", className: "severity-medium" },
    low: { icon: "🟢", className: "severity-low" }
  }[normalized] ?? { icon: "🟢", className: "severity-low" };
}

export function collectActionItems(analysis) {
  const items = [];

  for (const issue of analysis?.detailed_feedback || []) {
    const severity = (issue?.severity_level || "low").toLowerCase();
    const title = issue?.issue_title || "Issue";

    for (const action of issue?.action_items || []) {
      items.push({ severity, title, action });
    }
  }

  if (!items.length) {
    for (const suggestion of analysis?.suggestions || []) {
      items.push({ severity: "medium", title: "General", action: suggestion });
    }
  }

  return items.sort(
    (a, b) => severityRank(a.severity) - severityRank(b.severity)
  );
}

export function summaryText(analysis) {
  const score = scoreValue(analysis);
  const lines = [`ATS Score: ${score.toFixed(0)}/100`, ""];

  if (analysis?.strengths?.length) {
    lines.push("STRENGTHS:");
    lines.push(...analysis.strengths.map((s) => `  - ${s}`));
    lines.push("");
  }

  if (analysis?.critical_issues?.length) {
    lines.push("CRITICAL ISSUES:");
    lines.push(...analysis.critical_issues.map((s) => `  - ${s}`));
    lines.push("");
  }

  if (analysis?.suggestions?.length) {
    lines.push("SUGGESTIONS:");
    lines.push(...analysis.suggestions.map((s) => `  - ${s}`));
  }

  return lines.join("\n");
}

export function downloadText(text, filename) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}