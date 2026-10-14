import {
  Children,
  Fragment,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../LanguageContext";
import { useMotionSettings } from "./MotionSettings";

gsap.registerPlugin(ScrollTrigger);
const StoryMotion = createContext({ motion: false, ready: false });

export function StoryMain({ motion, ready, children }) {
  const value = useMemo(() => ({ motion, ready }), [motion, ready]);
  return (
    <StoryMotion.Provider value={value}>
      <main>{children}</main>
    </StoryMotion.Provider>
  );
}

export function useStoryMotion() {
  return useContext(StoryMotion);
}

function plainText(children) {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return child;
      if (!isValidElement(child)) return "";
      return child.type === "br" ? " " : plainText(child.props.children);
    })
    .join("");
}

function linesOf(children) {
  const lines = [[]];
  function visit(nodes) {
    Children.forEach(nodes, (child) => {
      if (isValidElement(child) && child.type === Fragment) {
        visit(child.props.children);
      } else if (isValidElement(child) && child.type === "br") {
        lines.push([]);
      } else {
        lines.at(-1).push(child);
      }
    });
  }
  visit(children);
  return lines;
}

function wordsOf(children, highlighted = false) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      // Whole words retain Arabic joining, marks and punctuation. Keep real spaces.
      return String(child)
        .split(/(\s+)/u)
        .map((word, index) =>
          !word || /^\s+$/u.test(word) ? (
            word
          ) : (
            <span className="story-word-mask" key={index}>
              <span
                className="story-word"
                data-story-highlight={highlighted || undefined}
              >
                {word}
              </span>
            </span>
          ),
        );
    }
    if (!isValidElement(child) || !child.props.children) return child;
    const accent =
      highlighted ||
      /accent-text|muted-text|serif/u.test(child.props.className || "");
    return cloneElement(child, {}, wordsOf(child.props.children, accent));
  });
}

function useStoryEntrance(root, text, delay, heading) {
  const { motion, ready } = useStoryMotion();
  const { language } = useLanguage();
  const { config } = useMotionSettings();
  useLayoutEffect(() => {
    if (!motion || !ready) return;
    const element = root.current;
    const context = gsap.context(() => {
      const targets = heading
        ? [...element.querySelectorAll(".story-word")]
        : [element];
      const sequence = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
        onStart: () => element.classList.add("story-running"),
        onComplete: () => element.classList.remove("story-running"),
      });
      sequence.fromTo(
        targets,
        {
          yPercent: heading ? config.wordRise : 0,
          y: heading ? 0 : config.revealDistance * 0.5,
          opacity: 0,
          scale: (index, node) => (node.dataset.storyHighlight ? (config.level === "cinematic" ? .94 : .97) : 1),
        },
        {
          yPercent: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: heading && config.level !== "subtle" ? config.reveal + .15 : config.reveal,
          ease: config.ease,
          stagger: heading
            ? { amount: Math.min(0.36, targets.length * config.stagger) }
            : 0,
        },
        delay,
      );
      // Initialize before other triggers are created, including resume below the fold.
      sequence.scrollTrigger.refresh();
    }, element);
    return () => {
      context.revert();
      element.classList.remove("story-running");
    };
  }, [motion, ready, language, text, delay, heading, root, config]);
}

export function StoryHeading({
  as: Tag = "h2",
  children,
  className = "",
  delay = 0,
  ...props
}) {
  const root = useRef(null);
  const text = plainText(children).replace(/\s+/gu, " ").trim();
  useStoryEntrance(root, text, delay, true);
  return (
    <Tag
      {...props}
      ref={root}
      className={`story-heading ${className}`}
      data-story-heading
      aria-label={text}
    >
      <span className="story-heading-visual" aria-hidden="true">
        {linesOf(children).map((line, index) => (
          <span className="story-line" key={index}>
            {wordsOf(line)}
          </span>
        ))}
      </span>
    </Tag>
  );
}

export function StoryStatement({ children, className = "", delay = 0.18 }) {
  const root = useRef(null);
  useStoryEntrance(root, plainText(children), delay, false);
  return (
    <p ref={root} className={`story-statement ${className}`} data-story-copy>
      {children}
    </p>
  );
}
