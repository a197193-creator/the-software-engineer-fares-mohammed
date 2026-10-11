// Reserve a compact guide slot only; replacement artwork is specified in docs.
// Keep the slot separate from headings so the guardian cannot cover body text.
export default function SectionIntro({ section }) {
  return <div className="section-intro section-guide-slot" data-section={section} aria-hidden="true" />;
}