import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const ModalComponent = ({ isOpen, onClose, children, allowOverlayClick = true }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={allowOverlayClick ? onClose : undefined}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white p-6 rounded-lg shadow-lg min-w-[50vw] max-w-[80vw] min-h-[60vh] z-10"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              <IoClose size={24} className="cursor-pointer" />
            </button>

            {/* Modal Body */}
            <div className="mt-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ModalComponent;
