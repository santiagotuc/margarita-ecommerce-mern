import { useState } from "react";
import { useSite } from "../context/SiteContext";
import {
  FiPhone,
  FiMail,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiMessageCircle,
} from "react-icons/fi";

const Contact = () => {
  const { contact, social } = useSite();

  // Estado para guardar lo que escribe el cliente
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleWhatsAppSend = (e) => {
    e.preventDefault();

    // 1. Verificamos que al menos haya puesto su nombre y un mensaje
    if (!formData.name || !formData.message) {
      alert("Por favor, completa tu nombre y mensaje para poder ayudarte.");
      return;
    }

    // 2. Limpiamos el teléfono de la administradora (quitamos espacios, guiones, paréntesis)
    // Si no hay teléfono configurado, evitamos que se rompa
    const rawPhone = contact?.phone || "";
    const cleanPhone = rawPhone.replace(/\D/g, "");

    if (!cleanPhone) {
      alert("En este momento la atención por WhatsApp no está disponible.");
      return;
    }

    // 3. Armamos el mensaje pre-diseñado
    const text = `Hola Margarita! 🌸 Soy ${formData.name}.\nTe escribo desde la página web:\n\n"${formData.message}"\n\n(Mi email es: ${formData.email || "No especificado"})`;

    // 4. Codificamos el texto para que la URL lo entienda (convierte espacios en %20, etc.)
    const encodedText = encodeURIComponent(text);

    // 5. Creamos el enlace oficial de WhatsApp y lo abrimos en una pestaña nueva
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");

    // Opcional: Limpiamos el formulario después de enviar
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-neutral-800 mb-4">
          Contáctanos
        </h1>
        <p className="text-lg text-neutral-500">
          Estamos aquí para ayudarte. Escríbenos o llámanos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Lado Izquierdo: Info de contacto dinámica */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-neutral-100">
          <h3 className="text-2xl font-bold text-neutral-800 mb-8">
            Nuestros Datos
          </h3>

          <div className="space-y-8">
            {contact?.phone && (
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center text-2xl shadow-inner">
                  <FiPhone />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium mb-1">
                    Teléfono / WhatsApp
                  </p>
                  <p className="font-bold text-neutral-800 text-xl">
                    {contact.phone}
                  </p>
                </div>
              </div>
            )}

            {contact?.email && (
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center text-2xl shadow-inner">
                  <FiMail />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 font-medium mb-1">
                    Correo Electrónico
                  </p>
                  <p className="font-bold text-neutral-800 text-lg">
                    {contact.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          <hr className="my-10 border-neutral-100" />

          <h3 className="text-xl font-bold text-neutral-800 mb-6">
            Síguenos en redes
          </h3>
          <div className="flex gap-4">
            {social?.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1 text-xl"
              >
                <FiInstagram />
              </a>
            )}
            {social?.facebook && (
              <a
                href={social.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1 text-xl"
              >
                <FiFacebook />
              </a>
            )}
            {social?.youtube && (
              <a
                href={social.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1 text-xl"
              >
                <FiYoutube />
              </a>
            )}
            {social?.tiktok && (
              <a
                href={social.tiktok}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 bg-neutral-50 text-neutral-600 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1 text-xl"
              >
                <FiMessageCircle />
              </a>
            )}
          </div>
        </div>

        {/* Lado Derecho: Formulario a WhatsApp */}
        <div className="bg-neutral-50 p-8 md:p-10 rounded-3xl border border-neutral-100">
          <h3 className="text-2xl font-bold text-neutral-800 mb-8">
            Envíanos un WhatsApp rápido
          </h3>

          <form className="space-y-5" onSubmit={handleWhatsAppSend}>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Tu Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                placeholder="Ej: Camila Ruiz"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Tu Email (Opcional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">
                Mensaje *
              </label>
              <textarea
                rows="4"
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full p-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none bg-white"
                placeholder="¿En qué podemos ayudarte?"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-colors mt-2 flex items-center justify-center gap-2"
            >
              <FiMessageCircle size={20} /> Enviar por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
