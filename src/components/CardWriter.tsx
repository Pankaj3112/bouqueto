"use client";

import { useState } from "react";
import Image from "next/image";
import { getFlowerById } from "@/data/flowers";
import type { FlowerSelection } from "@/lib/arrangement";

interface CardWriterProps {
  cardMessage: string;
  onMessageChange: (message: string) => void;
  selectedFlowers: FlowerSelection[];
  onBack: () => void;
  onNext: () => void;
}

/**
 * SVG placeholder for when a flower image fails to load or isn't available.
 * Renders a small colored circle with the flower name beneath it.
 */
function FlowerStemPlaceholder({ name, index }: { name: string; index: number }) {
  // Rotate hue based on index so each placeholder looks distinct
  const hue = (index * 47 + 10) % 360;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width="40"
        height="64"
        viewBox="0 0 40 64"
        fill="none"
        className="shrink-0"
      >
        {/* Stem */}
        <line
          x1="20"
          y1="28"
          x2="20"
          y2="64"
          stroke="#2A2A2A"
          strokeWidth="1.5"
          opacity="0.25"
        />
        {/* Small leaf on stem */}
        <ellipse
          cx="24"
          cy="44"
          rx="5"
          ry="2.5"
          fill="#2A2A2A"
          opacity="0.12"
          transform="rotate(-30 24 44)"
        />
        {/* Flower head */}
        <circle
          cx="20"
          cy="16"
          r="12"
          fill={`hsl(${hue}, 35%, 75%)`}
          opacity="0.6"
        />
        <circle cx="20" cy="16" r="5" fill={`hsl(${hue}, 30%, 60%)`} opacity="0.5" />
      </svg>
      <span className="font-mono text-[8px] uppercase tracking-wider text-charcoal/40">
        {name}
      </span>
    </div>
  );
}

/**
 * A single flower on a stem for the decorative side columns.
 * Shows the actual flower image with a drawn stem beneath it,
 * falling back to the placeholder on error.
 */
function FlowerOnStem({
  flowerId,
  index,
}: {
  flowerId: string;
  index: number;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const flower = getFlowerById(flowerId);

  if (!flower || imgFailed) {
    return (
      <FlowerStemPlaceholder
        name={flower?.name ?? flowerId}
        index={index}
      />
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Flower image */}
      <div className="relative h-14 w-14 sm:h-16 sm:w-16">
        <Image
          src={flower.image}
          alt={flower.name}
          width={64}
          height={64}
          className="h-full w-full object-contain drop-shadow-sm"
          onError={() => setImgFailed(true)}
          draggable={false}
        />
      </div>
      {/* Drawn stem */}
      <svg
        width="8"
        height="40"
        viewBox="0 0 8 40"
        fill="none"
        className="shrink-0 -mt-1"
        aria-hidden="true"
      >
        <path
          d="M4 0 C4 10, 5 20, 4 40"
          stroke="#2A2A2A"
          strokeWidth="1.5"
          opacity="0.2"
        />
        {/* Small leaf */}
        <ellipse
          cx="6"
          cy="18"
          rx="4"
          ry="2"
          fill="#2A2A2A"
          opacity="0.1"
          transform="rotate(-25 6 18)"
        />
      </svg>
      {/* Flower name */}
      <span className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-charcoal/35">
        {flower.name}
      </span>
    </div>
  );
}

export default function CardWriter({
  cardMessage,
  onMessageChange,
  selectedFlowers,
  onBack,
  onNext,
}: CardWriterProps) {
  // Expand selections into individual flower IDs for the side columns
  const expandedFlowerIds: string[] = [];
  for (const sel of selectedFlowers) {
    for (let i = 0; i < sel.count; i++) {
      expandedFlowerIds.push(sel.flowerId);
    }
  }

  // Left side: first 3 unique flowers, Right side: next 3 unique flowers
  const uniqueFlowerIds = selectedFlowers.map((s) => s.flowerId);
  const leftFlowers = uniqueFlowerIds.slice(0, 3);
  const rightFlowers = uniqueFlowerIds.slice(3, 6);

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        {/* Decorative line */}
        <div
          className="mb-6 flex items-center justify-center gap-3"
          aria-hidden="true"
        >
          <span className="block h-px w-8 bg-charcoal/20 sm:w-12" />
          <span className="block h-1 w-1 rounded-full bg-charcoal/30" />
          <span className="block h-px w-8 bg-charcoal/20 sm:w-12" />
        </div>

        <h2 className="font-mono text-sm uppercase tracking-[0.35em] text-charcoal sm:text-base">
          Write the Card
        </h2>

        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
          Add a personal message to your bouquet
        </p>
      </div>

      {/* Main card area: flowers | card | flowers */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-10">
        {/* Left flowers column -- hidden on small screens */}
        {leftFlowers.length > 0 && (
          <div className="hidden flex-col items-center gap-6 md:flex">
            {leftFlowers.map((fId, i) => (
              <FlowerOnStem key={`left-${fId}-${i}`} flowerId={fId} index={i} />
            ))}
          </div>
        )}

        {/* Card */}
        <div className="w-full max-w-md flex-1">
          {/* Decorative corner accents on the card */}
          <div className="relative border-2 border-charcoal bg-white p-1">
            {/* Inner border for double-frame effect */}
            <div className="border border-charcoal/15 p-6 sm:p-8">
              {/* Small decorative header inside the card */}
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

              <textarea
                value={cardMessage}
                onChange={(e) => onMessageChange(e.target.value)}
                placeholder="Write your message here..."
                maxLength={500}
                rows={8}
                className="w-full resize-none bg-transparent font-display text-base italic leading-relaxed text-charcoal placeholder:text-charcoal/25 placeholder:italic focus:outline-none sm:text-lg sm:leading-relaxed"
              />

              {/* Character count */}
              <div className="mt-4 flex items-center justify-between">
                <span className="block h-px flex-1 bg-charcoal/10" />
                <span className="ml-3 font-mono text-[9px] uppercase tracking-[0.15em] text-charcoal/30">
                  {cardMessage.length}/500
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right flowers column -- hidden on small screens */}
        {rightFlowers.length > 0 && (
          <div className="hidden flex-col items-center gap-6 md:flex">
            {rightFlowers.map((fId, i) => (
              <FlowerOnStem
                key={`right-${fId}-${i}`}
                flowerId={fId}
                index={i + 3}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile: Show flowers in a horizontal row below the card */}
      {(leftFlowers.length > 0 || rightFlowers.length > 0) && (
        <div className="mt-6 flex flex-wrap items-end justify-center gap-4 md:hidden">
          {[...leftFlowers, ...rightFlowers].map((fId, i) => (
            <FlowerOnStem key={`mobile-${fId}-${i}`} flowerId={fId} index={i} />
          ))}
        </div>
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

      {/* Navigation buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full max-w-[160px] border-2 border-charcoal bg-transparent py-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-charcoal transition-colors duration-200 hover:bg-charcoal hover:text-cream"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-full max-w-[200px] bg-charcoal py-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-cream transition-opacity duration-200 hover:opacity-80"
        >
          Send Bouquet
        </button>
      </div>
    </section>
  );
}
