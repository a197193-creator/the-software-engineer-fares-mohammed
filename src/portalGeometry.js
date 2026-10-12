// ## PORTAL GEOMETRY — measured once at selection, transforms during playback.
export function portalGeometry(rect, viewport) {
  const width = Math.max(1, Number(viewport.width) || 1);
  const height = Math.max(1, Number(viewport.height) || 1);
  const valid = rect && [rect.left, rect.top, rect.width, rect.height].every(Number.isFinite)
    && rect.width > 0 && rect.height > 0;
  const fallback = Math.max(44, Math.min(220, Math.min(width, height) * .22));
  const source = valid ? rect : {
    left: (width - fallback) / 2, top: (height - fallback) / 2,
    width: fallback, height: fallback,
  };
  return {
    left: source.left, top: source.top,
    width: source.width, height: source.height,
    x: width / 2 - (source.left + source.width / 2),
    y: height / 2 - (source.top + source.height / 2),
    // The authored globe occupies 73% of its SVG canvas. Cover every corner.
    scale: Math.max(1, Math.hypot(width, height) / (Math.min(source.width, source.height) * .73) * 1.08),
  };
}
