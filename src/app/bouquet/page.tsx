"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import FlowerPicker from "@/components/FlowerPicker";
import BouquetCustomizer from "@/components/BouquetCustomizer";
import CardWriter from "@/components/CardWriter";
import { generateArrangement } from "@/lib/arrangement";
import { greenerySets } from "@/data/greenery";
import type { ArrangementItem, FlowerSelection } from "@/lib/arrangement";

export default function BouquetBuilderPage() {
  const router = useRouter();
  const createBouquet = useMutation(api.bouquets.create);

  const [step, setStep] = useState(1);
  const [selectedFlowers, setSelectedFlowers] = useState<FlowerSelection[]>([]);
  const [arrangement, setArrangement] = useState<ArrangementItem[]>([]);
  const [greeneryIndex, setGreeneryIndex] = useState(0);
  const [arrangementSeed, setArrangementSeed] = useState(0);
  const [cardMessage, setCardMessage] = useState("");

  const handlePickerNext = useCallback(() => {
    const newArrangement = generateArrangement(selectedFlowers, arrangementSeed);
    setArrangement(newArrangement);
    setStep(2);
  }, [selectedFlowers, arrangementSeed]);

  const handleNewArrangement = useCallback(() => {
    const newSeed = Date.now();
    setArrangementSeed(newSeed);
    const newArrangement = generateArrangement(selectedFlowers, newSeed);
    setArrangement(newArrangement);
  }, [selectedFlowers]);

  const handleChangeGreenery = useCallback(() => {
    setGreeneryIndex((prev) => (prev + 1) % greenerySets.length);
  }, []);

  const handleSave = useCallback(async () => {
    const id = await createBouquet({
      flowers: selectedFlowers,
      arrangement: arrangement.map(({ flowerId, order, rotation }) => ({
        flowerId,
        order,
        rotation,
      })),
      greeneryStyle: greenerySets[greeneryIndex].id,
      cardMessage,
    });
    router.push(`/bouquet/${id}`);
  }, [createBouquet, selectedFlowers, arrangement, greeneryIndex, cardMessage, router]);

  return (
    <main className="min-h-screen bg-cream">
      {step === 1 && (
        <FlowerPicker
          selectedFlowers={selectedFlowers}
          onSelectionsChange={setSelectedFlowers}
          onNext={handlePickerNext}
        />
      )}
      {step === 2 && (
        <BouquetCustomizer
          arrangement={arrangement}
          greeneryStyle={greenerySets[greeneryIndex].id}
          onNewArrangement={handleNewArrangement}
          onChangeGreenery={handleChangeGreenery}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <CardWriter
          cardMessage={cardMessage}
          onMessageChange={setCardMessage}
          selectedFlowers={selectedFlowers}
          onBack={() => setStep(2)}
          onNext={handleSave}
        />
      )}
    </main>
  );
}
