// Keep the existing static digital garden available on constrained devices.
// Unknown hardware capabilities do not disable rendering.
export function canRenderWorld({ motion, level, light, saveData, memory, cores }) {
  return Boolean(motion && level !== "subtle" && !light && !saveData &&
    !(memory > 0 && memory <= 2) && !(cores > 0 && cores <= 2));
}
