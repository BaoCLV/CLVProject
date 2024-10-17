// components/Modal.tsx
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white w-full max-w-5xl p-6 rounded-lg shadow-lg">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold"></h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
