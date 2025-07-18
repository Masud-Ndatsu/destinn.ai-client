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
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  getToken: () => string | null;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Set user and update authentication state
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user && !user.isGuest,
        });
      },

      // Login handler
      login: (userData) => {
        console.log("🏪 Auth Store - Login called with:", {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          isGuest: userData.isGuest,
          hasToken: !!userData.accessToken
        });
        
        set({
          user: userData,
          isAuthenticated: true,
        });
        
        // Store token in localStorage
        if (userData.accessToken) {
          localStorage.setItem("token", userData.accessToken);
          console.log("🔑 Token stored in localStorage");
        } else {
          console.warn("⚠️ No access token provided to login handler");
        }
        
        console.log("✅ Auth state updated successfully");
      },

      // Logout handler
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
        // Clear token from localStorage
        localStorage.removeItem("token");
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Get token from localStorage or user state
      getToken: () => {
        const state = get();
        return state.user?.accessToken || localStorage.getItem("token");
      },

      // Set token in localStorage and user state
      setToken: (token: string | null) => {
        if (token) {
          localStorage.setItem("token", token);
        } else {
          localStorage.removeItem("token");
        }
        
        const state = get();
        if (state.user) {
          set({
            user: { ...state.user, accessToken: token || undefined }
          });
        }
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
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthToken = () => useAuthStore((state) => state.getToken());
