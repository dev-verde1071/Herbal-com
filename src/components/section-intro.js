export default function SectionIntro({ eyebrow, title, copy, align = "left" }) {
  const alignment = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={alignment}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="section-title">{title}</h2>
      {copy ? <p className="section-copy">{copy}</p> : null}
    </div>
  );
      }
