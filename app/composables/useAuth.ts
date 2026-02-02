import { createAuthClient } from 'better-auth/vue'

const authClient = createAuthClient({
  baseURL: import.meta.client ? `${window.location.origin}/api/auth` : 'http://localhost:3000/api/auth',
})

export const useAuth = () => {
  const session = authClient.useSession()

  return {
    session,
    signIn: authClient.signIn,
    signOut: authClient.signOut,
    user: computed(() => session.value?.data?.user),
    isAuthenticated: computed(() => !!session.value?.data?.user),
    isLoading: computed(() => session.value?.isPending),
  }
}
