'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '@/lib/content';
import { menus, type Menu } from '@/lib/navigation';
import { Icon } from './Icon';
import { Logo } from './Logo';

function MegaPanel({ menu, onNavigate }: { menu: Menu; onNavigate: () => void }) {
  return (
    <div className="mega-inner container">
      <div className="mega-overview">
        <div className="eyebrow">{menu.label}</div>
        <Link href={menu.overview.href} className="mega-overview-link" onClick={onNavigate}>
          {menu.overview.title} <Icon name="arrow" size={18} />
        </Link>
        <p>{menu.overview.text}</p>
      </div>
      {menu.columns.map((col) => (
        <div key={col.heading} className="mega-col">
          <div className="mega-heading">{col.heading}</div>
          <ul>
            {col.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="mega-link" onClick={onNavigate}>
                  {l.icon && <span className="mega-icon"><Icon name={l.icon} size={18} /></span>}
                  <span>
                    <strong>{l.label}</strong>
                    {l.desc && <small>{l.desc}</small>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <Link href={menu.feature.href} className="mega-feature media-card" onClick={onNavigate}>
        <span className="media"><img src={menu.feature.image} alt="" loading="lazy" /></span>
        <span className="mega-feature-body">
          <span className="tag blue">{menu.feature.eyebrow}</span>
          <strong>{menu.feature.title}</strong>
          <span className="mega-feature-cta">{menu.feature.cta} <Icon name="arrow" size={16} /></span>
        </span>
      </Link>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const close = useCallback(() => { setOpen(null); setMobile(false); }, []);
  useEffect(() => close(), [pathname, close]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (open) document.getElementById(`mega-trigger-${open}`)?.focus();
      close();
    };
    const onClick = (e: MouseEvent) => { if (!headerRef.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, [open, close]);

  const hoverOpen = (id: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setOpen(id); };
  const hoverClose = () => { closeTimer.current = setTimeout(() => setOpen(null), 180); };
  // Active when on the menu's overview page or a page it links to directly (anchor links don't count).
  const active = (m: Menu) => [m.overview.href, ...m.columns.flatMap((c) => c.links.map((l) => l.href)).filter((h) => !h.includes('#'))]
    .map((h) => h.split(/[?#]/)[0]).some((h) => h !== '/' && pathname.startsWith(h));

  return (
    <header className={`site-header ${open ? 'menu-open' : ''}`} ref={headerRef} onMouseLeave={hoverClose}>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>AI strategy · Workflow automation · AI agents · Systems integration</span>
          <span className="topbar-links">
            <a href={`mailto:${site.email}`}><Icon name="mail" size={14} /> {site.email}</a>
            <Link href="/contact">Book a strategy call <Icon name="arrow" size={14} /></Link>
          </span>
        </div>
      </div>
      <div className="container header-inner">
        <Logo />
        <nav className="mega-nav" aria-label="Main">
          <ul>
            {menus.map((m) => (
              <li key={m.id} onMouseEnter={() => hoverOpen(m.id)}>
                <button id={`mega-trigger-${m.id}`} className={`mega-trigger ${active(m) ? 'is-active' : ''}`}
                  aria-expanded={open === m.id} aria-controls={`mega-${m.id}`}
                  onClick={() => setOpen(open === m.id ? null : m.id)}>
                  {m.label} <Icon name="chevron" size={16} />
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          <Link href="/contact" className="btn btn-secondary btn-sm header-contact">Contact</Link>
          <Link href="/assess" className="btn btn-primary btn-sm">Assess Your Business</Link>
        </div>
        <button className="menu-btn" aria-label="Toggle menu" aria-expanded={mobile} onClick={() => setMobile((v) => !v)}>
          <Icon name={mobile ? 'x' : 'menu'} />
        </button>
      </div>

      {menus.map((m) => (
        <div key={m.id} id={`mega-${m.id}`} className={`mega-panel ${open === m.id ? 'open' : ''}`}
          onMouseEnter={() => hoverOpen(m.id)} hidden={open !== m.id}>
          <MegaPanel menu={m} onNavigate={close} />
        </div>
      ))}

      {mobile && (
        <nav className="mobile-nav" aria-label="Mobile">
          {menus.map((m) => (
            <div key={m.id} className="mobile-group">
              <button className="mobile-trigger" aria-expanded={mobileSection === m.id} onClick={() => setMobileSection(mobileSection === m.id ? null : m.id)}>
                {m.label} <Icon name="chevron" size={18} />
              </button>
              {mobileSection === m.id && (
                <ul>
                  <li><Link href={m.overview.href} onClick={close}><strong>{m.overview.title}</strong></Link></li>
                  {m.columns.flatMap((c) => c.links).map((l) => <li key={l.href}><Link href={l.href} onClick={close}>{l.label}</Link></li>)}
                </ul>
              )}
            </div>
          ))}
          <Link href="/assess" className="btn btn-primary" onClick={close}>Assess Your Business</Link>
        </nav>
      )}
    </header>
  );
}
