"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/fetchWithAuth";

// Loads one folder and the path to it, for the folder page and its breadcrumb
export const useFolderDetails = (folderId) => {
  const [folder, setFolder] = useState(null);
  const [path, setPath] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(folderId));
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    // The root level has no folder to load, so it resolves immediately
    if (!folderId) {
      setFolder(null);
      setPath([]);
      setIsLoading(false);
      setIsNotFound(false);
      return;
    }

    setIsLoading(true);
    setIsNotFound(false);
    setError(null);

    try {
      const response = await api.get(`/api/folders/${folderId}`);
      const data = await response.json();

      if (response.status === 404) {
        setIsNotFound(true);
        return;
      }

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to load this folder");
      }

      setFolder(data.folder);
      setPath(data.path || []);
    } catch (err) {
      console.error("Error loading folder:", err);

      // A dead session already redirects to login inside fetchWithAuth
      if (err.message !== "Session expired") {
        setError(err.message || "Failed to load this folder");
      }
    } finally {
      setIsLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    load();
  }, [load]);

  return { folder, path, isLoading, isNotFound, error, refresh: load };
};