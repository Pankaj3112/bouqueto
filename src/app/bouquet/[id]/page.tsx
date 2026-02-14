"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import BouquetComposition from "@/components/BouquetComposition";
import { generateGreenery } from "@/lib/arrangement";
import { greenerySets } from "@/data/greenery";
import type { ArrangementItem } from "@/lib/arrangement";

export default function SharedBouquetPage() {
  const params = useParams();
  const id = params.id as Id<"bouquets">;
  const bouquet = useQuery(api.bouquets.get, { id });

  const [copied, setCopied] = useState(false);

  // --- Loading state ---
  if (bouquet === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-charcoal/50">
          Loading...
        </p>
      </main>
    );
  }

  // --- Not found state ---
  if (bouquet === null) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl italic text-charcoal sm:text-3xl">
            Bouquet not found
          </h1>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
            This bouquet may have been removed or the link is invalid
          </p>
          <Link
            href="/bouquet"
            className="mt-8 inline-block bg-charcoal px-8 py-4 font-mono text-xs uppercase tracking-[0.3em] text-cream transition-opacity duration-200 hover:opacity-80"
          >
            Build Your Own
          </Link>
        </div>
      </main>
    );
  }

  // --- Regenerate greenery from the saved style ---
  const greenerySet = greenerySets.find((s) => s.id === bouquet.greeneryStyle);
  const greenery = greenerySet ? generateGreenery(greenerySet.images) : [];

  // Reconstruct arrangement items with zIndex (stored without it)
  const arrangement: ArrangementItem[] = bouquet.arrangement.map(
    (item, i) => ({
      ...item,
      zIndex: 10 + i,
    })
  );

  // --- Copy link handler ---
  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // --- Share handler ---
  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: "A bouquet for you",
        text: bouquet!.cardMessage || "Someone made you a beautiful bouquet!",
        url: window.location.href,
      });
    } else {
      handleCopyLink();
    }
  }

  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-12">
          {/* Decorative accent */}
          <div
            className="mb-6 flex items-center justify-center gap-3"
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

          <h1 className="font-display text-2xl italic leading-snug text-charcoal sm:text-3xl lg:text-4xl">
            Hi, I made this
            <br />
            bouquet for you!
          </h1>
        </div>

        {/* Bouquet composition with soft radial glow */}
        <div className="relative mx-auto mb-8 sm:mb-12">
          {/* Outer radial glow for atmosphere */}
          <div
            className="pointer-events-none absolute inset-0 -inset-x-8 -inset-y-4 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(42,42,42,0.05) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <BouquetComposition
            arrangement={arrangement}
            greenery={greenery}
          />
        </div>

        {/* Card message */}
        {bouquet.cardMessage && (
          <>
            {/* Section divider */}
            <div
              className="mb-8 flex items-center gap-3 sm:mb-10"
              aria-hidden="true"
            >
              <span className="block h-px flex-1 bg-charcoal/10" />
              <span className="block h-1 w-1 rounded-full bg-charcoal/20" />
              <span className="block h-px flex-1 bg-charcoal/10" />
            </div>

            <div className="mx-auto max-w-md">
              <div className="relative border-2 border-charcoal bg-white p-1">
                {/* Inner border for double-frame effect */}
                <div className="border border-charcoal/15 px-6 py-8 sm:px-8 sm:py-10">
                  {/* Small decorative header */}
                  <div
                    className="mb-5 flex items-center justify-center gap-2"
                    aria-hidden="true"
                  >
                    <span className="block h-px w-6 bg-charcoal/15" />
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="text-charcoal/20"
                    >
                      <path
                        d="M6 0 L7.5 4.5 L12 6 L7.5 7.5 L6 12 L4.5 7.5 L0 6 L4.5 4.5 Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="block h-px w-6 bg-charcoal/15" />
                  </div>

                  <p className="whitespace-pre-wrap text-center font-display text-base italic leading-relaxed text-charcoal sm:text-lg sm:leading-relaxed">
                    {bouquet.cardMessage}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Section divider */}
        <div
          className="mt-10 mb-8 flex items-center gap-3"
          aria-hidden="true"
        >
          <span className="block h-px flex-1 bg-charcoal/10" />
          <span className="block h-1 w-1 rounded-full bg-charcoal/20" />
          <span className="block h-px flex-1 bg-charcoal/10" />
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full max-w-[180px] bg-charcoal py-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-cream transition-opacity duration-200 hover:opacity-80"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full max-w-[180px] border-2 border-charcoal bg-transparent py-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-charcoal transition-colors duration-200 hover:bg-charcoal hover:text-cream"
          >
            Share
          </button>
        </div>

        {/* Build your own link */}
        <div className="mt-12 text-center sm:mt-16">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/40">
            Want to send one too?
          </p>
          <Link
            href="/bouquet"
            className="inline-block font-mono text-xs uppercase tracking-[0.3em] text-charcoal underline decoration-charcoal/30 underline-offset-4 transition-colors duration-200 hover:decoration-charcoal/60"
          >
            Build Your Own Bouquet
          </Link>
        </div>
      </div>
    </main>
  );
}
