"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/fetchWithAuth";

// Every mounted instance, as { folderId, apply, settle }; the sidebar and the page each hold one
const mountedInstances = new Set();

// Newest request number per folder, shared by loads and silent refreshes
const latestRequestIds = new Map();

// Starts a request for a folder and returns a check for whether it is still the newest
const startRequest = (folderId) => {
  const requestId = (latestRequestIds.get(folderId) || 0) + 1;
  latestRequestIds.set(folderId, requestId);

  return () => latestRequestIds.get(folderId) === requestId;
};

// Fetches a folder's details for a silent refresh; returns null when a newer request has taken over
const fetchLatestDetails = async (folderId) => {
  const isLatest = startRequest(folderId);

  const response = await api.get(`/api/folders/${folderId}`);
  const data = await response.json();

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to load this folder");
  }

  return isLatest() ? data : null;
};

// Hands a result to every mounted instance showing that folder, so none is left waiting on a superseded load
const publishDetails = (folderId, data) => {
  mountedInstances.forEach((instance) => {
    if (instance.folderId === folderId) instance.apply(data);
  });
};

// Refreshes the open folder's own record (counts, size) everywhere it is shown, without a loading state
export const refreshFolderDetails = async () => {
  // One request per distinct folder, however many instances show it
  const folderIds = new Set([...mountedInstances].map((instance) => instance.folderId));

  await Promise.all(
    [...folderIds].map(async (folderId) => {
      try {
        const data = await fetchLatestDetails(folderId);
        if (!data) return;

        publishDetails(folderId, data);
      } catch (err) {
        // The shown values stay as they were, and a load this refresh superseded still ends
        mountedInstances.forEach((instance) => {
          if (instance.folderId === folderId) instance.settle();
        });

        if (err.message !== "Session expired") {
          console.error("Error refreshing folder:", err);
        }
      }
    })
  );
};

// Loads one folder and the path to it, for the folder page and its breadcrumb
export const useFolderDetails = (folderId) => {
  const [folder, setFolder] = useState(null);
  const [path, setPath] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(folderId));
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState(null);

  // The folder the hook points at now, so a response for an earlier one is dropped
  const currentFolderId = useRef(folderId);
  currentFolderId.current = folderId;

  const load = useCallback(async () => {
    // The root level has no folder to load, so it resolves immediately
    if (!folderId) {
      setFolder(null);
      setPath([]);
      setIsLoading(false);
      setIsNotFound(false);
      return;
    }

    const isLatest = startRequest(folderId);
    const isCurrent = () => currentFolderId.current === folderId && isLatest();

    setIsLoading(true);
    setIsNotFound(false);
    setError(null);

    try {
      const response = await api.get(`/api/folders/${folderId}`);
      const data = await response.json();

      // A newer request owns this folder now, so this older result is dropped
      if (!isLatest()) return;

      if (response.status === 404) {
        if (currentFolderId.current === folderId) setIsNotFound(true);
        return;
      }

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Failed to load this folder");
      }

      // Published to every instance of this folder, since a superseded load will never apply its own
      publishDetails(folderId, data);
    } catch (err) {
      if (!isCurrent()) return;

      console.error("Error loading folder:", err);

      // A dead session already redirects to login inside fetchWithAuth
      if (err.message !== "Session expired") {
        setError(err.message || "Failed to load this folder");
      }
    } finally {
      // Only the newest request for the folder in view ends the loading state
      if (isCurrent()) setIsLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    load();
  }, [load]);

  // Registers while mounted for this folder, so a refresh from anywhere reaches this instance
  useEffect(() => {
    if (!folderId) return undefined;

    const instance = {
      folderId,
      apply: (data) => {
        setFolder(data.folder);
        setPath(data.path || []);
        setIsLoading(false);
        setIsNotFound(false);
        setError(null);
      },
      settle: () => setIsLoading(false),
    };

    mountedInstances.add(instance);
    return () => mountedInstances.delete(instance);
  }, [folderId]);

  // Applies an action's result without a refetch, keeping the breadcrumb's last entry in step
  const applyUpdate = useCallback((updates) => {
    setFolder((prev) => (prev ? { ...prev, ...updates } : prev));

    if (updates.name) {
      setPath((prev) =>
        prev.map((entry) =>
          entry.id === folderId ? { ...entry, name: updates.name } : entry
        )
      );
    }
  }, [folderId]);

  return { folder, path, isLoading, isNotFound, error, applyUpdate, refresh: load };
};