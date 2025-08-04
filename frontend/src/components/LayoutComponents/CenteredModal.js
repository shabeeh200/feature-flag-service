import React from 'react';

const CenteredModal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
    <div className="bg-white w-full max-w-xl rounded-lg shadow-2xl border border-black relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export default CenteredModal;