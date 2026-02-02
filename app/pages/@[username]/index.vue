<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <!-- Profile header -->
    <div v-if="profile" class="text-center mb-12">
      <img
        :src="profile.image || '/default-avatar.svg'"
        :alt="profile.name"
        class="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <h1 class="text-2xl font-bold">{{ profile.name }}</h1>
      <p class="text-muted">@{{ profile.username }}</p>
      <p v-if="profile.bio" class="mt-3 max-w-md mx-auto text-muted">{{ profile.bio }}</p>
    </div>

    <!-- Shelves -->
    <div v-if="shelves.length > 0" class="space-y-12">
      <div v-for="shelf in shelves" :key="shelf.id">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">{{ shelf.name }}</h2>
          <NuxtLink
            v-if="shelf.items.length > 6"
            :to="`/@${username}/${shelf.slug}`"
            class="text-sm text-primary hover:underline"
          >
            View all
          </NuxtLink>
        </div>

        <!-- Book grid -->
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          <div
            v-for="item in shelf.items.slice(0, 6)"
            :key="item.id"
            class="group cursor-pointer"
            @click="selectedBook = item"
          >
            <img
              :src="item.imageUrl || '/placeholder-book.svg'"
              :alt="item.title"
              class="w-full aspect-[2/3] object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
            />
            <p class="mt-2 text-sm font-medium truncate">{{ item.title }}</p>
            <p class="text-xs text-muted truncate">{{ item.creator }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-20">
      <p class="text-muted">This shelf is empty</p>
    </div>

    <!-- Book detail modal -->
    <Teleport to="body">
      <div
        v-if="selectedBook"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="selectedBook = null"
      >
        <div class="bg-background border border-border rounded-2xl p-6 w-full max-w-lg relative">
          <div class="flex gap-6">
            <img
              :src="selectedBook.imageUrl || '/placeholder-book.svg'"
              :alt="selectedBook.title"
              class="w-32 h-48 object-cover rounded-lg shadow-md flex-shrink-0"
            />
            <div class="flex-1">
              <h2 class="text-xl font-bold">{{ selectedBook.title }}</h2>
              <p class="text-muted">{{ selectedBook.creator }}</p>

              <div v-if="selectedBook.rating" class="mt-3 flex items-center gap-1">
                <svg
                  v-for="i in 5"
                  :key="i"
                  class="w-4 h-4"
                  :class="i <= selectedBook.rating ? 'text-yellow-500' : 'text-muted/30'"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              <p v-if="selectedBook.personalNote" class="mt-4 text-sm italic text-muted">
                "{{ selectedBook.personalNote }}"
              </p>

              <!-- Buy links -->
              <div v-if="selectedBook.isbn" class="mt-6 flex gap-2">
                <a
                  :href="`https://bookshop.org/search?keywords=${selectedBook.isbn}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-foreground/5 transition-colors"
                >
                  Bookshop.org
                </a>
                <a
                  :href="`https://www.amazon.com/s?k=${selectedBook.isbn}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-foreground/5 transition-colors"
                >
                  Amazon
                </a>
              </div>
            </div>
          </div>
          <button
            @click="selectedBook = null"
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-foreground/5 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const username = computed(() => (route.params.username as string).replace('@', ''))

const profile = ref<any>(null)
const shelves = ref<any[]>([])
const selectedBook = ref<any>(null)

const fetchProfile = async () => {
  try {
    const data = await $fetch(`/api/users/${username.value}`)
    profile.value = data
  } catch (e) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }
}

const fetchShelves = async () => {
  try {
    const data = await $fetch(`/api/users/${username.value}/shelves`)
    shelves.value = data as any[]
  } catch (e) {
    console.error('Failed to fetch shelves:', e)
  }
}

await Promise.all([fetchProfile(), fetchShelves()])

useHead({
  title: `${profile.value?.name || username.value}'s Shelf - BookShelf`,
  meta: [
    { name: 'description', content: `Check out ${profile.value?.name || username.value}'s book collection on BookShelf.` },
    { property: 'og:title', content: `${profile.value?.name || username.value}'s Shelf` },
    { property: 'og:description', content: `Check out ${profile.value?.name || username.value}'s book collection on BookShelf.` },
    { property: 'og:type', content: 'profile' },
  ]
})
</script>
