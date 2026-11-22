import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
export default function NotFound() {
  return (
    <PageHero image="/images/tech-network.webp" eyebrow="404" title="Page not found" lead="The page you’re looking for doesn’t exist.">
      <div className="btn-row" style={{ marginTop: 24 }}><Link href="/" className="btn btn-primary">Back to home</Link></div>
    </PageHero>
  );
}
