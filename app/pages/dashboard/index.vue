<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold">Your Shelves</h1>
        <p class="text-muted mt-1">Manage and organize your book collections</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        New Shelf
      </button>
    </div>

    <!-- Shelves list -->
    <div v-if="shelves.length > 0" class="space-y-4">
      <div
        v-for="shelf in shelves"
        :key="shelf.id"
        class="border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="font-semibold text-lg">{{ shelf.name }}</h3>
            <p class="text-sm text-muted mt-1">{{ shelf.itemCount || 0 }} books</p>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink
              :to="`/dashboard/shelves/${shelf.id}`"
              class="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-foreground/5 transition-colors"
            >
              Edit
            </NuxtLink>
            <NuxtLink
              :to="`/@${user?.username}/${shelf.slug}`"
              class="px-3 py-1.5 text-sm text-primary hover:underline"
            >
              View
            </NuxtLink>
          </div>
        </div>

        <!-- Book covers preview -->
        <div v-if="shelf.items?.length" class="flex gap-2 mt-4">
          <img
            v-for="item in shelf.items.slice(0, 6)"
            :key="item.id"
            :src="item.imageUrl || '/placeholder-book.svg'"
            :alt="item.title"
            class="w-12 h-16 object-cover rounded shadow-sm"
          />
          <div
            v-if="shelf.items.length > 6"
            class="w-12 h-16 bg-foreground/5 rounded flex items-center justify-center text-sm text-muted"
          >
            +{{ shelf.items.length - 6 }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-20 border border-dashed border-border rounded-xl">
      <div class="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h3 class="font-semibold text-lg">No shelves yet</h3>
      <p class="text-muted mt-1">Create your first shelf to start adding books</p>
      <button
        @click="showCreateModal = true"
        class="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Create Shelf
      </button>
    </div>

    <!-- Create shelf modal -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="showCreateModal = false"
      >
        <div class="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4">
          <h2 class="text-xl font-bold mb-4">Create New Shelf</h2>
          <form @submit.prevent="createShelf">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Name</label>
                <input
                  v-model="newShelfName"
                  type="text"
                  placeholder="e.g., Currently Reading"
                  class="w-full px-4 py-2 border border-border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="showCreateModal = false"
                class="px-4 py-2 text-sm hover:bg-foreground/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isCreating"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {{ isCreating ? 'Creating...' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { user } = useAuth()

const shelves = ref<any[]>([])
const showCreateModal = ref(false)
const newShelfName = ref('')
const isCreating = ref(false)

const fetchShelves = async () => {
  try {
    const data = await $fetch('/api/shelves')
    shelves.value = data as any[]
  } catch (e) {
    console.error('Failed to fetch shelves:', e)
  }
}

const createShelf = async () => {
  if (!newShelfName.value.trim()) return

  isCreating.value = true
  try {
    await $fetch('/api/shelves', {
      method: 'POST',
      body: { name: newShelfName.value.trim() },
    })
    newShelfName.value = ''
    showCreateModal.value = false
    await fetchShelves()
  } catch (e) {
    console.error('Failed to create shelf:', e)
  } finally {
    isCreating.value = false
  }
}

onMounted(fetchShelves)

useHead({
  title: 'Dashboard - BookShelf',
})
</script>
