import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, headerText, bodyText, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#1a202c] text-white p-6 rounded-lg shadow-lg z-50">
        <h2 className="text-xl font-semibold">{headerText}</h2>
        <p className="my-4">{bodyText}</p>
        <div className="flex justify-end space-x-2">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button 
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" 
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
