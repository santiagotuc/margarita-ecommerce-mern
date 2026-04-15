import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
  actionText = "Entendido",
  onAction,
}) => {
  if (!isOpen) return null;

  // Configuramos colores e iconos según el tipo de modal
  const config = {
    success: {
      icon: <FiCheckCircle className="text-green-500" size={40} />,
      color: "bg-green-500",
      hover: "hover:bg-green-600",
    },
    error: {
      icon: <FiAlertCircle className="text-red-500" size={40} />,
      color: "bg-red-500",
      hover: "hover:bg-red-600",
    },
    info: {
      icon: <FiInfo className="text-blue-500" size={40} />,
      color: "bg-blue-500",
      hover: "hover:bg-blue-600",
    },
  };

  const current = config[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Fondo oscuro desenfocado */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Tarjeta del Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <FiX size={24} />
        </button>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="mb-4 bg-neutral-50 p-4 rounded-full shadow-inner">
            {current.icon}
          </div>
          <h3 className="text-2xl font-black text-neutral-800 mb-2">{title}</h3>
          <p className="text-neutral-500 mb-8 leading-relaxed">{message}</p>

          <button
            onClick={() => {
              if (onAction) onAction();
              onClose();
            }}
            className={`w-full ${current.color} ${current.hover} text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg`}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
