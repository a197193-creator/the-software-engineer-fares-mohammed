// SVG sphere radius is 73% of its box radius. Cover all corners after centering.
export function portalGeometry(origin, width, height) {
  const size = Math.max(1, origin.width);
  return {
    x: width / 2 - (origin.left + size / 2),
    y: height / 2 - (origin.top + origin.height / 2),
    scale: Math.hypot(width, height) / (size * .73) * 1.08,
  };
}
