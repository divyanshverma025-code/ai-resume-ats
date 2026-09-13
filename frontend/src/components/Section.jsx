export default function Section({ title, icon = "", subtitle, children, className = "" }) {
  return (
    <section className={`section-block ${className}`}>
      <div className="section-heading">
        <div>
          <h2>{icon} {title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}