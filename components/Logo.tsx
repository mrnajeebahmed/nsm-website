import Link from 'next/link';
import { useId } from 'react';

/** NSM brand mark: a network-node "N" on a deep navy tile. */
export function LogoMark({ size = 40 }: { size?: number }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="logo-svg">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="#0B1B3F" />
      <path d="M11.5 28.5V11.5L28.5 28.5V11.5" fill="none" stroke={`url(#g${id})`} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11.5" cy="11.5" r="2.8" fill="#fff" />
      <circle cx="28.5" cy="28.5" r="2.8" fill="#fff" />
      <circle cx="11.5" cy="28.5" r="2" fill="#5EEAD4" />
      <circle cx="28.5" cy="11.5" r="2" fill="#93C5FD" />
    </svg>
  );
}

export function Logo({ tone = 'dark', href = '/' }: { tone?: 'dark' | 'light'; href?: string }) {
  return (
    <Link href={href} className={`brand brand-${tone}`} aria-label="NSM Technologies home">
      <LogoMark />
      <span className="brand-text">
        <span className="brand-name">NSM</span>
        <span className="brand-sub">TECHNOLOGIES</span>
      </span>
    </Link>
  );
}
