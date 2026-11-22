'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { techSlides } from '@/lib/content';
import { Icon } from './Icon';

// Scroll-snap carousel: auto-advances, pauses on hover/focus, honours reduced motion.
export function TechCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.slide');
    const w = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else el.scrollBy({ left: dir * w, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => step(1), 3800);
    return () => clearInterval(t);
  }, [paused, step]);

  return (
    <div className="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="carousel-track" ref={track} role="region" aria-roledescription="carousel" aria-label="AI and technology" tabIndex={0}>
        {techSlides.map((s, i) => (
          <figure key={s.image} className="slide media-card" aria-roledescription="slide" aria-label={`${i + 1} of ${techSlides.length}: ${s.title}`}>
            <span className="media"><img src={s.image} alt={s.title} loading="lazy" /></span>
            <figcaption>
              <strong>{s.title}</strong>
              <span>{s.text}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="carousel-controls">
        <button className="carousel-btn" onClick={() => step(-1)} aria-label="Previous slide"><Icon name="left" /></button>
        <button className="carousel-btn" onClick={() => step(1)} aria-label="Next slide"><Icon name="right" /></button>
      </div>
    </div>
  );
}
