// client/src/components/shared/Modal.jsx
// Reusable modal overlay — used by TaskModal and team forms
// Usage: <Modal title="Create Task" onClose={() => setOpen(false)}> ...content... </Modal>

const Modal = ({ title, onClose, children }) => {
  return (
    // Dark overlay — clicking outside closes the modal
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Stop clicks inside the modal from closing it */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Modal content (whatever you pass as children) */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
