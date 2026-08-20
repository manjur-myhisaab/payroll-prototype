import React, { createContext, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-xl backdrop-blur-md text-xs animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-800 text-emerald-200"
                : toast.type === "error"
                ? "bg-rose-950/90 border-rose-800 text-rose-200"
                : toast.type === "warning"
                ? "bg-amber-950/90 border-amber-800 text-amber-200"
                : "bg-zinc-900/90 border-zinc-700 text-zinc-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === "success" && <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />}
              {toast.type === "error" && <AlertTriangle className="size-4 text-rose-400 shrink-0" />}
              {toast.type === "warning" && <AlertTriangle className="size-4 text-amber-400 shrink-0" />}
              {toast.type === "info" && <Info className="size-4 text-blue-400 shrink-0" />}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-md transition-colors ml-2"
            >
              <X className="size-3.5 opacity-70" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: (msg) => console.log("Toast:", msg) };
  }
  return ctx;
}
