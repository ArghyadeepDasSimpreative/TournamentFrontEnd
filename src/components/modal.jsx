import { IoClose } from "react-icons/io5"

const ModalComponent = ({ isOpen, onClose, children, allowOverlayClick = true }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-30 backdrop-blur-sm z-50">
      {/* Overlay Click */}
      {allowOverlayClick && (
        <div className="absolute inset-0" onClick={onClose}></div>
      )}

      {/* Modal Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-[80vw] z-10">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 cursor-pointer"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        {/* Modal Body */}
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}

export default ModalComponent
