<template>
  <div class="max-w-4xl mx-auto px-4 py-20">
    <div class="text-center space-y-6">
      <h1 class="text-5xl font-bold tracking-tight">
        Your reading list,<br />
        <span class="text-primary">beautifully shared.</span>
      </h1>

      <p class="text-xl text-muted max-w-2xl mx-auto">
        Create a shareable shelf of books you love. Perfect for your TikTok bio,
        LinkedIn profile, or anywhere you want to showcase your reading taste.
      </p>

      <div class="flex items-center justify-center gap-4 pt-4">
        <NuxtLink
          to="/login"
          class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Create Your Shelf
        </NuxtLink>
        <NuxtLink
          to="/@demo"
          class="px-6 py-3 border border-border rounded-lg font-medium hover:bg-foreground/5 transition-colors"
        >
          See Example
        </NuxtLink>
      </div>
    </div>

    <!-- Features -->
    <div class="mt-32 grid md:grid-cols-3 gap-8">
      <div class="space-y-3">
        <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold">Shareable Link</h3>
        <p class="text-muted">Get a clean URL like shelf.app/@you to share anywhere</p>
      </div>

      <div class="space-y-3">
        <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold">Curate Freely</h3>
        <p class="text-muted">Add books manually - no Goodreads sync or permissions needed</p>
      </div>

      <div class="space-y-3">
        <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold">Organize Your Way</h3>
        <p class="text-muted">Create shelves like "Currently Reading" or "All-Time Favorites"</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'BookShelf - Share Your Reading List',
  meta: [
    { name: 'description', content: 'Create a beautiful, shareable shelf of books you love. Perfect for BookTok, LinkedIn, and beyond.' }
  ]
})
</script>
