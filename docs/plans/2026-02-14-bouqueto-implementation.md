# Bouqueto Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Use frontend-design skill for all UI component tasks (Tasks 4, 5, 6, 7, 8, 10, 11).

**Goal:** Build a public digital bouquet builder app where users pick flowers, arrange them, write a card, and share via unique link.

**Architecture:** Next.js 15 App Router with Convex for real-time persistence. Multi-step builder flow on `/bouquet` using client state, single Convex mutation on save, shared view at `/bouquet/[id]`. CSS/DOM-based bouquet composition with percentage-positioned images for mobile responsiveness.

**Tech Stack:** Next.js 15 (App Router), Convex, Tailwind CSS, TypeScript, Vercel

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: Full Next.js project via `create-next-app`

**Step 1: Create Next.js project**

Run:
```bash
cd /Users/pankajbeniwal/Code/bouqueto
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-npm
```

Accept defaults. This scaffolds into the current directory (which has only `docs/` and `.git/`).

**Step 2: Verify it runs**

Run: `npm run dev`
Expected: Dev server starts at localhost:3000, default Next.js page renders.

**Step 3: Configure Tailwind theme with Bouqueto brand colors**

Edit `tailwind.config.ts` — extend the theme:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5F0E8",
        charcoal: "#2A2A2A",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
```

**Step 4: Add Google Fonts to layout**

Edit `src/app/layout.tsx` — import Playfair Display (logo) and JetBrains Mono (headings):

```tsx
import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Bouqueto — Beautiful Flowers, Delivered Digitally",
  description: "Build and share digital flower bouquets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="bg-cream text-charcoal antialiased">{children}</body>
    </html>
  );
}
```

**Step 5: Set base styles in globals.css**

Replace `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 6: Verify fonts and colors load**

Run: `npm run dev`
Expected: Page has cream background, fonts load without errors.

**Step 7: Commit**

```bash
git add -A
git commit -m "scaffold: Next.js 15 with Tailwind, brand colors, and fonts"
```

---

### Task 2: Set Up Convex

**Files:**
- Create: `convex/schema.ts`
- Create: `convex/bouquets.ts`
- Create: `src/app/ConvexClientProvider.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Install Convex**

Run:
```bash
cd /Users/pankajbeniwal/Code/bouqueto
npm install convex
npx convex init
```

Follow prompts to create a new Convex project. This creates `convex/` directory and `.env.local` with `NEXT_PUBLIC_CONVEX_URL`.

**Step 2: Define the schema**

Create `convex/schema.ts`:

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  bouquets: defineTable({
    flowers: v.array(
      v.object({
        flowerId: v.string(),
        count: v.number(),
      })
    ),
    arrangement: v.array(
      v.object({
        x: v.number(),
        y: v.number(),
        rotation: v.number(),
        scale: v.number(),
        flowerId: v.string(),
      })
    ),
    greeneryStyle: v.string(),
    cardMessage: v.string(),
    createdAt: v.number(),
  }),
});
```

**Step 3: Create bouquet mutations and queries**

Create `convex/bouquets.ts`:

```ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    flowers: v.array(
      v.object({ flowerId: v.string(), count: v.number() })
    ),
    arrangement: v.array(
      v.object({
        x: v.number(),
        y: v.number(),
        rotation: v.number(),
        scale: v.number(),
        flowerId: v.string(),
      })
    ),
    greeneryStyle: v.string(),
    cardMessage: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("bouquets", {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const get = query({
  args: { id: v.id("bouquets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("bouquets")
      .order("desc")
      .take(limit);
  },
});
```

**Step 4: Create ConvexClientProvider**

Create `src/app/ConvexClientProvider.tsx`:

```tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

**Step 5: Wrap layout with ConvexClientProvider**

Modify `src/app/layout.tsx` — wrap `{children}` with the provider:

```tsx
import ConvexClientProvider from "./ConvexClientProvider";

// ... (keep existing imports and config)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="bg-cream text-charcoal antialiased">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
```

**Step 6: Start Convex dev and verify**

Run: `npx convex dev` (in a separate terminal)
Expected: Convex syncs schema and functions successfully.

Run: `npm run dev`
Expected: App loads without errors, Convex connected.

**Step 7: Commit**

```bash
git add convex/ src/app/ConvexClientProvider.tsx src/app/layout.tsx package.json package-lock.json .env.local
git commit -m "feat: set up Convex with bouquets schema, mutations, and queries"
```

Note: `.env.local` contains the Convex URL. Add it to `.gitignore` if not already there, or commit it since `NEXT_PUBLIC_` vars are public.

---

### Task 3: Flower Data Config & Asset Placeholders

**Files:**
- Create: `src/data/flowers.ts`
- Create: `src/data/greenery.ts`
- Create: `public/flowers/` (placeholder directory)
- Create: `public/greenery/` (placeholder directory)

**Step 1: Create flower data config**

Create `src/data/flowers.ts`:

```ts
export interface Flower {
  id: string;
  name: string;
  meaning: string;
  birthMonth: string;
  image: string;
}

export const flowers: Flower[] = [
  { id: "orchid", name: "Orchid", meaning: "Beauty", birthMonth: "October", image: "/flowers/orchid.png" },
  { id: "tulip", name: "Tulip", meaning: "Perfect Love", birthMonth: "January", image: "/flowers/tulip.png" },
  { id: "dahlia", name: "Dahlia", meaning: "Elegance", birthMonth: "November", image: "/flowers/dahlia.png" },
  { id: "anemone", name: "Anemone", meaning: "Anticipation", birthMonth: "March", image: "/flowers/anemone.png" },
  { id: "peony", name: "Peony", meaning: "Prosperity", birthMonth: "April", image: "/flowers/peony.png" },
  { id: "zinnia", name: "Zinnia", meaning: "Endurance", birthMonth: "July", image: "/flowers/zinnia.png" },
  { id: "rose", name: "Rose", meaning: "Love", birthMonth: "June", image: "/flowers/rose.png" },
  { id: "sunflower", name: "Sunflower", meaning: "Adoration", birthMonth: "August", image: "/flowers/sunflower.png" },
  { id: "lily", name: "Lily", meaning: "Purity", birthMonth: "May", image: "/flowers/lily.png" },
  { id: "daisy", name: "Daisy", meaning: "Innocence", birthMonth: "February", image: "/flowers/daisy.png" },
  { id: "carnation", name: "Carnation", meaning: "Fascination", birthMonth: "September", image: "/flowers/carnation.png" },
  { id: "ranunculus", name: "Ranunculus", meaning: "Charm", birthMonth: "December", image: "/flowers/ranunculus.png" },
];

export function getFlowerById(id: string): Flower | undefined {
  return flowers.find((f) => f.id === id);
}
```

**Step 2: Create greenery data config**

Create `src/data/greenery.ts`:

```ts
export interface GreenerySet {
  id: string;
  name: string;
  images: string[];
}

export const greenerySets: GreenerySet[] = [
  {
    id: "tropical",
    name: "Tropical Leaves",
    images: ["/greenery/tropical-1.png", "/greenery/tropical-2.png", "/greenery/tropical-3.png"],
  },
  {
    id: "ferns",
    name: "Ferns",
    images: ["/greenery/fern-1.png", "/greenery/fern-2.png", "/greenery/fern-3.png"],
  },
  {
    id: "eucalyptus",
    name: "Eucalyptus",
    images: ["/greenery/eucalyptus-1.png", "/greenery/eucalyptus-2.png", "/greenery/eucalyptus-3.png"],
  },
];
```

**Step 3: Create asset placeholder directories**

Run:
```bash
mkdir -p /Users/pankajbeniwal/Code/bouqueto/public/flowers
mkdir -p /Users/pankajbeniwal/Code/bouqueto/public/greenery
```

Add a `.gitkeep` to each so they're tracked:
```bash
touch /Users/pankajbeniwal/Code/bouqueto/public/flowers/.gitkeep
touch /Users/pankajbeniwal/Code/bouqueto/public/greenery/.gitkeep
```

**Note:** The user will provide actual PNG assets from the reference site. Drop them into these directories matching the filenames in the config.

**Step 4: Commit**

```bash
git add src/data/ public/flowers/.gitkeep public/greenery/.gitkeep
git commit -m "feat: add flower and greenery data configs with asset placeholders"
```

---

### Task 4: Landing Page

> **REQUIRED:** Use `frontend-design` skill for this task — modern, polished UI.

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Build the landing page**

Replace `src/app/page.tsx` with a landing page that includes:

- "Bouqueto" logo in `font-display` (Playfair Display script)
- Tagline: "Beautiful flowers, delivered digitally"
- Primary CTA: "BUILD A BOUQUET" — black filled button, links to `/bouquet`
- Secondary link: "VIEW GARDEN" — underlined text link to `/garden`
- Warm cream background, centered layout, generous whitespace
- Mobile-first responsive
- Monospace uppercase for the tagline/labels

The page should be a server component (no client-side state needed).

Key design notes from the reference:
- Logo is very large and ornate, center of page
- Diagonal stripe or subtle pattern on top border bar
- Very minimal — just logo, tagline, 2 CTAs, footer
- Footer: "MADE BY @username" link

**Step 2: Verify**

Run: `npm run dev`
Expected: Landing page renders with branding, buttons link correctly.

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add landing page with branding and CTAs"
```

---

### Task 5: Flower Picker Component

> **REQUIRED:** Use `frontend-design` skill for this task.

**Files:**
- Create: `src/components/FlowerPicker.tsx`
- Create: `src/components/FlowerCard.tsx`
- Create: `src/components/SelectionPills.tsx`

**Step 1: Build FlowerCard component**

Create `src/components/FlowerCard.tsx`:

A single flower in the picker grid. Props:
- `flower: Flower` — the flower data
- `count: number` — how many times selected (0 if not)
- `onSelect: () => void` — called on click

Behavior:
- Displays flower image in a circular/soft container
- Shows count badge (dark circle, white number) in top-right when count > 0
- On hover: shows tooltip with name, meaning, birth month
- On click: calls `onSelect`
- Subtle hover animation (scale up slightly)

**Step 2: Build SelectionPills component**

Create `src/components/SelectionPills.tsx`:

Props:
- `selections: Array<{ flowerId: string, count: number }>`
- `onRemove: (flowerId: string) => void`

Renders a row of pill/chip buttons: `ORCHID x1`, `TULIP x3` etc.
Click a pill → calls `onRemove(flowerId)` which decrements or removes.

**Step 3: Build FlowerPicker component**

Create `src/components/FlowerPicker.tsx`:

A `"use client"` component. Props:
- `selectedFlowers: Array<{ flowerId: string, count: number }>`
- `onSelectionsChange: (selections: Array<{ flowerId: string, count: number }>) => void`
- `onNext: () => void`

Renders:
- "PICK 6 TO 10 BLOOMS" heading (monospace uppercase)
- Helper text when selections exist: "Click on a flower's name to deselect it."
- Grid of `FlowerCard` components — responsive: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5`
- `SelectionPills` below the grid
- "NEXT" button at bottom — disabled until total count >= 6, hidden until at least 1 selected

Logic:
- Clicking a flower increments its count (or adds it at count 1)
- Total across all flowers must be 6-10
- If total is 10, disable further additions (show visual feedback)
- Clicking a pill decrements count by 1 (removes if count reaches 0)

**Step 4: Verify with a test page**

Temporarily render `<FlowerPicker>` in `src/app/page.tsx` to verify:
- Grid renders with placeholder images (or broken images if assets not yet added — that's fine)
- Click increments count, badge shows
- Pills appear below
- Next button enables at 6

**Step 5: Revert test page, commit**

Restore `page.tsx` to landing page content.

```bash
git add src/components/FlowerPicker.tsx src/components/FlowerCard.tsx src/components/SelectionPills.tsx
git commit -m "feat: add flower picker with selection grid, badges, and pills"
```

---

### Task 6: Bouquet Arrangement Engine

**Files:**
- Create: `src/lib/arrangement.ts`
- Create: `src/components/BouquetComposition.tsx`

**Step 1: Write the arrangement algorithm**

Create `src/lib/arrangement.ts`:

```ts
export interface ArrangementItem {
  x: number;       // percentage 0-100
  y: number;       // percentage 0-100
  rotation: number; // degrees
  scale: number;
  flowerId: string;
  zIndex: number;
}

export interface FlowerSelection {
  flowerId: string;
  count: number;
}

/**
 * Generate a bouquet arrangement from flower selections.
 * Places flowers in a dome/circular cluster, center-heavy.
 * Greenery goes at lower z-indices around the edges.
 */
export function generateArrangement(
  selections: FlowerSelection[]
): ArrangementItem[] {
  const items: ArrangementItem[] = [];

  // Expand selections into individual flower instances
  const flowerInstances: string[] = [];
  for (const sel of selections) {
    for (let i = 0; i < sel.count; i++) {
      flowerInstances.push(sel.flowerId);
    }
  }

  const total = flowerInstances.length;
  const centerX = 50;
  const centerY = 45; // slightly above center for dome shape

  for (let i = 0; i < total; i++) {
    // Distribute in a rough circle with some randomness
    const angle = (i / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const radius = 15 + Math.random() * 15; // 15-30% from center

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius * 0.7; // squash vertically for dome
    const rotation = (Math.random() - 0.5) * 60; // -30 to +30 degrees
    const scale = 0.8 + Math.random() * 0.4; // 0.8 to 1.2

    items.push({
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
      rotation,
      scale,
      flowerId: flowerInstances[i],
      zIndex: 10 + i,
    });
  }

  return items;
}

export interface GreeneryItem {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  image: string;
  zIndex: number;
}

/**
 * Generate greenery positions behind the flowers.
 */
export function generateGreenery(images: string[]): GreeneryItem[] {
  const items: GreeneryItem[] = [];
  const count = 6 + Math.floor(Math.random() * 4); // 6-9 greenery pieces

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
    const radius = 20 + Math.random() * 25;

    items.push({
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius * 0.6,
      rotation: (Math.random() - 0.5) * 90,
      scale: 0.7 + Math.random() * 0.6,
      image: images[Math.floor(Math.random() * images.length)],
      zIndex: 1 + i,
    });
  }

  return items;
}
```

**Step 2: Build BouquetComposition component**

> **REQUIRED:** Use `frontend-design` skill.

Create `src/components/BouquetComposition.tsx`:

A `"use client"` component. Props:
- `arrangement: ArrangementItem[]`
- `greenery: GreeneryItem[]`

Renders a responsive container (`relative`, `aspect-square`, `max-w-md mx-auto`) with:
- Greenery images absolutely positioned (lower z-index)
- Flower images absolutely positioned on top
- Each image uses percentage `left`/`top`, CSS `transform` for rotation + scale
- All images have `w-16 sm:w-20 lg:w-24` (scales with breakpoints)

**Step 3: Verify**

Render the component in a test page with mock data. Flowers should appear in a cluster, greenery behind them.

**Step 4: Commit**

```bash
git add src/lib/arrangement.ts src/components/BouquetComposition.tsx
git commit -m "feat: add bouquet arrangement engine and composition renderer"
```

---

### Task 7: Bouquet Customizer Step

> **REQUIRED:** Use `frontend-design` skill.

**Files:**
- Create: `src/components/BouquetCustomizer.tsx`

**Step 1: Build the customizer**

Create `src/components/BouquetCustomizer.tsx`:

A `"use client"` component. Props:
- `selectedFlowers: FlowerSelection[]`
- `arrangement: ArrangementItem[]`
- `greenery: GreeneryItem[]`
- `greeneryStyle: string`
- `onNewArrangement: () => void`
- `onChangeGreenery: () => void`
- `onBack: () => void`
- `onNext: () => void`

Renders:
- "CUSTOMIZE YOUR BOUQUET" heading (monospace uppercase)
- "TRY A NEW ARRANGEMENT" — black filled button → calls `onNewArrangement`
- "CHANGE GREENERY" — outlined button → calls `onChangeGreenery`
- `<BouquetComposition>` displaying the current arrangement
- "BACK" (outlined) and "NEXT" (filled) buttons at bottom

**Step 2: Commit**

```bash
git add src/components/BouquetCustomizer.tsx
git commit -m "feat: add bouquet customizer with arrangement and greenery controls"
```

---

### Task 8: Card Writer Component

> **REQUIRED:** Use `frontend-design` skill.

**Files:**
- Create: `src/components/CardWriter.tsx`

**Step 1: Build the card writer**

Create `src/components/CardWriter.tsx`:

A `"use client"` component. Props:
- `cardMessage: string`
- `onMessageChange: (message: string) => void`
- `selectedFlowers: FlowerSelection[]`
- `onBack: () => void`
- `onNext: () => void`

Renders:
- "WRITE THE CARD" heading (monospace uppercase)
- Decorative flower illustrations on left and right sides (small versions of selected flowers on stems)
- Center: a card-style container with a thick border
- Inside: `<textarea>` with serif/handwriting font, placeholder "Write your message..."
- "BACK" and "NEXT" buttons at bottom

**Step 2: Commit**

```bash
git add src/components/CardWriter.tsx
git commit -m "feat: add card writer component with decorative flower borders"
```

---

### Task 9: Builder Page — Orchestrating All Steps

**Files:**
- Create: `src/app/bouquet/page.tsx`

**Step 1: Build the builder page**

Create `src/app/bouquet/page.tsx`:

A `"use client"` page component that manages the full builder state and renders the correct step.

```tsx
"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { FlowerPicker } from "@/components/FlowerPicker";
import { BouquetCustomizer } from "@/components/BouquetCustomizer";
import { CardWriter } from "@/components/CardWriter";
import { generateArrangement, generateGreenery } from "@/lib/arrangement";
import { greenerySets } from "@/data/greenery";
import type { ArrangementItem, GreeneryItem, FlowerSelection } from "@/lib/arrangement";

export default function BouquetBuilderPage() {
  const router = useRouter();
  const createBouquet = useMutation(api.bouquets.create);

  const [step, setStep] = useState(1);
  const [selectedFlowers, setSelectedFlowers] = useState<FlowerSelection[]>([]);
  const [arrangement, setArrangement] = useState<ArrangementItem[]>([]);
  const [greenery, setGreenery] = useState<GreeneryItem[]>([]);
  const [greeneryIndex, setGreeneryIndex] = useState(0);
  const [cardMessage, setCardMessage] = useState("");

  const currentGreenerySet = greenerySets[greeneryIndex];

  const handlePickerNext = useCallback(() => {
    const arr = generateArrangement(selectedFlowers);
    const gr = generateGreenery(currentGreenerySet.images);
    setArrangement(arr);
    setGreenery(gr);
    setStep(2);
  }, [selectedFlowers, currentGreenerySet]);

  const handleNewArrangement = useCallback(() => {
    setArrangement(generateArrangement(selectedFlowers));
    setGreenery(generateGreenery(currentGreenerySet.images));
  }, [selectedFlowers, currentGreenerySet]);

  const handleChangeGreenery = useCallback(() => {
    const nextIndex = (greeneryIndex + 1) % greenerySets.length;
    setGreeneryIndex(nextIndex);
    setGreenery(generateGreenery(greenerySets[nextIndex].images));
  }, [greeneryIndex]);

  const handleSave = useCallback(async () => {
    const id = await createBouquet({
      flowers: selectedFlowers,
      arrangement: arrangement.map(({ x, y, rotation, scale, flowerId }) => ({
        x, y, rotation, scale, flowerId,
      })),
      greeneryStyle: currentGreenerySet.id,
      cardMessage,
    });
    router.push(`/bouquet/${id}`);
  }, [createBouquet, selectedFlowers, arrangement, currentGreenerySet, cardMessage, router]);

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
          selectedFlowers={selectedFlowers}
          arrangement={arrangement}
          greenery={greenery}
          greeneryStyle={currentGreenerySet.id}
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
```

**Step 2: Verify the full flow**

Run: `npm run dev`, navigate to `/bouquet`
Expected:
- Step 1: Flower picker renders, can select flowers, Next enables at 6
- Step 2: Bouquet composition shows with randomized arrangement, buttons work
- Step 3: Card writer shows, can type message
- Save: Creates record in Convex, redirects to `/bouquet/[id]` (will 404 until Task 10)

**Step 3: Commit**

```bash
git add src/app/bouquet/page.tsx
git commit -m "feat: add bouquet builder page orchestrating all steps"
```

---

### Task 10: Shared Bouquet View Page

> **REQUIRED:** Use `frontend-design` skill.

**Files:**
- Create: `src/app/bouquet/[id]/page.tsx`

**Step 1: Build the shared view page**

Create `src/app/bouquet/[id]/page.tsx`:

A `"use client"` page that:
- Reads the bouquet ID from URL params
- Uses `useQuery(api.bouquets.get, { id })` to fetch the bouquet
- Shows loading state while fetching
- Shows 404-style message if not found
- When loaded, renders:
  - "Hi, I made this bouquet for you!" header
  - `<BouquetComposition>` with saved arrangement (need to regenerate greenery from `greeneryStyle`)
  - The card message in a card-styled container below
  - "COPY LINK" (filled) and "SHARE" (outlined) buttons
  - Copy Link: copies `window.location.href` to clipboard
  - Share: uses `navigator.share()` if available, falls back to copy

```tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { BouquetComposition } from "@/components/BouquetComposition";
import { generateGreenery } from "@/lib/arrangement";
import { greenerySets } from "@/data/greenery";
import { useMemo, useState } from "react";

export default function SharedBouquetPage() {
  const params = useParams();
  const id = params.id as Id<"bouquets">;
  const bouquet = useQuery(api.bouquets.get, { id });
  const [copied, setCopied] = useState(false);

  const greenery = useMemo(() => {
    if (!bouquet) return [];
    const set = greenerySets.find((s) => s.id === bouquet.greeneryStyle);
    return set ? generateGreenery(set.images) : [];
  }, [bouquet]);

  if (bouquet === undefined) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-mono uppercase tracking-widest">Loading...</p>
      </main>
    );
  }

  if (bouquet === null) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-mono uppercase tracking-widest">Bouquet not found</p>
      </main>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "A bouquet for you!",
        text: "Someone made you a digital bouquet",
        url: window.location.href,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="font-display text-3xl mb-8">
          Hi, I made this bouquet for you!
        </h1>

        <div className="bg-cream rounded-full p-8 mb-8">
          <BouquetComposition
            arrangement={bouquet.arrangement}
            greenery={greenery}
          />
        </div>

        {bouquet.cardMessage && (
          <div className="border-2 border-charcoal p-6 mb-8 text-left font-serif whitespace-pre-wrap">
            {bouquet.cardMessage}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleCopy}
            className="bg-charcoal text-cream px-6 py-3 font-mono uppercase tracking-widest text-sm"
          >
            {copied ? "COPIED!" : "COPY LINK"}
          </button>
          <button
            onClick={handleShare}
            className="border-2 border-charcoal px-6 py-3 font-mono uppercase tracking-widest text-sm"
          >
            SHARE
          </button>
        </div>
      </div>
    </main>
  );
}
```

**Step 2: Verify end-to-end**

Run full flow: build bouquet → save → lands on share page → bouquet renders with card message → copy/share buttons work.

**Step 3: Commit**

```bash
git add src/app/bouquet/\\[id\\]/page.tsx
git commit -m "feat: add shared bouquet view page with copy/share"
```

---

### Task 11: Garden Page

> **REQUIRED:** Use `frontend-design` skill.

**Files:**
- Create: `src/app/garden/page.tsx`

**Step 1: Build the garden page**

Create `src/app/garden/page.tsx`:

A `"use client"` page that:
- Uses `useQuery(api.bouquets.listRecent, { limit: 20 })` to fetch recent bouquets
- Renders a responsive grid of bouquet thumbnails
- Each thumbnail: small `<BouquetComposition>` in a card, clickable → links to `/bouquet/[id]`
- "Bouqueto" logo header at top, link back to home
- "GARDEN" heading
- Loading state while fetching
- Empty state: "No bouquets yet. Be the first to build one!" with CTA link

**Step 2: Verify**

Navigate to `/garden` — should show any bouquets created during testing.

**Step 3: Commit**

```bash
git add src/app/garden/page.tsx
git commit -m "feat: add garden page with recent bouquet gallery"
```

---

### Task 12: Mobile Responsiveness Pass

**Files:**
- Modify: All component files as needed

**Step 1: Test on mobile viewports**

Using browser dev tools, test at 375px, 414px, 768px, 1024px, 1440px widths.

Check each page:
- Landing: logo and buttons don't overflow, comfortable spacing
- Flower picker: grid adjusts columns (2 → 3 → 5), flowers are tappable sized
- Bouquet customizer: composition scales, buttons stack on mobile
- Card writer: textarea is full-width on mobile, flowers don't overflow
- Share page: composition scales, buttons comfortable
- Garden: grid adjusts (1 → 2 → 3 → 4 columns)

**Step 2: Fix any issues**

Adjust Tailwind responsive classes, padding, font sizes as needed. Common fixes:
- Add `px-4` padding on mobile containers
- Adjust `text-xl sm:text-2xl lg:text-4xl` for headings
- Ensure touch targets are at least 44px
- Stack buttons vertically on small screens: `flex-col sm:flex-row`

**Step 3: Commit**

```bash
git add -A
git commit -m "fix: mobile responsiveness across all pages"
```

---

### Task 13: Final Integration Test & Polish

**Files:**
- Possibly modify: Various files

**Step 1: Full end-to-end test**

1. Visit `/` — landing page renders beautifully
2. Click "BUILD A BOUQUET" → `/bouquet` loads
3. Pick 7 flowers (various types, different counts)
4. Click NEXT → bouquet renders with greenery
5. Click "TRY A NEW ARRANGEMENT" → layout changes
6. Click "CHANGE GREENERY" → greenery style changes
7. Click NEXT → card writer shows
8. Write a message, click NEXT → saves to Convex, redirects to `/bouquet/[id]`
9. Share page shows bouquet + message, Copy Link works
10. Visit `/garden` → the bouquet appears in the gallery
11. Click the bouquet → navigates to its share page

**Step 2: Fix any bugs found**

Address any issues from the integration test.

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: integration test fixes and polish"
```

---

## Task Dependency Graph

```
Task 1 (scaffold) → Task 2 (Convex) → Task 3 (data)
                                              ↓
Task 4 (landing) ←─────────────────── Task 3
Task 5 (picker) ←──────────────────── Task 3
Task 6 (arrangement engine) ←──────── Task 3
Task 7 (customizer) ←─────────────── Task 6
Task 8 (card writer) ←────────────── Task 5
Task 9 (builder page) ←───────────── Task 5 + 7 + 8
Task 10 (share page) ←────────────── Task 6 + 9
Task 11 (garden) ←─────────────────── Task 10
Task 12 (responsive pass) ←────────── Task 11
Task 13 (integration test) ←───────── Task 12
```

Tasks 4, 5, 6 can run in parallel after Task 3.
Tasks 7 and 8 can run in parallel after their respective deps.
