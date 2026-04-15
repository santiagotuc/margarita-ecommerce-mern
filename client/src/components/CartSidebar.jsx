import { FiX, FiTrash2, FiMessageCircle } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useSite } from "../context/SiteContext";
import { useState } from "react";
import Modal from "./Modal";

const CartSidebar = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useCart();
  const { contact } = useSite();
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    const rawPhone = contact?.phone || "";
    const cleanPhone = rawPhone.replace(/\D/g, "");

    if (!cleanPhone) {
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Atención no disponible",
        message:
          "En este momento el número de WhatsApp de la tienda no está configurado.",
      });
      return;
    }

    // Armar el "ticket" para WhatsApp
    let text = `Hola Margarita! 🌸 Quiero realizar el siguiente pedido:\n\n`;

    cart.forEach((item) => {
      const isOffer = item.isWeeklyOffer && item.offerDiscount > 0;
      const price = isOffer
        ? item.price - (item.price * item.offerDiscount) / 100
        : item.price;
      text += `🛍️ *${item.quantity}x ${item.name}* ($${price.toLocaleString("es-CO")})\n`;
    });

    text += `\n💰 *Total Estimado: $${cartTotal.toLocaleString("es-CO")}*\n\nPor favor, confirmame stock y opciones de pago. ¡Gracias!`;

    const encodedText = encodeURIComponent(text);

    // Mostramos un modal profesional antes de enviar
    setModalConfig({
      isOpen: true,
      type: "success",
      title: "¡Pedido Armado!",
      message:
        "Te vamos a redirigir a WhatsApp para que la administradora confirme tu pedido. (No cierres esta ventana hasta enviar el mensaje).",
      actionText: "Ir a WhatsApp",
      onAction: () => {
        window.open(
          `https://wa.me/${cleanPhone}?text=${encodedText}`,
          "_blank",
        );
        clearCart(); // Opcional: vaciar carrito tras pedir
        setIsCartOpen(false);
      },
    });
  };

  return (
    <>
      <Modal
        {...modalConfig}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />

      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Fondo oscuro (Cierra el carrito al hacer click fuera) */}
        <div
          className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />

        {/* Panel Lateral */}
        <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col transform transition-transform animate-slide-left">
          {/* Cabecera */}
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
            <h2 className="text-xl font-black text-neutral-800 uppercase tracking-widest">
              Mi Pedido
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-800 bg-white rounded-full shadow-sm"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Lista de Productos */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400">
                <span className="text-6xl mb-4">🛒</span>
                <p className="font-bold">Tu carrito está vacío</p>
                <p className="text-sm mt-2">
                  Agrega productos para armar tu pedido.
                </p>
              </div>
            ) : (
              cart.map((item) => {
                const isOffer = item.isWeeklyOffer && item.offerDiscount > 0;
                const price = isOffer
                  ? item.price - (item.price * item.offerDiscount) / 100
                  : item.price;

                return (
                  <div
                    key={item._id}
                    className="flex gap-4 bg-white p-3 rounded-2xl border border-neutral-100 shadow-sm"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl bg-neutral-50"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-neutral-800 line-clamp-1 leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-primary-600 font-black text-sm mt-1">
                          ${price.toLocaleString("es-CO")}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        {/* Controles de Cantidad */}
                        <div className="flex items-center bg-neutral-100 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center font-bold text-neutral-600 hover:text-primary-500"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center font-bold text-neutral-600 hover:text-primary-500"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-400 hover:text-red-600 p-2"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pie del carrito (Checkout) */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-neutral-50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-neutral-500 font-medium">
                  Total estimado
                </span>
                <span className="text-3xl font-black text-neutral-900">
                  ${cartTotal.toLocaleString("es-CO")}
                </span>
              </div>
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-3"
              >
                <FiMessageCircle size={22} /> Enviar Pedido a WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
