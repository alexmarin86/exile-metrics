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
