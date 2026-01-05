// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import useAuthStore from "@/store/auth/authStore";

// export const useAuth = (options = {}) => {
//   const { requireAuth = true, redirectTo = "/login-register" } = options;
//   const router = useRouter();
//   const { user, setUser, clearAuth } = useAuthStore();
//   const [isLoading, setIsLoading] = useState(true);
//   const checkInProgress = useRef(false);
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       if (checkInProgress.current) {
//         return;
//       }

//       checkInProgress.current = true;

//       try {
//         const response = await fetch("/api/auth/me", {
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUser(data.user);
//           return true;
//         } else if (response.status === 401) {
//           const refreshResponse = await fetch("/api/auth/refresh", {
//             method: "POST",
//             credentials: "include",
//             headers: {
//               "Content-Type": "application/json",
//             },
//           });

//           if (refreshResponse.ok) {
//             const refreshData = await refreshResponse.json();
//             setUser(refreshData.user);
//             return true;
//           } else {
//             clearAuth();
//             if (requireAuth) {
//               router.push(redirectTo);
//             }
//             return false;
//           }
//         } else {
//           clearAuth();
//           if (requireAuth) {
//             router.push(redirectTo);
//           }
//           return false;
//         }
//       } catch (error) {
//         console.error("Auth check error:", error);
//         clearAuth();
//         if (requireAuth) {
//           router.push(redirectTo);
//         }
//         return false;
//       } finally {
//         setIsLoading(false);
//         checkInProgress.current = false;
//       }
//     };

//     checkAuth();

//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }

//     intervalRef.current = setInterval(() => {
//       checkAuth();
//     }, 10 * 60 * 1000);

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//     };
//   }, [requireAuth, redirectTo, router, setUser, clearAuth]);

//   return {
//     user,
//     isLoading,
//     isAuthenticated: !!user,
//   };
// };

"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth/authStore";

/**
 * Custom hook for authentication management
 * 
 * Features:
 * - Initial authentication check
 * - Automatic token refresh on 401 errors
 * - Periodic authentication validation (every 5 seconds for testing)
 * - Automatic redirect on authentication failure
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireAuth - If true, redirect to login on auth failure
 * @param {string} options.redirectTo - URL to redirect to on auth failure
 * @returns {Object} - { user, isLoading, isAuthenticated }
 */
export const useAuth = (options = {}) => {
  const { requireAuth = true, redirectTo = "/login-register" } = options;
  const router = useRouter();
  const { user, setUser, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const checkInProgress = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    /**
     * Check authentication status
     * 
     * Process:
     * 1. Call /api/auth/me to verify access token
     * 2. If 401, attempt to refresh token
     * 3. If refresh succeeds, update user state
     * 4. If refresh fails, clear auth and redirect
     */
    const checkAuth = async () => {
      if (checkInProgress.current) {
        return;
      }

      checkInProgress.current = true;

      try {
        // Check if access token is valid
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          return true;
        } else if (response.status === 401) {
          // Access token expired, try to refresh
          const refreshResponse = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            setUser(refreshData.user);
            return true;
          } else {
            // Refresh failed, clear auth and redirect
            clearAuth();
            if (requireAuth) {
              router.push(redirectTo);
            }
            return false;
          }
        } else {
          // Unexpected error
          clearAuth();
          if (requireAuth) {
            router.push(redirectTo);
          }
          return false;
        }
      } catch (error) {
        console.error("Auth check error:", error);
        clearAuth();
        if (requireAuth) {
          router.push(redirectTo);
        }
        return false;
      } finally {
        setIsLoading(false);
        checkInProgress.current = false;
      }
    };

    // Initial auth check on component mount
    checkAuth();

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Production interval
    intervalRef.current = setInterval(() => {
      checkAuth();
    }, 10 * 60 * 1000);  // 10 minutes

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [requireAuth, redirectTo, router, setUser, clearAuth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};
