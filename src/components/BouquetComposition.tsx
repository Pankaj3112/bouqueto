"use client";

import { useState } from "react";
import Image from "next/image";
import { getFlowerById } from "@/data/flowers";
import type { ArrangementItem, GreeneryItem } from "@/lib/arrangement";

interface BouquetCompositionProps {
  arrangement: ArrangementItem[];
  greenery: GreeneryItem[];
}

/**
 * Placeholder SVG rendered when a flower or greenery image fails to load.
 * Uses a soft petal shape in the project's charcoal color at low opacity.
 */
function FlowerPlaceholder() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 28 28"
      fill="none"
      className="text-charcoal/20"
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
  );
}

function GreeneryPlaceholder() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 32 32"
      fill="none"
      className="text-charcoal/15"
    >
      <path
        d="M16 4C16 4 8 10 8 18C8 22 11.5 26 16 28C20.5 26 24 22 24 18C24 10 16 4 16 4Z"
        fill="currentColor"
        opacity="0.5"
      />
      <line
        x1="16"
        y1="12"
        x2="16"
        y2="28"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
}

export default function BouquetComposition({
  arrangement,
  greenery,
}: BouquetCompositionProps) {
  // Track which images have errored so we can show placeholders
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  function handleImageError(key: string) {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }

  const hasContent = arrangement.length > 0 || greenery.length > 0;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      {/* Subtle background atmosphere -- soft radial glow behind the bouquet */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(42,42,42,0.06) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Empty state */}
      {!hasContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 28 28"
            fill="none"
            className="text-charcoal/15"
          >
            <ellipse
              cx="14"
              cy="8"
              rx="3.5"
              ry="6"
              fill="currentColor"
              opacity="0.3"
            />
            <ellipse
              cx="14"
              cy="20"
              rx="3.5"
              ry="6"
              fill="currentColor"
              opacity="0.3"
            />
            <ellipse
              cx="8"
              cy="14"
              rx="6"
              ry="3.5"
              fill="currentColor"
              opacity="0.3"
            />
            <ellipse
              cx="20"
              cy="14"
              rx="6"
              ry="3.5"
              fill="currentColor"
              opacity="0.3"
            />
            <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.4" />
          </svg>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-charcoal/30">
            Select flowers to begin
          </p>
        </div>
      )}

      {/* Greenery layer -- rendered first, lower z-indices */}
      {greenery.map((item, i) => {
        const key = `greenery-${i}`;
        const hasFailed = failedImages.has(key);

        return (
          <div
            key={key}
            className="absolute w-14 sm:w-18 lg:w-22"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              zIndex: item.zIndex,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
            }}
          >
            {hasFailed ? (
              <GreeneryPlaceholder />
            ) : (
              <Image
                src={item.image}
                alt=""
                width={88}
                height={88}
                className="h-auto w-full object-contain opacity-85 drop-shadow-sm"
                onError={() => handleImageError(key)}
                draggable={false}
              />
            )}
          </div>
        );
      })}

      {/* Flower layer -- rendered on top with higher z-indices */}
      {arrangement.map((item, i) => {
        const flower = getFlowerById(item.flowerId);
        const key = `flower-${item.flowerId}-${i}`;
        const hasFailed = failedImages.has(key) || !flower;

        return (
          <div
            key={key}
            className="absolute w-16 sm:w-20 lg:w-24"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              zIndex: item.zIndex,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
            }}
          >
            {hasFailed ? (
              <FlowerPlaceholder />
            ) : (
              <Image
                src={flower!.image}
                alt={flower!.name}
                width={96}
                height={96}
                className="h-auto w-full object-contain drop-shadow-md"
                onError={() => handleImageError(key)}
                draggable={false}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
