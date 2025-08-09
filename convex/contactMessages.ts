import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const submitContactMessage = mutation({
  args: {
    userId: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the user's latest 2 contact messages
    const recentMessages = await ctx.db
      .query('ContactMessage')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .order('desc')
      .take(2)

    // Check if user has already sent 2 messages today
    if (recentMessages.length >= 2) {
      const today = new Date()
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

      const todayMessages = recentMessages.filter((msg) => {
        const msgDate = new Date(msg._creationTime)
        return msgDate >= todayStart && msgDate < todayEnd
      })

      if (todayMessages.length >= 2) {
        throw new Error(
          'You have reached the daily limit of 2 messages. Please try again tomorrow to prevent spam.',
        )
      }
    }

    // Insert the new contact message
    await ctx.db.insert('ContactMessage', {
      userId: args.userId,
      subject: args.subject,
      message: args.message,
      status: 'pending',
      updatedAt: Date.now(),
    })

    return { success: true, message: 'Your message has been sent successfully!' }
  },
})

export const getUserContactMessages = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('ContactMessage')
      .withIndex('by_user_id', (q) => q.eq('userId', args.userId))
      .order('desc')
      .collect()
  },
})

export const getAllContactMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('ContactMessage').order('desc').collect()
  },
})

export const getContactMessagesByStatus = query({
  args: {
    status: v.union(
      v.literal('pending'),
      v.literal('inDevelopmentQueue'),
      v.literal('starred'),
      v.literal('highPriority'),
      v.literal('lowPriority'),
      v.literal('addressed'),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('ContactMessage')
      .withIndex('by_status', (q) => q.eq('status', args.status))
      .order('desc')
      .collect()
  },
})

export const updateMessageStatus = mutation({
  args: {
    messageId: v.id('ContactMessage'),
    status: v.union(
      v.literal('pending'),
      v.literal('inDevelopmentQueue'),
      v.literal('starred'),
      v.literal('highPriority'),
      v.literal('lowPriority'),
      v.literal('addressed'),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      status: args.status,
      updatedAt: Date.now(),
    })

    return { success: true }
  },
})

export const getNewContactMessagesCount = query({
  args: {
    lastAdminLoginTime: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    // If no last login time provided, count all pending messages
    if (!args.lastAdminLoginTime) {
      const pendingMessages = await ctx.db
        .query('ContactMessage')
        .withIndex('by_status', (q) => q.eq('status', 'pending'))
        .collect()
      return pendingMessages.length
    }

    const newMessages = await ctx.db
      .query('ContactMessage')
      .withIndex('by_creation_time', (q) => q.gt('_creationTime', args.lastAdminLoginTime!))
      .collect()
    return newMessages.length
  },
})
