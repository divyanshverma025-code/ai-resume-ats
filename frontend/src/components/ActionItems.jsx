import { collectActionItems } from "../utils/analysis";

export default function ActionItems({ analysis }) {
  const items = collectActionItems(analysis);
  if (!items.length) return null;

  const icons = { critical: "🔴", high: "🟠", medium: "🟡", low: "🟢" };

  return (
    <div className="action-list">
      {items.map((item, index) => (
        <div className={`action-item action-${item.severity}`} key={index}>
          <span className="action-icon">{icons[item.severity] || "🟢"}</span>
          <div>
            <strong>[{item.title}]</strong>
            <p>{item.action}</p>
          </div>
        </div>
      ))}
    </div>
  );
}