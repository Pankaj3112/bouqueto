# Pagination Design — Garden Page

## Problem

The garden page loads all bouquets at once via `listRecent` with a fixed limit of 20. As the number of bouquets grows, this becomes a performance and reliability risk.

## Solution

Add cursor-based pagination using Convex's built-in `.paginate()` and `usePaginatedQuery` hook, with a "Load More" button UX.

- **Batch size**: 20 bouquets per load
- **UX pattern**: "Load More" button (not infinite scroll, not classic pages)
- **No total count display** — keep it simple

## Changes

### Backend — `convex/bouquets.ts`

Replace the `listRecent` query:

- Swap `args: { limit: v.optional(v.number()) }` for `args: { paginationOpts: paginationOptsValidator }`
- Replace `.take(limit)` with `.paginate(args.paginationOpts)`
- Convex handles cursor management — returns `{ page, isDone, continueCursor }`

`create` and `get` queries are unchanged.

### Frontend — `src/app/garden/page.tsx`

- Switch from `useQuery` to `usePaginatedQuery` with `initialNumItems: 20`
- `usePaginatedQuery` returns `{ results, status, loadMore }`
- Replace `bouquets` references with `results`
- Loading state: check `status === "LoadingFirstPage"` instead of `=== undefined`
- Empty state: check `results.length === 0` when not loading
- Add "Load More" button between grid and footer, visible when `status === "CanLoadMore"`
- Show loading indicator when `status === "LoadingMore"`
- Button styling matches existing design system (mono font, uppercase tracking, charcoal)
- Bouquet count badge shows `results.length`
- `BouquetCard` component unchanged
- Grid layout unchanged
- Fade-in animations unchanged

## Approach chosen over alternatives

- **Offset-based pagination**: Rejected — offsets break with real-time data (items shift/duplicate)
- **Manual timestamp cursor**: Rejected — reinvents what Convex provides natively
