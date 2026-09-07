import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { sound } from '@/audio/soundEngine';
import './toast.css';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const id = useRef(0);

  const dismiss = useCallback((tid) => {
    setToasts((t) => t.filter((x) => x.id !== tid));
  }, []);

  const toast = useCallback((message, opts = {}) => {
    const tid = ++id.current;
    const entry = {
      id: tid,
      message,
      icon: opts.icon ?? '✦',
      tone: opts.tone ?? 'default',
      detail: opts.detail,
    };
    setToasts((t) => [...t, entry]);
    sound.play(opts.sound ?? (opts.tone === 'bad' ? 'error' : 'notify'));
    setTimeout(() => dismiss(tid), opts.duration ?? 3600);
    return tid;
  }, [dismiss]);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="toast-dock" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast glass toast-${t.tone}`} onClick={() => dismiss(t.id)}>
            <span className="toast-icon">{t.icon}</span>
            <span className="stack">
              <strong>{t.message}</strong>
              {t.detail && <span className="tiny muted">{t.detail}</span>}
            </span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx.toast;
};
