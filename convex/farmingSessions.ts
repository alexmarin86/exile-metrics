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

export const updateSessionNotes = mutation({
  args: {
    sessionId: v.id('FarmingSession'),
    userId: v.string(),
    sessionNotes: v.string(),
  },
  handler: async (ctx, args) => {
    // First, verify the session belongs to the user
    const session = await ctx.db.get(args.sessionId)

    if (!session) {
      throw new Error('Session not found')
    }

    if (session.userId !== args.userId) {
      throw new Error('Unauthorized: You can only update your own sessions')
    }

    await ctx.db.patch(args.sessionId, {
      sessionNotes: args.sessionNotes,
      updatedAt: Date.now(),
    })

    return { success: true }
  },
})

export const deleteFarmingSession = mutation({
  args: {
    sessionId: v.id('FarmingSession'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId)

    if (!session) {
      throw new Error('Session not found')
    }

    if (session.userId !== args.userId) {
      throw new Error('Unauthorized: You can only delete your own sessions')
    }

    const stints = await ctx.db
      .query('Stint')
      .withIndex('by_session', (q) => q.eq('sessionId', args.sessionId))
      .collect()

    for (const stint of stints) {
      await ctx.db.delete(stint._id)
    }

    await ctx.db.delete(args.sessionId)

    return { success: true }
  },
})

export const completeSession = mutation({
  args: {
    sessionId: v.id('FarmingSession'),
    userId: v.string(),
    totalReturns: v.float64(),
    divCost: v.float64(),
  },
  handler: async (ctx, args) => {
    // First, verify the session belongs to the user
    const session = await ctx.db.get(args.sessionId)

    if (!session) {
      throw new Error('Session not found')
    }

    if (session.userId !== args.userId) {
      throw new Error('Unauthorized: You can only complete your own sessions')
    }

    if (session.isConcluded) {
      throw new Error('Session is already completed')
    }

    const stints = await ctx.db
      .query('Stint')
      .withIndex('by_session', (q) => q.eq('sessionId', args.sessionId))
      .collect()

    const totalDuration = stints.reduce((sum, stint) => {
      return sum + (stint.duration || 0)
    }, 0)

    await ctx.db.patch(args.sessionId, {
      totalReturns: args.totalReturns,
      divCost: args.divCost,
      totalDuration: totalDuration,
      isConcluded: true,
      updatedAt: Date.now(),
    })

    return { success: true }
  },
})

export const updateSessionInfo = mutation({
  args: {
    sessionId: v.id('FarmingSession'),
    userId: v.string(),
    // session info
    sessionName: v.string(),
    sessionDescription: v.string(),
    // map info
    isRandomMap: v.boolean(),
    mapName: v.optional(v.string()),
    isOriginator: v.boolean(),
    isSelfFarmed: v.boolean(),
    mapCost: v.optional(v.float64()),
    numberOfMaps: v.float64(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId)

    if (!session) {
      throw new Error('Session not found')
    }

    if (session.userId !== args.userId) {
      throw new Error('Unauthorized: You can only update your own sessions')
    }

    await ctx.db.patch(args.sessionId, {
      sessionName: args.sessionName,
      sessionDescription: args.sessionDescription,
      isRandomMap: args.isRandomMap,
      mapName: args.mapName,
      isOriginator: args.isOriginator,
      isSelfFarmed: args.isSelfFarmed,
      mapCost: args.mapCost,
      numberOfMaps: args.numberOfMaps,
      updatedAt: Date.now(),
    })

    return { success: true }
  },
})
