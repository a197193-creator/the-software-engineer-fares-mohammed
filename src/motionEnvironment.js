// One set of environment listeners for all magnetic surfaces and project cards.
const subscribers = new Set();
let disconnect;
export function subscribeMotionEnvironment(callback) {
  subscribers.add(callback);
  if (!disconnect) {
    const notify = (event) =>
      subscribers.forEach((subscriber) => subscriber(event.type));
    const events = [
      [window, "scroll"],
      [window, "resize"],
      [window, "blur"],
      [document, "visibilitychange"],
    ];
    events.forEach(([target, event]) =>
      target.addEventListener(event, notify, { passive: true }),
    );
    disconnect = () =>
      events.forEach(([target, event]) =>
        target.removeEventListener(event, notify),
      );
  }
  return () => {
    subscribers.delete(callback);
    if (!subscribers.size) {
      disconnect();
      disconnect = undefined;
    }
  };
}
