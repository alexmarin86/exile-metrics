import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

/* chisel array:
const CHISELS = [
  "Cartographer's Chisel",
  "Maven's Chisel of Avarice",
  "Maven's Chisel of Divination",
  "Maven's Chisel of Procurement",
  "Maven's Chisel of Proliferation",
  "Maven's Chisel of Scarabs",
]
*/

export default defineSchema({
  FarmingSession: defineTable({
    userId: v.string(),
    // session info
    sessionName: v.string(),
    sessionDescription: v.string(),
    sessionNotes: v.optional(v.string()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
    totalCost: v.optional(v.float64()),
    totalDuration: v.optional(v.float64()),
    totalReturns: v.optional(v.float64()),
    divCost: v.optional(v.float64()),
    isConcluded: v.boolean(),
    // map info
    mapName: v.optional(v.string()),
    isRandomMap: v.boolean(),
    isOriginator: v.boolean(),
    isSelfFarmed: v.boolean(),
    mapCost: v.optional(v.float64()),
    numberOfMaps: v.float64(),
    // chisel info
    isUsingChisels: v.boolean(),
    chiselName: v.optional(
      v.union(
        v.literal("Cartographer's Chisel"),
        v.literal("Maven's Chisel of Avarice"),
        v.literal("Maven's Chisel of Divination"),
        v.literal("Maven's Chisel of Procurement"),
        v.literal("Maven's Chisel of Proliferation"),
        v.literal("Maven's Chisel of Scarabs"),
      ),
    ),
    chiselPrice: v.optional(v.float64()),
    // scarab info
    isUsingScarabs: v.boolean(),
    scarabs: v.optional(
      v.array(
        v.object({
          name: v.string(),
          price: v.float64(),
          quantity: v.float64(),
        }),
      ),
    ),
    // map craft info
    isUsingMapCraft: v.boolean(),
    mapCraftName: v.optional(v.string()),
    mapCraftPrice: v.optional(v.float64()),
  }).index('by_user_id', ['userId']),

  Stint: defineTable({
    sessionId: v.id('FarmingSession'),
    userId: v.string(),
    startTime: v.float64(),
    endTime: v.optional(v.float64()),
    duration: v.optional(v.float64()),
    createdAt: v.float64(),
    updatedAt: v.float64(),
  })
    .index('by_session', ['sessionId'])
    .index('by_user_session', ['userId', 'sessionId']),
})
