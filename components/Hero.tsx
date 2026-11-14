import Link from "next/link";
import { Icon } from "./Icon";

const HIGHLIGHTS = ["Free to start", "No sign-up needed", "Bio generator runs in your browser"];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-page relative py-20 text-center sm:py-28">
        <p className="mx-auto inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
          <Icon name="sparkles" size={14} className="text-violet-400" />
          Creator toolkit for India and international creators
        </p>
        <h1 className="mx-auto mt-6 max-w-3xl animate-fade-up text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl [animation-delay:80ms]">
          Create More. <span className="gradient-text">Grow Faster.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl animate-fade-up text-lg text-slate-400 [animation-delay:160ms]">
          Free tools that remove the busywork from content creation, starting with a bio generator for Instagram.
        </p>
        <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row [animation-delay:240ms]">
          <Link href="/tools/instagram-bio-generator" className="btn-primary w-full sm:w-auto">
            Try the Bio Generator <Icon name="arrow-right" size={16} />
          </Link>
          <Link href="/tools" className="btn-secondary w-full sm:w-auto">
            Explore all tools
          </Link>
        </div>
        <ul className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 [animation-delay:320ms]">
          {HIGHLIGHTS.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Icon name="check" size={14} className="text-electric-400" /> {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
