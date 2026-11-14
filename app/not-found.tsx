import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page py-32 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-400">404</p>
      <h1 className="mt-2 text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-slate-400">The page you’re looking for doesn’t exist or has moved.</p>
      <Link href="/" className="btn-primary mt-8">
        Back to home
      </Link>
    </section>
  );
}
