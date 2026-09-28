import { useEffect, useState } from "react";
import useFoldersStore, { getFolderCacheKey } from "@/store/features/folders/foldersStore";
import { showErrorToast } from "@/lib/toast";

// Shared so an unfetched level returns the same reference every render
const EMPTY_FOLDERS = [];

export const useFolders = (parentFolder = null, options = {}) => {
  const { enabled = true } = options;

  const key = getFolderCacheKey(parentFolder);
  const foldersByParent = useFoldersStore((state) => state.foldersByParent);
  const error = useFoldersStore((state) => state.error);
  const fetchFolders = useFoldersStore((state) => state.fetchFolders);

  const folders = foldersByParent[key] || EMPTY_FOLDERS;

  // Starts false when disabled, so a collapsed tree node renders nothing rather than a spinner
  const [isInitialLoading, setIsInitialLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const loadFolders = async () => {
      setIsInitialLoading(true);

      // Deduplicated in the store, so parallel mounts share one request.
      const result = await fetchFolders(parentFolder);

      if (cancelled) return;

      if (!result.success && result.error) {
        showErrorToast(result.error);
      }

      setIsInitialLoading(false);
    };

    loadFolders();

    return () => {
      cancelled = true;
    };
  }, [parentFolder, enabled, fetchFolders]);

  return {
    folders,
    isLoading: isInitialLoading,
    error,
    refetch: () => fetchFolders(parentFolder, { force: true }),
  };
};