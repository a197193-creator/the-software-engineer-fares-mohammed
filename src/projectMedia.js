// Intrinsic dimensions measured from the supplied originals, never guessed.
const dimensions = {
  "diacare-dashboard": [362, 1080],
  "diacare-chat": [540, 1200],
  "diacare-meals": [540, 1200],
  "diacare-education": [540, 1200],
  "tmc-research-home": [1265, 712],
  "tmc-research-index": [1265, 712],
  "tmc-research-publications": [1265, 712],
  "uwc-home": [1265, 712],
  "uwc-packages": [1265, 712],
  "uwc-plan": [1101, 884],
  "tmc-official-home": [1265, 712],
  "tmc-official-news": [1265, 712],
  "tmc-official-participants": [1265, 712],
};
export function projectMedia(src) {
  const key = src?.split("/").pop()?.replace(/\.[^.]+$/, "");
  const [width, height] = dimensions[key] || [1265, 712];
  return { width, height, kind: key === "uwc-plan" ? "document" : height > width ? "phone" : "browser" };
}
export const featuredProjectId = "diacare";
