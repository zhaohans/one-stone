import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import * as toastUtils from "./toast-utils";

declare global {
  interface Window {
    notificationService?: {
      createNotification?: (n: { title: string; body: string }) => void;
      notifyAdmin?: (n: { title: string; body: string }) => void;
    };
  }
}

export const useToast = () => {
  const context = useContext(toastUtils.ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<toastUtils.Toast[]>([]);

  const addToast = useCallback((toast: Omit<toastUtils.Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <toastUtils.ToastContext.Provider
      value={{ toasts, addToast, removeToast, clearToasts }}
    >
      {children}
      <ToastContainer />
    </toastUtils.ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: toastUtils.Toast; onRemove: (id: string) => void }> = ({
  toast,
  onRemove,
}) => {
  const Icon = toastUtils.toastIcons[toast.type];

  return (
    <div
      className={cn(
        "flex items-start p-4 rounded-lg border shadow-lg transition-all duration-300 ease-in-out",
        toastUtils.toastStyles[toast.type],
      )}
    >
      <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{toast.title}</h4>
        {toast.message && (
          <p className="text-sm mt-1 opacity-90">{toast.message}</p>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="text-sm font-medium underline mt-2 hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export function useSuccessToast() {
  const { addToast } = useToast();
  return (title: string, message?: string) =>
    addToast({ type: "success", title, message });
}

export function useErrorToast() {
  const { addToast } = useToast();
  return (title: string, message?: string, options?: { code?: string; duration?: number; notifyAdmin?: boolean }) => {
    const duration = options?.duration ?? 15000; // 15s default for errors
    addToast({ type: "error", title, message, duration });
    // Add to notification center
    if (options?.code || options?.notifyAdmin) {
      // Send to notification center (in-app)
      if (window.notificationService && typeof window.notificationService.createNotification === 'function') {
        window.notificationService.createNotification({
          title: `Error: ${title}`,
          body: `${options?.code ? `[${options.code}] ` : ''}${message || ''}`,
        });
      }
      // Send to admin (email or special notification)
      if (options?.notifyAdmin && window.notificationService && typeof window.notificationService.notifyAdmin === 'function') {
        window.notificationService.notifyAdmin({
          title: `Error: ${title}`,
          body: `${options?.code ? `[${options.code}] ` : ''}${message || ''}`,
        });
      }
    }
  };
}

export function useWarningToast() {
  const { addToast } = useToast();
  return (title: string, message?: string) =>
    addToast({ type: "warning", title, message });
}

export function useInfoToast() {
  const { addToast } = useToast();
  return (title: string, message?: string) =>
    addToast({ type: "info", title, message });
}

// (If you have a real toast system, replace this with the actual implementation)
