// One owner for navigation while Lenis is active; native scrolling otherwise.
let controller;
export function registerScrollController(instance) {
  controller = instance;
  return () => { if (controller === instance) controller = undefined; };
}
export function navigateSection(id, { smooth = true } = {}) {
  const target = document.getElementById(id);
  if (!target) return;
  if (controller) {
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    controller.scrollTo(target, { offset: -padding - margin, immediate: !smooth, force: true });
  } else target.scrollIntoView({ behavior: smooth ? "smooth" : "instant", block: "start" });
}
