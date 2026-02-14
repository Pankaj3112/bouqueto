"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import BouquetComposition from "@/components/BouquetComposition";
import type { ArrangementItem } from "@/lib/arrangement";

/**
 * A single gallery card that reconstructs and renders a saved bouquet
 * at thumbnail size, with a message preview and click-through link.
 */
function BouquetCard({
  bouquet,
}: {
  bouquet: {
    _id: string;
    arrangement: { flowerId: string; order: number; rotation: number }[];
    greeneryStyle: string;
    cardMessage: string;
    createdAt: number;
  };
}) {
  // Reconstruct arrangement from saved data
  const arrangement: ArrangementItem[] = bouquet.arrangement.map((item) => ({
    flowerId: item.flowerId,
    order: item.order,
    rotation: item.rotation,
  }));

  return (
    <Link
      href={`/bouquet/${bouquet._id}`}
      className="group block"
    >
      <div className="relative border border-charcoal/10 bg-white p-3 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(42,42,42,0.15)]">
        {/* Double-frame inner border */}
        <div className="border border-charcoal/[0.06] p-2">
          {/* Bouquet preview — constrained to a small square */}
          <div className="pointer-events-none relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden">
            <BouquetComposition arrangement={arrangement} greeneryStyle={bouquet.greeneryStyle} />
          </div>

        </div>

        {/* Subtle corner accent on hover */}
        <div
          className="pointer-events-none absolute top-0 right-0 h-4 w-4 border-t border-r border-charcoal/0 transition-all duration-300 group-hover:border-charcoal/20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-4 w-4 border-b border-l border-charcoal/0 transition-all duration-300 group-hover:border-charcoal/20"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

export default function GardenPage() {
  const bouquets = useQuery(api.bouquets.listRecent, { limit: 20 });

  return (
    <main className="min-h-screen bg-cream">
      {/* Decorative top border — diagonal candy-stripe bar (matches home page) */}
      <div
        className="h-2 w-full"
        style={{
          background:
            "repeating-linear-gradient(135deg, #2A2A2A 0px, #2A2A2A 6px, #F5F0E8 6px, #F5F0E8 12px)",
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        {/* Header */}
        <header className="mb-12 text-center sm:mb-16">
          {/* Logo link */}
          <Link
            href="/"
            className="inline-block font-display text-3xl tracking-tight text-charcoal transition-opacity duration-200 hover:opacity-60 sm:text-4xl"
          >
            Bouqueto
          </Link>

          {/* Decorative divider */}
          <div
            className="mx-auto mt-6 mb-6 flex items-center justify-center gap-3"
            aria-hidden="true"
          >
            <span className="block h-px w-8 bg-charcoal/20 sm:w-12" />
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="text-charcoal/25"
            >
              <path
                d="M6 0 L7.5 4.5 L12 6 L7.5 7.5 L6 12 L4.5 7.5 L0 6 L4.5 4.5 Z"
                fill="currentColor"
              />
            </svg>
            <span className="block h-px w-8 bg-charcoal/20 sm:w-12" />
          </div>

          {/* Page heading */}
          <h1 className="font-mono text-xs uppercase tracking-[0.4em] text-charcoal sm:text-sm sm:tracking-[0.5em]">
            Garden
          </h1>
          <p className="mt-3 font-display text-base italic text-charcoal/50 sm:text-lg">
            Recent bouquets from around the world
          </p>
        </header>

        {/* Loading state */}
        {bouquets === undefined && (
          <div className="flex items-center justify-center py-24">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-charcoal/50">
              Loading...
            </p>
          </div>
        )}

        {/* Empty state */}
        {bouquets !== undefined && bouquets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {/* Decorative empty flower */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 28 28"
              fill="none"
              className="mb-6 text-charcoal/15"
            >
              <ellipse cx="14" cy="8" rx="3.5" ry="6" fill="currentColor" opacity="0.3" />
              <ellipse cx="14" cy="20" rx="3.5" ry="6" fill="currentColor" opacity="0.3" />
              <ellipse cx="8" cy="14" rx="6" ry="3.5" fill="currentColor" opacity="0.3" />
              <ellipse cx="20" cy="14" rx="6" ry="3.5" fill="currentColor" opacity="0.3" />
              <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.4" />
            </svg>

            <p className="font-display text-xl italic text-charcoal sm:text-2xl">
              No bouquets yet
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/40">
              Be the first to build one
            </p>
            <Link
              href="/bouquet"
              className="mt-8 inline-block bg-charcoal px-8 py-4 font-mono text-xs uppercase tracking-[0.3em] text-cream transition-opacity duration-200 hover:opacity-80"
            >
              Build a Bouquet
            </Link>
          </div>
        )}

        {/* Bouquet grid */}
        {bouquets !== undefined && bouquets.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {bouquets.map((bouquet) => (
              <BouquetCard key={bouquet._id} bouquet={bouquet} />
            ))}
          </div>
        )}

        {/* Footer navigation */}
        <div className="mt-16 flex flex-col items-center gap-6 sm:mt-20">
          {/* Divider */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="block h-px w-12 bg-charcoal/10 sm:w-20" />
            <span className="block h-1 w-1 rounded-full bg-charcoal/20" />
            <span className="block h-px w-12 bg-charcoal/10 sm:w-20" />
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-[0.3em] text-charcoal underline decoration-charcoal/30 underline-offset-4 transition-colors duration-200 hover:decoration-charcoal/60"
            >
              Home
            </Link>
            <span className="block h-3 w-px bg-charcoal/15" aria-hidden="true" />
            <Link
              href="/bouquet"
              className="font-mono text-xs uppercase tracking-[0.3em] text-charcoal underline decoration-charcoal/30 underline-offset-4 transition-colors duration-200 hover:decoration-charcoal/60"
            >
              Build a Bouquet
            </Link>
          </div>

          {/* Footer credit */}
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal/30">
            Made by <a href="https://github.com/Pankaj3112" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-opacity duration-200 hover:opacity-60">@pankajbeniwal</a>
          </p>
        </div>
      </div>
    </main>
  );
}
