"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

function renderChar(char: string, group: "title" | "subtitle", index: number) {
  return (
    <span
      key={`${group}-${index}-${char}`}
      data-home-hero-char={group}
      className="home-hero-char"
      aria-hidden="true"
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );
}

function renderChars(text: string, group: "title" | "subtitle") {
  const segments = text.match(/[A-Za-z0-9'’-]+|\s+|./g) ?? [];
  let charIndex = 0;

  return segments.map((segment, segmentIndex) => {
    if (/^\s+$/.test(segment)) {
      return (
        <span key={`${group}-space-${segmentIndex}`} className="home-hero-space" aria-hidden="true">
          {segment.replace(/ /g, "\u00A0")}
        </span>
      );
    }

    if (/^[A-Za-z0-9'’-]+$/.test(segment)) {
      return (
        <span key={`${group}-word-${segmentIndex}`} className="home-hero-word">
          {Array.from(segment).map((char) => {
            const currentIndex = charIndex;
            charIndex += 1;
            return renderChar(char, group, currentIndex);
          })}
        </span>
      );
    }

    const currentIndex = charIndex;
    charIndex += 1;

    return renderChar(segment, group, currentIndex);
  });
}

export function HomeHero({
  greeting,
  prompt,
}: {
  greeting: string;
  prompt: string;
}) {
  const containerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const context = gsap.context(() => {
      const titleChars = gsap.utils.toArray<HTMLElement>("[data-home-hero-char='title']");
      const subtitleChars = gsap.utils.toArray<HTMLElement>("[data-home-hero-char='subtitle']");
      const hint = container.querySelector<HTMLElement>("[data-home-hero-hint]");

      gsap.set([...titleChars, ...subtitleChars], {
        yPercent: 120,
        opacity: 0,
        scale: 0.35,
        rotate: -8,
        transformOrigin: "50% 100%",
        filter: "blur(8px)",
      });

      if (hint) {
        gsap.set(hint, {
          y: 28,
          opacity: 0,
        });
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.to(titleChars, {
        yPercent: 0,
        opacity: 1,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
        duration: 1.45,
        stagger: {
          each: 0.035,
          from: "start",
        },
        ease: "elastic.out(1, 0.72)",
      });

      timeline.to(
        subtitleChars,
        {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          rotate: 0,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: {
            each: 0.02,
            from: "start",
          },
          ease: "elastic.out(1, 0.85)",
        },
        "-=0.88",
      );

      timeline.fromTo(
        container.querySelector(".home-hero-glow"),
        {
          opacity: 0,
          scaleX: 0.72,
        },
        {
          opacity: 1,
          scaleX: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        0.1,
      );

      if (hint) {
        timeline.to(
          hint,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
          },
          "-=0.34",
        );

        timeline.to(
          hint,
          {
            y: 8,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          },
          ">-0.08",
        );
      }
    }, container);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="home-hero relative flex min-h-[calc(100vh-9rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-10"
    >
      <div className="home-hero-glow" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="home-hero-title-clip">
          <h1
            className="home-hero-title text-[clamp(3rem,9vw,7rem)] text-[var(--text)]"
            aria-label={greeting}
          >
            {renderChars(greeting, "title")}
          </h1>
        </div>
        <div className="home-hero-subtitle-clip mt-4 sm:mt-6">
          <p
            className="home-hero-subtitle text-[clamp(1.15rem,2.8vw,2rem)] text-[var(--muted)]"
            aria-label={prompt}
          >
            {renderChars(prompt, "subtitle")}
          </p>
        </div>
        <p
          data-home-hero-hint
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2 text-sm tracking-[0.04em] text-[var(--muted)] shadow-[var(--shadow-soft)] sm:mt-12"
        >
          <span className="h-2 w-2 rounded-full bg-[var(--text)]" aria-hidden="true" />
          PUBLIC INDEX ONLINE
        </p>
      </div>
    </section>
  );
}
