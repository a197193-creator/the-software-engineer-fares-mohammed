// Clamp after interpolation too: fast scrolling must not carry the image into controls.
export function stopBeforeFooter(preferredTop, avatarHeight, footerTop, gap = 32) {
  return Math.min(preferredTop, footerTop - avatarHeight - gap);
}

// Suspend the presentation when a full-width reading surface leaves no safe
// space below the header. Dialogue and the visitor's preference stay intact.
export function placeGuide(
  preferredTop, height, boundary, minTop = 96, gap = 32, minHeight = 150,
) {
  const space = boundary - minTop - gap;
  const fittedHeight = Math.min(height, Math.max(minHeight, space));
  return {
    visible: space >= minHeight,
    height: fittedHeight,
    top: Math.max(minTop, stopBeforeFooter(preferredTop, fittedHeight, boundary, gap)),
  };
}
