import { useEffect, useState } from "react";
import useFoldersStore from "@/store/features/folders/foldersStore";
import { showErrorToast } from "@/lib/toast";

export const useFolders = (parentFolder = null) => {
  const folders = useFoldersStore((state) => state.folders);
  const error = useFoldersStore((state) => state.error);
  const fetchFolders = useFoldersStore((state) => state.fetchFolders);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
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
  }, [parentFolder, fetchFolders]);

  return {
    folders,
    isLoading: isInitialLoading,
    error,
  };
};