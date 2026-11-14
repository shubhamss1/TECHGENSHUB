import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-navy-950/60">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-sm font-bold tracking-[0.18em] text-white">TECHGENSHUB</p>
          <p className="mt-1 text-sm text-slate-500">Creator tools for India and the world.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/tools" className="hover:text-white">Tools</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/about" className="hover:text-white">About</Link>
        </nav>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} TECHGENSHUB. All rights reserved.
      </div>
    </footer>
  );
}
