import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const updateLastAdminLogin = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user settings already exist
    const existingSettings = await ctx.db
      .query('UserSettings')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first()

    const now = Date.now()

    if (existingSettings) {
      // Update existing settings
      await ctx.db.patch(existingSettings._id, {
        lastAdminLoginTime: now,
      })
    } else {
      // Create new settings
      await ctx.db.insert('UserSettings', {
        userId: args.userId,
        lastAdminLoginTime: now,
      })
    }

    return { success: true, timestamp: now }
  },
})

export const getLastAdminLogin = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query('UserSettings')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first()

    return settings?.lastAdminLoginTime || null
  },
})

export const getUserSettings = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('UserSettings')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .first()
  },
})
