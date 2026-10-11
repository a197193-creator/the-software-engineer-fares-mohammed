// Supplied decorative illustrations, separate from real project screenshots.
// The compact guide slot remains independent of the artwork and headings.
export default function SectionIntro({ section }) {
  return (
    <div className="section-intro" data-section={section} aria-hidden="true">
      <div className="section-artwork">
        <img
          src={`/assets/sections/${section}-intro.png`}
          width="1920"
          height="480"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="section-guide-slot" />
    </div>
  );
}
