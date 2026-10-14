import { useLayoutEffect, useRef, useState } from "react";
import { projectPlaceholders } from "../projectPlaceholders";
import { projectMedia } from "../projectMedia";
import { useLanguage } from "../LanguageContext";

export default function ProjectMedia({ src, alt, expanded = false }) {
  const { language } = useLanguage();
  const { width, height, kind } = projectMedia(src);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const image = useRef(null);
  useLayoutEffect(() => {
    setFailed(false);
    setLoaded(Boolean(image.current?.complete && image.current.naturalWidth));
  }, [src]);
  return (
    <div className={`project-media media-${kind}`} data-expanded={expanded} data-loaded={loaded || failed} style={{"--media-aspect": width / height}}>
      <div className="media-device" style={{ "--media-ratio": `${width} / ${height}` }}>
        <div className="media-placeholder" aria-hidden="true" style={{backgroundImage: `url("${projectPlaceholders[src] || ""}")`}} />
        {kind === "browser" && <div className="media-browser-bar" aria-hidden="true"><i/><i/><i/><span/></div>}
        {failed ? <p className="media-unavailable">{language === "ar" ? "الصورة غير متاحة حاليًا" : "Screenshot currently unavailable"}</p> :
          <img ref={image} src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />}
      </div>
    </div>
  );
}

export function ProjectGallery({ project }) {
  const { tr, language } = useLanguage();
  const [selected, setSelected] = useState(0);
  const shots = project.gallery;
  const current = shots[selected];
  return (
    <section className="project-gallery" aria-label={tr("Real project screenshots")}>
      <figure className="gallery-primary">
        <a href={current.src} target="_blank" rel="noopener noreferrer" aria-label={`${tr("Open screenshot")} — ${tr(current.caption)}`}>
          <ProjectMedia key={current.src} src={current.src} alt={tr(current.caption)} expanded />
        </a>
        <figcaption aria-live="polite">{tr(current.caption)} <span dir="ltr">{selected + 1} / {shots.length}</span></figcaption>
      </figure>
      <div className="gallery-thumbnails" role="group" aria-label={tr("Real project screenshots")}>
        {shots.map((shot, index) => {
          const {width, height} = projectMedia(shot.src);
          return <button key={shot.src} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>
            <img src={shot.src} alt="" width={width} height={height} loading="lazy" decoding="async" />
            <span>{tr(shot.caption)}</span>
          </button>;
        })}
      </div>
      <p className="gallery-hint">{language === "ar" ? "اختر صورة لمعاينتها، أو افتح الصورة الرئيسية بحجمها الأصلي." : "Select a preview, or open the main screenshot at its original size."}</p>
    </section>
  );
}
