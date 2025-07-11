import React, { useEffect } from 'react';
import { XIcon } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  children
}: ModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Improved backdrop with blur effect */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div role="dialog" aria-modal="true" className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all animate-modal">
          <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Close dialog">
            <XIcon className="h-6 w-6" />
          </button>
          {children}
        </div>
      </div>
    </div>;
}