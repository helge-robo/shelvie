import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db, schema } from '../db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: false,
      },
      bio: {
        type: 'string',
        required: false,
      },
      tiktokHandle: {
        type: 'string',
        required: false,
      },
      instagramHandle: {
        type: 'string',
        required: false,
      },
      linkedinHandle: {
        type: 'string',
        required: false,
      },
      blueskyHandle: {
        type: 'string',
        required: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  baseURL: process.env.APP_URL || 'http://localhost:3000',
  trustedOrigins: [process.env.APP_URL || 'http://localhost:3000'],
})
