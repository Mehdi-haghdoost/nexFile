import { useState, useEffect } from "react";
import useFoldersStore from "@/store/features/folders/foldersStore";
import { showErrorToast } from "@/lib/toast";

export const useFolders = (parentFolder = null) => {
  const { folders, setFolders, setLoading, setError } = useFoldersStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      setIsInitialLoading(true);

      try {
        const params = new URLSearchParams();
        if (parentFolder) {
          params.append("parentFolder", parentFolder);
        }

        const response = await fetch(`/api/folders?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch folders");
        }

        setFolders(data.folders);
      } catch (error) {
        const errorMessage = error.message || "Failed to fetch folders";
        setError(errorMessage);
        showErrorToast(errorMessage);
      } finally {
        setLoading(false);
        setIsInitialLoading(false);
      }
    };

    fetchFolders();
  }, [parentFolder, setFolders, setLoading, setError]);

  return {
    folders,
    isLoading: isInitialLoading,
  };
};