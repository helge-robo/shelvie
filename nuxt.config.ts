// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
  },
  future: {
    compatibilityVersion: 4
  },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },
  runtimeConfig: {
    // Server-only
    databaseUrl: process.env.DATABASE_URL || '',
    betterAuthSecret: process.env.BETTER_AUTH_SECRET || '',
    tiktokClientId: process.env.TIKTOK_CLIENT_ID || '',
    tiktokClientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
    instagramClientId: process.env.INSTAGRAM_CLIENT_ID || '',
    instagramClientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
    linkedinClientId: process.env.LINKEDIN_CLIENT_ID || '',
    linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    // Public
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    }
  },
  nitro: {
    experimental: {
      asyncContext: true,
    }
  },
  routeRules: {
    '/api/**': { cors: true },
  }
})
