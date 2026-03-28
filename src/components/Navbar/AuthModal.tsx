import React from 'react';
import { X } from 'lucide-react';
import { AuthForm } from '../AuthForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = React.memo(({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
          title="Đóng"
        >
          <X size={24} />
        </button>
        
        <AuthForm onSuccess={onClose} isModal={true} />
      </div>
    </div>
  );
});

AuthModal.displayName = 'AuthModal';
