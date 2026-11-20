'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav } from '@/lib/content';
import { Icon } from './Icon';

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="NSM Technologies home">
      <span className="logo-mark">NSM</span>
      <span>NSM Technologies<small>AI DIGITAL SOLUTIONS</small></span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={n.pill ? 'pill' : undefined}
              aria-current={pathname.startsWith(n.href) ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
          <Link href="/assess" className="btn btn-primary btn-sm mobile-cta">Assess Your Business</Link>
        </nav>
        <Link href="/assess" className="btn btn-primary btn-sm header-cta">Assess Your Business</Link>
        <button className="menu-btn" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <Icon name={open ? 'x' : 'menu'} />
        </button>
      </div>
    </header>
  );
}
