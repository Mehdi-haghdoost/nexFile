// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import useAuthStore from "@/store/auth/authStore";

// /**
//  * Custom hook for authentication management
//  * 
//  * Features:
//  * - Initial authentication check
//  * - Automatic token refresh on 401 errors
//  * - Periodic authentication validation (every 5 seconds for testing)
//  * - Automatic redirect on authentication failure
//  * 
//  * @param {Object} options - Configuration options
//  * @param {boolean} options.requireAuth - If true, redirect to login on auth failure
//  * @param {string} options.redirectTo - URL to redirect to on auth failure
//  * @returns {Object} - { user, isLoading, isAuthenticated }
//  */
// export const useAuth = (options = {}) => {
//   const { requireAuth = true, redirectTo = "/login-register" } = options;
//   const router = useRouter();
//   const { user, setUser, clearAuth } = useAuthStore();
//   const [isLoading, setIsLoading] = useState(true);
//   const checkInProgress = useRef(false);
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     /**
//      * Check authentication status
//      * 
//      * Process:
//      * 1. Call /api/auth/me to verify access token
//      * 2. If 401, attempt to refresh token
//      * 3. If refresh succeeds, update user state
//      * 4. If refresh fails, clear auth and redirect
//      */
//     const checkAuth = async () => {
//       if (checkInProgress.current) {
//         return;
//       }

//       checkInProgress.current = true;

//       try {
//         // Check if access token is valid
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
//           // Access token expired, try to refresh
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
//             // Refresh failed, clear auth and redirect
//             clearAuth();
//             if (requireAuth) {
//               router.push(redirectTo);
//             }
//             return false;
//           }
//         } else {
//           // Unexpected error
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

//     // Initial auth check on component mount
//     checkAuth();

//     // Clear any existing interval
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }

//     // Production interval
//     intervalRef.current = setInterval(() => {
//       checkAuth();
//     }, 10 * 60 * 1000);  // 10 minutes

//     // Cleanup on unmount
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
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth/authStore";
import { refreshAccessToken } from "@/lib/fetchWithAuth";

/**
 * Proactive refresh interval. Must stay comfortably BELOW the access token
 * lifetime (15 minutes) so the token is rotated before it can expire, rather
 * than after a request has already failed with a 401.
 */
const REFRESH_INTERVAL = 12 * 60 * 1000; // 12 minutes

/** Ignore focus-triggered checks that fire more often than this. */
const MIN_CHECK_GAP = 30 * 1000; // 30 seconds

/**
 * Authentication hook.
 *
 * - Verifies the session on mount
 * - Rotates the access token proactively before it expires
 * - Re-validates when the tab regains focus, since timers are throttled or
 *   suspended while a tab is in the background
 * - Shares the refresh lock in fetchWithAuth, so a hook-initiated refresh and a
 *   request-initiated refresh never burn the same token twice
 */
export const useAuth = (options = {}) => {
  const { requireAuth = true, redirectTo = "/login-register" } = options;

  const router = useRouter();
  const { user, setUser, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const checkInProgress = useRef(false);
  const lastCheckedAt = useRef(0);
  const intervalRef = useRef(null);
  const isMounted = useRef(true);

  const handleAuthFailure = useCallback(() => {
    clearAuth();
    if (requireAuth) {
      router.push(redirectTo);
    }
  }, [clearAuth, requireAuth, redirectTo, router]);

  /**
   * @param {boolean} forceRefresh - rotate the token even if it is still valid.
   *   Used by the periodic timer to stay ahead of expiry.
   */
  const checkAuth = useCallback(
    async (forceRefresh = false) => {
      if (checkInProgress.current) return;

      checkInProgress.current = true;
      lastCheckedAt.current = Date.now();

      try {
        if (forceRefresh) {
          const data = await refreshAccessToken();
          if (isMounted.current) setUser(data.user);
          return;
        }

        const response = await fetch("/api/auth/me", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          if (isMounted.current) setUser(data.user);
          return;
        }

        if (response.status === 401) {
          // Access token gone or expired; the refresh cookie may still be valid.
          const data = await refreshAccessToken();
          if (isMounted.current) setUser(data.user);
          return;
        }

        handleAuthFailure();
      } catch (error) {
        console.error("Auth check error:", error);
        handleAuthFailure();
      } finally {
        if (isMounted.current) setIsLoading(false);
        checkInProgress.current = false;
      }
    },
    [setUser, handleAuthFailure]
  );

  useEffect(() => {
    isMounted.current = true;

    checkAuth();

    intervalRef.current = setInterval(() => {
      // Force rotation so the token never reaches its expiry in the first place.
      checkAuth(true);
    }, REFRESH_INTERVAL);

    /**
     * Background tabs have their timers throttled, so a tab left open for hours
     * can come back with a long-dead token. Re-validate on return to focus.
     */
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastCheckedAt.current < MIN_CHECK_GAP) return;
      checkAuth();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted.current = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [checkAuth]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refresh: () => checkAuth(true),
  };
};