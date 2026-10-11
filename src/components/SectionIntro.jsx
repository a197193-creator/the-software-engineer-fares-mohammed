import { useEffect, useRef, useState } from "react";

// Decorative section identities share one observer pattern and CSS motion tokens.
export default function SectionIntro({ section }) {
  const root = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "80px 0px", threshold: .12 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className={`section-intro landscape-section intro-${section}`} data-visible={visible} aria-hidden="true">
    <svg viewBox="0 0 800 150" fill="none" focusable="false">
      <path className="intro-baseline" d="M0 132H800" />
      <g className="section-intro-art">
        {section === "about" && <>
          <circle cx="400" cy="58" r="22"/><path d="M357 112C357 76 443 76 443 112M250 44H318L355 66M545 38H488L452 66M290 111H338M462 111H526"/>
          <circle cx="246" cy="44" r="4"/><circle cx="550" cy="38" r="4"/><circle cx="532" cy="111" r="4"/>
        </>}
        {section === "skills" && <>
          <path d="M262 35H338V109H262ZM362 22H438V122H362ZM462 35H538V109H462ZM338 72H362M438 72H462"/>
          <path d="m283 59-13 13 13 13m35-26 13 13-13 13m89-34-15 52M482 58H518M482 72H505M482 86H514"/>
        </>}
        {section === "projects" && <>
          <rect x="265" y="38" width="180" height="82" rx="8"/><rect x="355" y="20" width="180" height="82" rx="8"/>
          <path d="M355 43H535M375 59H412V82H375ZM428 59H515M428 72H498M428 85H508M282 95H333"/>
          <circle cx="372" cy="31" r="2"/><circle cx="382" cy="31" r="2"/>
        </>}
        {section === "experience" && <>
          <path d="M220 110H295L365 77H435L505 38H580"/>
          {[ [295,110], [400,77], [505,38] ].map(([x,y]) => <g key={x}><circle cx={x} cy={y} r="8"/><path d={`M${x} ${y-14}V${y-35}h35`}/></g>)}
        </>}
        {section === "contact" && <>
          <rect x="345" y="35" width="110" height="70" rx="9"/><path d="m350 41 50 36 50-36M277 70H323M477 70H523M292 45H318M482 95H508"/>
          <circle cx="270" cy="70" r="4"/><circle cx="530" cy="70" r="4"/>
        </>}
      </g>
    </svg>
  </div>;
}
