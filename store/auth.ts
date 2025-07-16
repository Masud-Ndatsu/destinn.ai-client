// store/auth.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserRole } from "@/enum";

// Define the user interface
export interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  educationLevel?: string;
  experienceYears?: number;
  interests?: string[];
  isGuest: boolean;
  role?: UserRole;
  accessToken?: string; // Optional token for authenticated users
}

// Define the auth store interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // Set user and update authentication state
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user && !user.isGuest,
        });
      },

      // Login handler
      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
        });
      },

      // Logout handler
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // LocalStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }), // Only persist user
    }
  )
);

// Helper hooks for common use cases
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useIsAdmin = () =>
  useAuthStore((state) => state.user?.role === UserRole.ADMIN);
// export const useHasHydrated = () =>
//   useAuthStore((state) => state.persist.hasHydrated);
