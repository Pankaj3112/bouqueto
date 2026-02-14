"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getFlowerById } from "@/data/flowers";
import { greenerySets } from "@/data/greenery";
import type { ArrangementItem } from "@/lib/arrangement";

interface BouquetCompositionProps {
  arrangement: ArrangementItem[];
  greeneryStyle: string;
}

export default function BouquetComposition({
  arrangement,
  greeneryStyle,
}: BouquetCompositionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Scale the fixed-size composition to fit the container on small screens
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      setScale(Math.min(1, el.clientWidth / 520));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function handleImageError(key: string) {
    setFailedImages((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }

  const greenerySet = greenerySets.find((s) => s.id === greeneryStyle);
  const hasContent = arrangement.length > 0;

  return (
    <div ref={containerRef} className="flex relative justify-center items-center py-4">
      <div style={{ zoom: scale }}>
        <div className="relative w-[500px] min-h-[410px] mx-auto">
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
                <ellipse cx="14" cy="8" rx="3.5" ry="6" fill="currentColor" opacity="0.3" />
                <ellipse cx="14" cy="20" rx="3.5" ry="6" fill="currentColor" opacity="0.3" />
                <ellipse cx="8" cy="14" rx="6" ry="3.5" fill="currentColor" opacity="0.3" />
                <ellipse cx="20" cy="14" rx="6" ry="3.5" fill="currentColor" opacity="0.3" />
                <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.4" />
              </svg>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-charcoal/30">
                Select flowers to begin
              </p>
            </div>
          )}

          {/* Bush background — z-0, behind flowers */}
          {greenerySet && !failedImages.has("bush-bg") && (
            <Image
              src={greenerySet.bushImage}
              alt=""
              width={600}
              height={500}
              className="absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              onError={() => handleImageError("bush-bg")}
              draggable={false}
              priority
            />
          )}

          {/* Flower container — flex-wrap-reverse with negative spacing for natural overlap */}
          {hasContent && (
            <div className="flex flex-wrap-reverse w-[300px] justify-center items-center -space-x-4 -space-y-20 relative m-auto">
              {arrangement.map((item, i) => {
                const flower = getFlowerById(item.flowerId);
                const key = `flower-${i}`;
                if (!flower || failedImages.has(key)) return null;

                return (
                  <div
                    key={key}
                    className="flex relative justify-center items-center pt-4"
                    style={{ order: item.order }}
                  >
                    <Image
                      src={flower.image}
                      alt={flower.name}
                      width={flower.displaySize}
                      height={flower.displaySize}
                      className="relative z-10 transition-transform hover:scale-105"
                      style={{ transform: `rotate(${item.rotation}deg)` }}
                      onError={() => handleImageError(key)}
                      draggable={false}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Bush top overlay — z-10, on top of flowers */}
          {greenerySet?.bushTopImage && !failedImages.has("bush-top") && (
            <Image
              src={greenerySet.bushTopImage}
              alt=""
              width={600}
              height={500}
              className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              onError={() => handleImageError("bush-top")}
              draggable={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
