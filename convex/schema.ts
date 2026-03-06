import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

/* chisel array (Cartographer's Chisel is legacy, removed March 2026):
const CHISELS = [
  "Cartographer's Chisel", // Legacy only
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
    // chisel info (Cartographer's Chisel kept for backward compatibility)
    isUsingChisels: v.boolean(),
    chiselName: v.optional(
      v.union(
        v.literal("Cartographer's Chisel"), // Legacy only
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
    // map craft info (removed March 2026, kept for backward compatibility)
    isUsingMapCraft: v.boolean(),
    mapCraftName: v.optional(v.string()),
    mapCraftPrice: v.optional(v.float64()),
    // astrolabe info (added March 2026)
    isUsingAstrolabe: v.optional(v.boolean()),
    astrolabeName: v.optional(
      v.union(
        v.literal('Chaotic Astrolabe'),
        v.literal('Enshrouded Astrolabe'),
        v.literal('Fruiting Astrolabe'),
        v.literal('Fungal Astrolabe'),
        v.literal('Grasping Astrolabe'),
        v.literal('Lightless Astrolabe'),
        v.literal('Nameless Astrolabe'),
        v.literal('Runic Astrolabe'),
        v.literal('Templar Astrolabe'),
        v.literal('Timeless Astrolabe'),
      ),
    ),
    astrolabePrice: v.optional(v.float64()),
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

  ContactMessage: defineTable({
    userId: v.string(),
    subject: v.string(),
    message: v.string(),
    status: v.optional(
      v.union(
        v.literal('pending'),
        v.literal('inDevelopmentQueue'),
        v.literal('starred'),
        v.literal('highPriority'),
        v.literal('lowPriority'),
        v.literal('addressed'),
      ),
    ),
    updatedAt: v.optional(v.float64()),
  })
    .index('by_user_id', ['userId'])
    .index('by_status', ['status']),

  UserSettings: defineTable({
    userId: v.string(),
    lastAdminLoginTime: v.optional(v.float64()),
  }).index('by_user_id', ['userId']),
})
