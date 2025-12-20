import toast from "react-hot-toast";

// Success Toast
export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 4000,
    position: "top-center",
    style: {
      background: "#10b981",
      color: "#fff",
      padding: "16px",
      borderRadius: "8px",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#10b981",
    },
  });
};

// Error Toast
export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 4000,
    position: "top-center",
    style: {
      background: "#ef4444",
      color: "#fff",
      padding: "16px",
      borderRadius: "8px",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#ef4444",
    },
  });
};

// Loading Toast
export const showLoadingToast = (message) => {
  return toast.loading(message, {
    position: "top-center",
    style: {
      background: "#3b82f6",
      color: "#fff",
      padding: "16px",
      borderRadius: "8px",
    },
  });
};

// Dismiss Toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};