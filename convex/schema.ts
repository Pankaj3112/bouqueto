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
        flowerId: v.string(),
        order: v.number(),
        rotation: v.number(),
      })
    ),
    greeneryStyle: v.string(),
    cardMessage: v.string(),
    createdAt: v.number(),
  }),
});
