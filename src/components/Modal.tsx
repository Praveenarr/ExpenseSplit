import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className={`w-full ${maxWidth} mx-auto animate-slide-up`}
        style={{
          background: 'var(--surface)',
          borderRadius: '20px 20px 0 0',
          padding: '1.5rem',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>{title}</h2>
          <button onClick={onClose} className="btn-ghost p-2 rounded-full border-0">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
