"use client";

import type { ArrangementItem } from "@/lib/arrangement";
import BouquetComposition from "@/components/BouquetComposition";

interface BouquetCustomizerProps {
  arrangement: ArrangementItem[];
  greeneryStyle: string;
  onNewArrangement: () => void;
  onChangeGreenery: () => void;
  onBack: () => void;
  onNext: () => void;
}

export default function BouquetCustomizer({
  arrangement,
  greeneryStyle,
  onNewArrangement,
  onChangeGreenery,
  onBack,
  onNext,
}: BouquetCustomizerProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        {/* Decorative line */}
        <div className="mb-6 flex items-center justify-center gap-3" aria-hidden="true">
          <span className="block h-px w-8 bg-charcoal/20 sm:w-12" />
          <span className="block h-1 w-1 rounded-full bg-charcoal/30" />
          <span className="block h-px w-8 bg-charcoal/20 sm:w-12" />
        </div>

        <h2 className="font-mono text-sm uppercase tracking-[0.35em] text-charcoal sm:text-base">
          Customize Your Bouquet
        </h2>

        {/* Greenery style label */}
        {greeneryStyle && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
            Greenery: {greeneryStyle}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onNewArrangement}
          className="w-full max-w-xs bg-charcoal py-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-cream transition-opacity duration-200 hover:opacity-80 sm:w-auto sm:px-8"
        >
          Try a New Arrangement
        </button>

        <button
          type="button"
          onClick={onChangeGreenery}
          className="w-full max-w-xs border-2 border-charcoal bg-transparent py-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-charcoal transition-colors duration-200 hover:bg-charcoal hover:text-cream sm:w-auto sm:px-8"
        >
          Change Greenery
        </button>
      </div>

      {/* Bouquet composition preview */}
      <div className="mx-auto max-w-md">
        <BouquetComposition arrangement={arrangement} greeneryStyle={greeneryStyle} />
      </div>

      {/* Section divider */}
      <div className="mt-10 mb-8 flex items-center gap-3" aria-hidden="true">
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
          className="w-full max-w-[160px] bg-charcoal py-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-cream transition-opacity duration-200 hover:opacity-80"
        >
          Next
        </button>
      </div>
    </section>
  );
}
