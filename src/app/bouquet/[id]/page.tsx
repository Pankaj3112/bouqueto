"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import BouquetComposition from "@/components/BouquetComposition";
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

  const arrangement: ArrangementItem[] = bouquet.arrangement.map((item) => ({
    flowerId: item.flowerId,
    order: item.order,
    rotation: item.rotation,
  }));

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

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
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Logo */}
        <div className="mb-6 text-center sm:mb-10">
          <Link
            href="/"
            className="inline-block font-display text-3xl tracking-tight text-charcoal transition-opacity duration-200 hover:opacity-60 sm:text-4xl"
          >
            Bouqueto
          </Link>
        </div>

        {/* Heading */}
        <h1 className="mb-8 text-center font-display text-xl text-charcoal sm:mb-12 sm:text-2xl">
          Hi, I made this bouquet for you!
        </h1>

        <div className="text-center">
          {/* Bouquet with circular beige glow */}
          <div className="relative isolate max-w-lg mx-auto">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square w-[90%] rounded-full bg-[#EDE8DC]"
              aria-hidden="true"
            />
            <BouquetComposition
              arrangement={arrangement}
              greeneryStyle={bouquet.greeneryStyle}
            />
          </div>

          {/* Card message — stationery-style note overlapping bouquet */}
          {bouquet.cardMessage && (
            <div className="relative z-10 mx-auto max-w-[280px] sm:max-w-xs text-center">
              <div
                className="relative overflow-hidden border border-charcoal/15 px-5 py-6 sm:px-6 sm:py-7 mx-auto -translate-y-[50px] -rotate-2 shadow-[0_2px_16px_rgba(42,42,42,0.07)] transition-all duration-300"
                style={{
                  backgroundImage: "url('/textures/cream-paper.png')",
                  backgroundRepeat: "repeat",
                  backgroundColor: "#FFFDF8",
                }}
              >
                {/* Message */}
                <p className="relative whitespace-pre-wrap text-center font-display text-sm italic leading-relaxed text-charcoal/85 sm:text-base sm:leading-relaxed">
                  {bouquet.cardMessage}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-10 flex items-center justify-center gap-3 sm:mt-14">
          <button
            type="button"
            onClick={handleCopyLink}
            className="bg-charcoal px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-cream transition-opacity duration-200 hover:opacity-80 sm:px-8 sm:py-4 sm:tracking-[0.3em]"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="border border-charcoal bg-transparent px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-charcoal transition-colors duration-200 hover:bg-charcoal hover:text-cream sm:px-8 sm:py-4 sm:tracking-[0.3em]"
          >
            Share
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center sm:mt-16">
          <p className="font-mono text-xs text-charcoal/60">
            made with bouqueto, a tool by{" "}
            <a href="https://github.com/Pankaj3112" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 transition-opacity duration-200 hover:opacity-60">@pankajbeniwal</a>
          </p>
          <Link
            href="/bouquet"
            className="mt-1 inline-block font-mono text-xs text-charcoal/60 underline underline-offset-2 transition-colors duration-200 hover:text-charcoal"
          >
            make a bouquet now!
          </Link>
        </div>
      </div>
    </main>
  );
}
