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
    <div className="auth-overlay">
      <div className="auth-modal-card">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
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
