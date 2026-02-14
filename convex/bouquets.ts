import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    flowers: v.array(
      v.object({ flowerId: v.string(), count: v.number() })
    ),
    arrangement: v.array(
      v.object({
        flowerId: v.string(),
        order: v.number(),
        rotation: v.number(),
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
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bouquets")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
