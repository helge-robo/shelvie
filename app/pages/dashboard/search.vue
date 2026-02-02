<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="mb-8">
      <h1 class="text-2xl font-bold">Add Books</h1>
      <p class="text-muted mt-1">Search for books to add to your shelves</p>
    </div>

    <!-- Search input -->
    <div class="relative mb-8">
      <input
        v-model="query"
        @input="debouncedSearch"
        type="text"
        placeholder="Search by title, author, or ISBN..."
        class="w-full px-4 py-3 pl-12 border border-border rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <svg class="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- Loading state -->
    <div v-if="isSearching" class="text-center py-12">
      <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-muted mt-2">Searching...</p>
    </div>

    <!-- Results -->
    <div v-else-if="results.length > 0" class="space-y-4">
      <div
        v-for="book in results"
        :key="book.externalId"
        class="flex gap-4 p-4 border border-border rounded-xl hover:border-primary/50 transition-colors"
      >
        <img
          :src="book.imageUrl || '/placeholder-book.svg'"
          :alt="book.title"
          class="w-20 h-28 object-cover rounded-lg shadow-sm flex-shrink-0"
        />
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold truncate">{{ book.title }}</h3>
          <p class="text-sm text-muted">{{ book.creator }}</p>
          <p v-if="book.firstPublishYear" class="text-xs text-muted mt-1">{{ book.firstPublishYear }}</p>

          <!-- Add to shelf -->
          <div class="mt-3">
            <select
              v-model="selectedShelf[book.externalId]"
              @change="addToShelf(book)"
              class="px-3 py-1.5 text-sm border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="" disabled>Add to shelf...</option>
              <option v-for="shelf in shelves" :key="shelf.id" :value="shelf.id">
                {{ shelf.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="query && !isSearching" class="text-center py-12">
      <p class="text-muted">No books found for "{{ query }}"</p>
    </div>

    <!-- Initial state -->
    <div v-else class="text-center py-20">
      <div class="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="font-semibold text-lg">Search for books</h3>
      <p class="text-muted mt-1">Enter a title, author, or ISBN to find books</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

interface Book {
  externalId: string
  title: string
  creator: string
  imageUrl: string | null
  isbn: string | null
  firstPublishYear?: number
}

const query = ref('')
const results = ref<Book[]>([])
const isSearching = ref(false)
const shelves = ref<any[]>([])
const selectedShelf = ref<Record<string, string>>({})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(search, 300)
}

const search = async () => {
  if (!query.value.trim()) {
    results.value = []
    return
  }

  isSearching.value = true
  try {
    const data = await $fetch('/api/books/search', {
      query: { q: query.value },
    })
    results.value = data as Book[]
  } catch (e) {
    console.error('Search failed:', e)
    results.value = []
  } finally {
    isSearching.value = false
  }
}

const fetchShelves = async () => {
  try {
    const data = await $fetch('/api/shelves')
    shelves.value = data as any[]
  } catch (e) {
    console.error('Failed to fetch shelves:', e)
  }
}

const addToShelf = async (book: Book) => {
  const shelfId = selectedShelf.value[book.externalId]
  if (!shelfId) return

  try {
    await $fetch(`/api/shelves/${shelfId}/items`, {
      method: 'POST',
      body: {
        externalId: book.externalId,
        title: book.title,
        creator: book.creator,
        imageUrl: book.imageUrl,
        isbn: book.isbn,
        mediaType: 'book',
      },
    })

    // Reset selection and show feedback
    selectedShelf.value[book.externalId] = ''
    alert(`Added "${book.title}" to shelf!`)
  } catch (e) {
    console.error('Failed to add to shelf:', e)
    alert('Failed to add book to shelf')
  }
}

onMounted(fetchShelves)

useHead({
  title: 'Add Books - BookShelf',
})
</script>
