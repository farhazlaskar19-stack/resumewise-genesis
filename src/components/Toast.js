import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500 text-white';
      case 'error':
        return 'bg-rose-500 text-white';
      case 'warning':
        return 'bg-amber-500 text-white';
      case 'info':
      default:
        return 'bg-indigo-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`fixed top-6 right-6 z-[1000] px-6 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-2xl ${getToastStyles()} min-w-[250px] max-w-[400px]`}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{getIcon()}</span>
            <span className="flex-1">{message}</span>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="ml-2 text-white/70 hover:text-white transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast container for managing multiple toasts
export const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-6 right-6 z-[1000] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Toast
              {...toast}
              onClose={() => onRemove(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration) => addToast(message, 'success', duration);
  const error = (message, duration) => addToast(message, 'error', duration);
  const warning = (message, duration) => addToast(message, 'warning', duration);
  const info = (message, duration) => addToast(message, 'info', duration);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};

export default Toast;
