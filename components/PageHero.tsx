import type { ReactNode } from 'react';

// Dark, image-backed banner used at the top of inner pages.
export function PageHero({ eyebrow, title, lead, image, children, className = '' }: {
  eyebrow: string; title: ReactNode; lead: ReactNode; image: string; children?: ReactNode; className?: string;
}) {
  return (
    <section className={`page-banner ${className}`}>
      <img className="page-banner-img" src={image} alt="" />
      <div className="page-banner-overlay" />
      <div className="container page-banner-inner">
        <div className="eyebrow eyebrow-light">{eyebrow}</div>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        {children}
      </div>
    </section>
  );
}
