import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const addNewSession = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const farmingSessionId = await ctx.db.insert('FarmingSession', args)
    return farmingSessionId
  },
})

export const getFarmingSessionByIdAndUser = query({
  args: {
    farmingSessionId: v.id('FarmingSession'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { farmingSessionId, userId } = args
    const session = await ctx.db.get(farmingSessionId)

    if (!session) {
      return null
    }

    if (session.userId !== userId) {
      return null
    }

    return session
  },
})

export const getFarmingSessionsByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args
    const sessions = await ctx.db
      .query('FarmingSession')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .collect()

    return sessions
  },
})
