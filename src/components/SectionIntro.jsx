import MotionCard from "./MotionCard";

// Supplied decorative illustrations, separate from real project screenshots.
// The compact guide slot remains independent of the artwork and headings.
export default function SectionIntro({ section }) {
  const artwork = `/assets/sections/${section}-intro.png`;
  return (
    <div className="section-intro" data-section={section} aria-hidden="true">
      <MotionCard
        className="section-artwork"
        panelClassName="section-artwork-panel"
        style={{ "--artwork-image": `url("${artwork}")` }}
      >
        <img
          src={artwork}
          width="1920"
          height="480"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </MotionCard>
      <div className="section-guide-slot" />
    </div>
  );
}
