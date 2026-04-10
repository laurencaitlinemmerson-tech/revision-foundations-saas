"use client";

import { useEffect } from "react";

export default function AutoAnimate() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      "section, header, main, footer, .card, .badge, h1, h2, h3, p, a.btn-primary, a.btn-secondary, button.btn-primary, button.btn-secondary"
    );

    targets.forEach((el) => {
      if (el.dataset.aa === "1") return;
      el.dataset.aa = "1";
      el.classList.add("rf-reveal");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("rf-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
