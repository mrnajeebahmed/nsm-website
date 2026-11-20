import Link from 'next/link';
export default function NotFound() {
  return (
    <section className="page-hero hero"><div className="container">
      <div className="eyebrow">404</div><h1>Page not found</h1>
      <p className="lead">The page you’re looking for doesn’t exist.</p>
      <Link href="/" className="btn btn-primary">Back to home</Link>
    </div></section>
  );
}
