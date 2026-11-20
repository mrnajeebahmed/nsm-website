import type { SVGProps } from 'react';

const paths: Record<string, string> = {
  compass: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm4.2-14.2-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1Z',
  flow: 'M4 6h6v4H4zM14 14h6v4h-6zM7 10v3a2 2 0 0 0 2 2h5M17 14v-3a2 2 0 0 0-2-2h-5',
  brain: 'M9 4a3 3 0 0 0-3 3v.2A3 3 0 0 0 4 10a3 3 0 0 0 1 5.2V16a3 3 0 0 0 4 2.8V4.2A3 3 0 0 0 9 4Zm6 0a3 3 0 0 1 3 3v.2A3 3 0 0 1 20 10a3 3 0 0 1-1 5.2V16a3 3 0 0 1-4 2.8V4.2A3 3 0 0 1 15 4Z',
  layers: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
  rocket: 'M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2m-1-4 4 4m-2.5-6.5C10 7 14 3 20 4c1 6-3 10-7.5 12.5M14.5 9.5h.01',
  check: 'm5 12 5 5L20 7',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z',
  send: 'm22 2-7 20-4-9-9-4 20-7Z',
  x: 'M18 6 6 18M6 6l12 12',
  menu: 'M4 6h16M4 12h16M4 18h16',
  shield: 'M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z',
  gauge: 'M12 14l4-4M3.3 17a9 9 0 1 1 17.4 0',
  calc: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 4h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6',
  lock: 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4',
  users: 'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 10v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8',
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 22, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d={paths[name]} />
    </svg>
  );
}
