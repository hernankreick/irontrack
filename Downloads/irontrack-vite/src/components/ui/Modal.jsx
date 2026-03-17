export default function Modal({ onClose, children, className = '' }) {
  return (
    <div
      className="modal-bg"
      onClick={onClose}
    >
      <div
        className={`modal-sheet ${className}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-handle" />
        {children}
      </div>
    </div>
  )
}
