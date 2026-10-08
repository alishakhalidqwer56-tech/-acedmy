import React from 'react';
import { useToast, ToastType } from '../../context/ToastContext';

export interface ToastProps {
  type?: ToastType;
  title?: string;
  message: string;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  onClose
}) => {
  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 ${
      type === 'success' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' :
      type === 'error' ? 'bg-rose-950/40 border-rose-500/40 text-rose-200' :
      type === 'warning' ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' :
      'bg-purple-950/40 border-purple-500/40 text-purple-200'
    }`}>
      <div className="flex-1 text-xs">
        {title && <div className="font-semibold text-white mb-0.5">{title}</div>}
        <div className="opacity-90">{message}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-white/60 hover:text-white text-xs ml-2">✕</button>
      )}
    </div>
  );
};

export { useToast };
