import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', title?: string, duration: number = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, title: string = 'Success') => {
    showToast(message, 'success', title);
  }, [showToast]);

  const error = useCallback((message: string, title: string = 'Error') => {
    showToast(message, 'error', title);
  }, [showToast]);

  const info = useCallback((message: string, title: string = 'Note') => {
    showToast(message, 'info', title);
  }, [showToast]);

  const warning = useCallback((message: string, title: string = 'Warning') => {
    showToast(message, 'warning', title);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, removeToast }}>
      {children}
      {/* Toast container - Top Right */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2">
        {toasts.map((toast) => {
          const typeConfig = {
            success: {
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
              border: 'border-emerald-500/40',
              bg: 'bg-[#121c17]/95',
              shadow: 'shadow-emerald-950/40',
            },
            error: {
              icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
              border: 'border-rose-500/40',
              bg: 'bg-[#1c1214]/95',
              shadow: 'shadow-rose-950/40',
            },
            warning: {
              icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
              border: 'border-amber-500/40',
              bg: 'bg-[#1c1a12]/95',
              shadow: 'shadow-amber-950/40',
            },
            info: {
              icon: <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />,
              border: 'border-purple-500/40',
              bg: 'bg-[#161224]/95',
              shadow: 'shadow-purple-950/40',
            },
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${typeConfig.border} ${typeConfig.bg} shadow-xl ${typeConfig.shadow} backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-3`}
            >
              {typeConfig.icon}
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <h4 className="text-xs font-semibold text-white tracking-wide">{toast.title}</h4>
                )}
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5 break-words">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors shrink-0"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
