// Clamp after interpolation too: fast scrolling must not carry the image into controls.
export function stopBeforeFooter(preferredTop, avatarHeight, footerTop, gap = 32) {
  return Math.min(preferredTop, footerTop - avatarHeight - gap);
}
