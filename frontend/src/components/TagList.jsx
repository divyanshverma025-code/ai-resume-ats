export default function TagList({ items = [], tone = "neutral", empty = "None" }) {
  if (!items.length) {
    return <span className="empty-text">{empty}</span>;
  }

  return (
    <div className="tag-list">
      {items.map((item, index) => (
        <span className={`tag tag-${tone}`} key={`${item}-${index}`}>
          {item}
        </span>
      ))}
    </div>
  );
}