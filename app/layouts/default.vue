<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-border">
      <nav class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-semibold tracking-tight">
          BookShelf
        </NuxtLink>

        <div class="flex items-center gap-4">
          <template v-if="isAuthenticated">
            <NuxtLink
              to="/dashboard"
              class="text-sm text-muted hover:text-foreground transition-colors"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/dashboard/search"
              class="text-sm text-muted hover:text-foreground transition-colors"
            >
              Add Books
            </NuxtLink>
            <NuxtLink
              :to="`/@${user?.username}`"
              class="text-sm text-muted hover:text-foreground transition-colors"
            >
              My Shelf
            </NuxtLink>
            <button
              @click="handleSignOut"
              class="text-sm text-muted hover:text-foreground transition-colors"
            >
              Sign Out
            </button>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </NuxtLink>
          </template>
        </div>
      </nav>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-border py-8">
      <div class="max-w-6xl mx-auto px-4 text-center text-sm text-muted">
        <p>BookShelf - Share what you're reading</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { user, isAuthenticated, signOut } = useAuth()

const handleSignOut = async () => {
  await signOut()
  navigateTo('/')
}
</script>
