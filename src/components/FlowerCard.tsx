"use client";

import { useState } from "react";
import Image from "next/image";
import type { Flower } from "@/data/flowers";

interface FlowerCardProps {
  flower: Flower;
  count: number;
  onSelect: () => void;
}

export default function FlowerCard({ flower, count, onSelect }: FlowerCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="group relative flex flex-col items-center">
      {/* Clickable flower container */}
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex h-32 w-32 items-center justify-center rounded-full border-2 border-charcoal/10 bg-cream transition-all duration-300 ease-out hover:scale-105 hover:border-charcoal/30 hover:shadow-lg sm:h-36 sm:w-36 lg:h-40 lg:w-40"
        aria-label={`Select ${flower.name}`}
      >
        {/* Flower image or placeholder */}
        {imgError ? (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full">
            <svg
              width="40"
              height="40"
              viewBox="0 0 28 28"
              fill="none"
              className="text-charcoal/30"
            >
              <ellipse
                cx="14"
                cy="8"
                rx="3.5"
                ry="6"
                fill="currentColor"
                opacity="0.4"
              />
              <ellipse
                cx="14"
                cy="20"
                rx="3.5"
                ry="6"
                fill="currentColor"
                opacity="0.4"
              />
              <ellipse
                cx="8"
                cy="14"
                rx="6"
                ry="3.5"
                fill="currentColor"
                opacity="0.4"
              />
              <ellipse
                cx="20"
                cy="14"
                rx="6"
                ry="3.5"
                fill="currentColor"
                opacity="0.4"
              />
              <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.6" />
            </svg>
          </div>
        ) : (
          <Image
            src={flower.image}
            alt={flower.name}
            width={120}
            height={120}
            className="h-auto w-3/4 object-contain drop-shadow-sm"
            onError={() => setImgError(true)}
          />
        )}

        {/* Count badge */}
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-charcoal font-mono text-xs font-bold text-cream shadow-md">
            {count}
          </span>
        )}
      </button>

      {/* Flower name below the circle */}
      <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/70">
        {flower.name}
      </span>

      {/* Hover tooltip / info card */}
      <div
        className={`pointer-events-none absolute -top-2 left-1/2 z-20 w-48 -translate-x-1/2 -translate-y-full transition-all duration-200 ${
          isHovered
            ? "visible opacity-100 translate-y-[-100%]"
            : "invisible opacity-0 translate-y-[calc(-100%+4px)]"
        }`}
      >
        <div className="rounded-sm border border-charcoal/10 bg-cream px-4 py-3 shadow-xl">
          <p className="font-display text-sm font-bold leading-snug text-charcoal">
            {flower.name}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-charcoal/60">
            {flower.meaning}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="block h-px w-3 bg-charcoal/20" />
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-charcoal/40">
              {flower.birthMonth} bloom
            </p>
          </div>
        </div>
        {/* Tooltip arrow */}
        <div className="mx-auto h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-cream" />
      </div>
    </div>
  );
}
