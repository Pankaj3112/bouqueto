"use client";

import Link from "next/link";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import BouquetComposition from "@/components/BouquetComposition";
import type { ArrangementItem } from "@/lib/arrangement";

function BouquetCard({
  bouquet,
  index,
}: {
  bouquet: {
    _id: string;
    arrangement: { flowerId: string; order: number; rotation: number }[];
    greeneryStyle: string;
    cardMessage: string;
    createdAt: number;
  };
  index: number;
}) {
  const arrangement: ArrangementItem[] = bouquet.arrangement.map((item) => ({
    flowerId: item.flowerId,
    order: item.order,
    rotation: item.rotation,
  }));

  const date = new Date(bouquet.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="group opacity-0 animate-[fadeInUp_0.5s_ease_forwards]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative bg-white p-4 shadow-[0_1px_3px_rgba(42,42,42,0.06)] transition-shadow duration-500 hover:shadow-[0_8px_30px_-8px_rgba(42,42,42,0.1)]">
        {/* Outer decorative frame */}
        <div className="border border-charcoal/[0.08] p-2.5">
          {/* Bouquet preview */}
          <div className="pointer-events-none relative mx-auto aspect-square w-full max-w-[260px] overflow-hidden bg-cream/40">
            <BouquetComposition arrangement={arrangement} greeneryStyle={bouquet.greeneryStyle} />
          </div>
        </div>

        {/* Card footer with date */}
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-charcoal/25">
            No. {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-charcoal/25">
            {formattedDate}
          </span>
        </div>

        {/* Corner accents — visible by default, intensify on hover */}
        <div
          className="pointer-events-none absolute top-0 left-0 h-5 w-5 border-t-2 border-l-2 border-charcoal/[0.04] transition-all duration-500 group-hover:border-charcoal/15"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-0 right-0 h-5 w-5 border-t-2 border-r-2 border-charcoal/[0.04] transition-all duration-500 group-hover:border-charcoal/15"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 border-charcoal/[0.04] transition-all duration-500 group-hover:border-charcoal/15"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-charcoal/[0.04] transition-all duration-500 group-hover:border-charcoal/15"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function GardenPage() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.bouquets.listRecent,
    {},
    { initialNumItems: 20 },
  );

  return (
    <>
      {/* Keyframe for card entrance animation */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <main className="relative min-h-screen bg-cream">
        {/* Subtle dot grid background for atmosphere */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #2A2A2A 0.8px, transparent 0.8px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />

        {/* Decorative top border */}
        <div
          className="relative z-10 h-2 w-full"
          style={{
            background:
              "repeating-linear-gradient(135deg, #2A2A2A 0px, #2A2A2A 6px, #F5F0E8 6px, #F5F0E8 12px)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          {/* Header */}
          <header className="mb-14 text-center sm:mb-20">
            {/* Logo link */}
            <Link
              href="/"
              className="inline-block font-display text-3xl tracking-tight text-charcoal transition-opacity duration-200 hover:opacity-60 sm:text-4xl"
            >
              Bouqueto
            </Link>

            {/* Decorative divider */}
            <div
              className="mx-auto mt-8 mb-8 flex items-center justify-center gap-4"
              aria-hidden="true"
            >
              <span className="block h-px w-10 bg-charcoal/15 sm:w-16" />
              <svg
                width="14"
                height="14"
                viewBox="0 0 28 28"
                fill="none"
                className="text-charcoal/20"
              >
                <ellipse cx="14" cy="8" rx="3.5" ry="6" fill="currentColor" opacity="0.4" />
                <ellipse cx="14" cy="20" rx="3.5" ry="6" fill="currentColor" opacity="0.4" />
                <ellipse cx="8" cy="14" rx="6" ry="3.5" fill="currentColor" opacity="0.4" />
                <ellipse cx="20" cy="14" rx="6" ry="3.5" fill="currentColor" opacity="0.4" />
                <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.6" />
              </svg>
              <span className="block h-px w-10 bg-charcoal/15 sm:w-16" />
            </div>

            {/* Page heading */}
            <h1 className="font-mono text-xs uppercase tracking-[0.4em] text-charcoal sm:text-sm sm:tracking-[0.5em]">
              Garden
            </h1>
            <p className="mt-3 font-display text-base italic text-charcoal/45 sm:text-lg">
              Recent bouquets from around the world
            </p>

            {/* Bouquet count badge */}
            {results.length > 0 && (
              <div className="mt-6 inline-flex items-center gap-2 border border-charcoal/[0.08] px-4 py-1.5">
                <span className="block h-1.5 w-1.5 rounded-full bg-charcoal/20" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal/35">
                  {results.length} {results.length === 1 ? "Bouquet" : "Bouquets"}
                </span>
              </div>
            )}
          </header>

          {/* Loading state */}
          {status === "LoadingFirstPage" && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="mb-6 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-charcoal/20 animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal/40">
                Gathering bouquets...
              </p>
            </div>
          )}

          {/* Empty state */}
          {status !== "LoadingFirstPage" && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <svg
                width="56"
                height="56"
                viewBox="0 0 28 28"
                fill="none"
                className="mb-8 text-charcoal/10"
              >
                <ellipse cx="14" cy="8" rx="3.5" ry="6" fill="currentColor" opacity="0.3" />
                <ellipse cx="14" cy="20" rx="3.5" ry="6" fill="currentColor" opacity="0.3" />
                <ellipse cx="8" cy="14" rx="6" ry="3.5" fill="currentColor" opacity="0.3" />
                <ellipse cx="20" cy="14" rx="6" ry="3.5" fill="currentColor" opacity="0.3" />
                <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.4" />
              </svg>

              <p className="font-display text-2xl italic text-charcoal sm:text-3xl">
                No bouquets yet
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-charcoal/35">
                Be the first to plant one in the garden
              </p>
              <Link
                href="/bouquet"
                className="mt-10 inline-block bg-charcoal px-10 py-4 font-mono text-xs uppercase tracking-[0.3em] text-cream transition-opacity duration-200 hover:opacity-80"
              >
                Build a Bouquet
              </Link>
            </div>
          )}

          {/* Bouquet grid */}
          {results.length > 0 && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
              {results.map((bouquet, i) => (
                <BouquetCard key={bouquet._id} bouquet={bouquet} index={i} />
              ))}
            </div>
          )}

          {/* Footer navigation */}
          <div className="mt-20 flex flex-col items-center gap-8 sm:mt-28">
            {/* Divider */}
            <div className="flex items-center gap-4" aria-hidden="true">
              <span className="block h-px w-16 bg-charcoal/8 sm:w-24" />
              <span className="block h-1 w-1 rounded-full bg-charcoal/15" />
              <span className="block h-px w-16 bg-charcoal/8 sm:w-24" />
            </div>

            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal/50 underline decoration-charcoal/15 underline-offset-4 transition-colors duration-200 hover:text-charcoal hover:decoration-charcoal/40"
              >
                Home
              </Link>
              <span className="block h-3 w-px bg-charcoal/10" aria-hidden="true" />
              <Link
                href="/bouquet"
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal/50 underline decoration-charcoal/15 underline-offset-4 transition-colors duration-200 hover:text-charcoal hover:decoration-charcoal/40"
              >
                Build a Bouquet
              </Link>
            </div>

            {/* Footer credit */}
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-charcoal/25">
              Made by <a href="https://github.com/Pankaj3112" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-opacity duration-200 hover:opacity-60">@pankajbeniwal</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
