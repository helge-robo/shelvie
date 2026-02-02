export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, isLoading } = useAuth()

  // Wait for auth to load
  if (isLoading.value) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(isLoading, (loading) => {
        if (!loading) {
          unwatch()
          resolve()
        }
      })
    })
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
