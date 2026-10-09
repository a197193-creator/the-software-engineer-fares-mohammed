import { useEffect, useMemo, useState } from "react";

// Presentation-only lifecycle: future audio can consume completion/phase separately.
export function useGuideTyping({
  messageKey,
  text,
  motion,
  enabled,
  wasCompleted,
  markCompleted,
}) {
  const words = useMemo(() => text.match(/\S+/gu) || [], [text]);
  const [count, setCount] = useState(() =>
    !motion || wasCompleted(messageKey) ? words.length : 0,
  );
  const complete = () => {
    setCount(words.length);
    markCompleted(messageKey);
  };
  useEffect(() => {
    if (!enabled) return;
    if (!motion || wasCompleted(messageKey)) {
      setCount(words.length);
      return;
    }
    if (count >= words.length) {
      markCompleted(messageKey);
      return;
    }
    const previous = words[count - 1] || "";
    const pause =
      count === 0
        ? 360
        : 95 +
          Math.min(previous.length * 8, 70) +
          (/[.!?؟،,]$/u.test(previous) ? 100 : 0);
    const timer = setTimeout(() => setCount((value) => value + 1), pause);
    return () => clearTimeout(timer);
  }, [count, motion, enabled, words, messageKey, wasCompleted, markCompleted]);
  return {
    words,
    count: motion ? count : words.length,
    typing: motion && count < words.length,
    complete,
  };
}
