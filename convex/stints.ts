import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

// Create a new stint
export const createStint = mutation({
  args: {
    sessionId: v.id('FarmingSession'),
    userId: v.string(),
    startTime: v.float64(),
    endTime: v.float64(),
    duration: v.float64(),
    pausedDuration: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()

    const stintId = await ctx.db.insert('Stint', {
      sessionId: args.sessionId,
      userId: args.userId,
      startTime: args.startTime,
      endTime: args.endTime,
      duration: args.duration,
      createdAt: now,
      updatedAt: now,
    })

    return stintId
  },
})

// Get all stints for a specific session and user
export const getStintsBySession = query({
  args: {
    sessionId: v.id('FarmingSession'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('Stint')
      .withIndex('by_user_session', (q) =>
        q.eq('userId', args.userId).eq('sessionId', args.sessionId),
      )
      .order('desc') // Most recent first
      .collect()
  },
})

// Delete a stint
export const deleteStint = mutation({
  args: {
    stintId: v.id('Stint'),
    userId: v.string(), // Ensure user can only delete their own stints
  },
  handler: async (ctx, args) => {
    // First, verify the stint belongs to the user
    const stint = await ctx.db.get(args.stintId)

    if (!stint) {
      throw new Error('Stint not found')
    }

    if (stint.userId !== args.userId) {
      throw new Error('Unauthorized: You can only delete your own stints')
    }

    await ctx.db.delete(args.stintId)
    return { success: true }
  },
})

// Get total farming time for a session
export const getTotalFarmingTime = query({
  args: {
    sessionId: v.id('FarmingSession'),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const stints = await ctx.db
      .query('Stint')
      .withIndex('by_user_session', (q) =>
        q.eq('userId', args.userId).eq('sessionId', args.sessionId),
      )
      .collect()

    const totalDuration = stints.reduce((sum, stint) => sum + (stint.duration || 0), 0)

    return {
      totalDuration: totalDuration / 1000, // Convert to seconds
      stintCount: stints.length,
    }
  },
})
