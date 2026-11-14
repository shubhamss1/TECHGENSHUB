"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="TECHGENSHUB home">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-electric-500 text-white shadow-lg shadow-violet-900/40">
            <Icon name="sparkles" size={18} />
          </span>
          <span className="font-display text-base font-bold tracking-[0.18em] text-white">TECHGENSHUB</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                isActive(pathname, item.href) ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/tools" className="btn-primary hidden !py-2 md:inline-flex">
            Try free tools
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-200 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="animate-fade-in border-t border-white/10 bg-navy-950 md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-3 text-base font-medium ${
                  isActive(pathname, item.href) ? "bg-white/10 text-white" : "text-slate-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/tools" className="btn-primary mt-2">
              Try free tools
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
