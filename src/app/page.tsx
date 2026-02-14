import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-between bg-cream text-charcoal">
      {/* Decorative top border — diagonal candy-stripe bar */}
      <div
        className="h-2 w-full"
        style={{
          background:
            "repeating-linear-gradient(135deg, #2A2A2A 0px, #2A2A2A 6px, #F5F0E8 6px, #F5F0E8 12px)",
        }}
      />

      {/* Main content — vertically and horizontally centered */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        {/* Decorative floral element */}
        <div className="mb-8 flex items-center gap-3" aria-hidden="true">
          <span className="block h-px w-10 bg-charcoal/30 sm:w-16" />
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            className="text-charcoal/60"
          >
            {/* Simple stylized flower: five petals around a center */}
            <ellipse
              cx="14"
              cy="8"
              rx="3.5"
              ry="6"
              fill="currentColor"
              opacity="0.25"
            />
            <ellipse
              cx="14"
              cy="20"
              rx="3.5"
              ry="6"
              fill="currentColor"
              opacity="0.25"
            />
            <ellipse
              cx="8"
              cy="14"
              rx="6"
              ry="3.5"
              fill="currentColor"
              opacity="0.25"
            />
            <ellipse
              cx="20"
              cy="14"
              rx="6"
              ry="3.5"
              fill="currentColor"
              opacity="0.25"
            />
            <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.45" />
          </svg>
          <span className="block h-px w-10 bg-charcoal/30 sm:w-16" />
        </div>

        {/* Logo */}
        <h1 className="font-display text-6xl leading-tight tracking-tight sm:text-7xl md:text-8xl">
          Bouqueto
        </h1>

        {/* Tagline */}
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.35em] sm:text-xs sm:tracking-[0.4em]">
          Beautiful Flowers, Delivered Digitally
        </p>

        {/* CTAs */}
        <div className="mt-14 flex w-full max-w-xs flex-col items-center gap-4 sm:mt-16">
          {/* Primary CTA */}
          <Link
            href="/bouquet"
            className="block w-full bg-charcoal py-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-cream transition-opacity duration-200 hover:opacity-80"
          >
            Build a Bouquet
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/bouquet"
            className="block w-full border-2 border-charcoal bg-transparent py-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-charcoal transition-colors duration-200 hover:bg-charcoal hover:text-cream"
          >
            Build It in Black &amp; White
          </Link>
        </div>

        {/* View Garden link */}
        <Link
          href="/garden"
          className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-charcoal underline underline-offset-4 transition-opacity duration-200 hover:opacity-60"
        >
          View Garden
        </Link>
      </main>

      {/* Footer */}
      <footer className="pb-6 pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal/50">
          Made by @pankajbeniwal
        </p>
      </footer>
    </div>
  );
}
