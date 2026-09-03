import { useEffect } from "react";
import { db } from "@/lib/db";

/**
 * Bootstraps a guest identity so bookmarks/highlights/notes/plan-progress/
 * settings/narrations persist per-device without a login screen.
 */
export function useGuestAuth() {
  const { isLoading, user, error } = db.useAuth();

  useEffect(() => {
    if (!isLoading && !user && !error) {
      db.auth.signInAsGuest();
    }
  }, [isLoading, user, error]);

  return { isLoading: isLoading || !user, user, error };
}
