export const motionTokens = {
  fast: 0.18,
  interaction: 0.26,
  reveal: 0.65,
  poseEnter: 0.55,
  poseExit: 0.38,
  cycle: 8,
  ease: "power3.out",
  cssEase: "cubic-bezier(0.2, 0.7, 0.3, 1)",
};

export const motionPresets = {
  subtle: {
    hoverScale: 1.01,
    cardScale: 1.005,
    float: 0,
    revealDistance: 10,
    wordRise: 0,
    stagger: 0.025,
    avatarFactor: 0,
    particles: 0,
    glow: 0.45,
  },
  balanced: {
    hoverScale: 1.018,
    cardScale: 1.01,
    float: 2,
    revealDistance: 18,
    wordRise: 80,
    stagger: 0.04,
    avatarFactor: 0.6,
    particles: 4,
    glow: 0.7,
  },
  cinematic: {
    hoverScale: 1.035,
    cardScale: 1.02,
    float: 5,
    revealDistance: 32,
    wordRise: 105,
    stagger: 0.045,
    avatarFactor: 1,
    particles: 6,
    glow: 1.15,
  },
};

export function motionVariables(config) {
  return {
    "--motion-fast": `${config.fast}s`,
    "--motion-interaction": `${config.interaction}s`,
    "--motion-reveal": `${config.reveal}s`,
    "--motion-cycle": `${config.cycle}s`,
    "--motion-ease": config.cssEase,
    "--motion-hover-scale": config.hoverScale,
    "--motion-card-scale": config.cardScale,
    "--motion-float": `${config.float}px`,
    "--motion-glow": config.glow,
    "--motion-breath-scale": config.avatarFactor * 0.003,
  };
}
