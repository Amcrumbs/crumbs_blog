"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import "./CardNav.css";

type CardNavLink = {
  href: string;
  label: string;
  active?: boolean;
  ariaLabel?: string;
};

type CardNavItem = {
  label: string;
  links: CardNavLink[];
  bgColor: string;
  textColor: string;
};

export function CardNav({
  brand,
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor,
  buttonBgColor,
  buttonTextColor,
  ctaHref,
  ctaLabel,
}: {
  brand: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  const pathname = usePathname();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const hasMountedRef = useRef(false);

  const calculateHeight = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector<HTMLElement>(".card-nav-content");
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }

    return 260;
  }, []);

  const createTimeline = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, "-=0.1");

    return tl;
  }, [calculateHeight, ease]);

  const resetMenu = useCallback(() => {
    const tl = tlRef.current;
    tl?.pause(0);
    tl?.eventCallback("onReverseComplete", null);

    setIsHamburgerOpen(false);
    setIsExpanded(false);

    if (navRef.current) {
      gsap.set(navRef.current, { height: 60, overflow: "hidden" });
    }

    gsap.set(cardsRef.current, { y: 50, opacity: 0 });
  }, []);

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [createTimeline, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateHeight, createTimeline, isExpanded]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    resetMenu();
  }, [pathname, resetMenu]);

  const closeMenu = () => {
    const tl = tlRef.current;
    if (!tl || !isExpanded) return;

    setIsHamburgerOpen(false);
    tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
    tl.reverse();
  };

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      closeMenu();
    }
  };

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    cardsRef.current[index] = el;
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav ref={navRef} className={`card-nav ${isExpanded ? "open" : ""}`} style={{ backgroundColor: baseColor }}>
        <div className="card-nav-top">
          <button
            type="button"
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label={isExpanded ? "关闭导航菜单" : "打开导航菜单"}
            aria-expanded={isExpanded}
            style={{ color: menuColor || "#000" }}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          <Link href="/" className="logo-container" onClick={closeMenu}>
            <span className="logo">{brand}</span>
          </Link>

          <Link
            href={ctaHref}
            className="card-nav-cta-button"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            onClick={closeMenu}
          >
            {ctaLabel}
          </Link>
        </div>

        <div className="card-nav-content" aria-hidden={!isExpanded}>
          {items.slice(0, 3).map((item, index) => (
            <div
              key={item.label}
              className="nav-card"
              ref={setCardRef(index)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {item.links.map((link) => (
                  <Link
                    key={link.href}
                    className={`nav-card-link ${link.active ? "active" : ""}`}
                    href={link.href}
                    aria-label={link.ariaLabel}
                    onClick={closeMenu}
                  >
                    <ArrowUpRight className="nav-card-link-icon" aria-hidden="true" size={16} />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
