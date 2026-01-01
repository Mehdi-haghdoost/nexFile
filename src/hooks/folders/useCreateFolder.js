import { useState } from "react";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
  dismissToast,
} from "@/lib/toast";
import { createFolderSchema } from "@/utils/folders/folderValidator";
import useFoldersStore from "@/store/features/folders/foldersStore";

export const useCreateFolder = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const addFolder = useFoldersStore((state) => state.addFolder);

  const createFolder = async (formData) => {
    setValidationErrors({});
    setError(null);

    try {
      createFolderSchema.parse(formData);
    } catch (error) {
      const errors = {};

      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
      }

      setValidationErrors(errors);
      return { success: false, errors };
    }

    setIsLoading(true);
    const toastId = showLoadingToast("Creating folder...");

    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      dismissToast(toastId);

      if (!response.ok) {
        throw new Error(data.message || "Failed to create folder");
      }

      showSuccessToast(`Folder "${data.folder.name}" created successfully!`);

      addFolder(data.folder);

      return { success: true, data };
    } catch (error) {
      dismissToast(toastId);
      const errorMessage = error.message || "Failed to create folder";
      setError(errorMessage);
      showErrorToast(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createFolder,
    validationErrors,
    isLoading,
    error,
  };
};