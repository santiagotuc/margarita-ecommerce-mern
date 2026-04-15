import { useState, useEffect } from "react";
import { useSite } from "../context/SiteContext";
import api from "../services/api";
import {
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiMessageCircle,
} from "react-icons/fi";

const AdminSettings = () => {
  const { config, refreshConfig } = useSite();

  // Inicializamos el estado con la estructura completa para evitar errores
  const [formData, setFormData] = useState({
    siteName: "",
    contact: { email: "", phone: "", address: "" },
    social: { instagram: "", facebook: "", youtube: "", tiktok: "" },
    aboutUs: { title: "", content: "" },
    hero: { title: "", subtitle: "", image: "" },
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Cuando carga la configuración del backend, llenamos el formulario
  useEffect(() => {
    if (config) {
      setFormData({
        siteName: config.siteName || "",
        contact: { ...formData.contact, ...config.contact },
        social: { ...formData.social, ...config.social },
        aboutUs: { ...formData.aboutUs, ...config.aboutUs },
        hero: { ...formData.hero, ...config.hero },
      });
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/config", formData);
      setMessage("✅ Cambios guardados exitosamente");
      refreshConfig(); // Actualiza el contexto global
    } catch (error) {
      setMessage("❌ Error al guardar los cambios");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Función ayudante para crear los "checks" de redes sociales
  const renderSocialToggle = (platform, label, icon) => {
    // Si la cadena de texto tiene algo, el check está marcado
    const isEnabled = formData.social?.[platform]?.length > 0;

    return (
      <div className="border border-neutral-200 rounded-lg p-4 mb-3 bg-neutral-50">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => {
              setFormData({
                ...formData,
                social: {
                  ...formData.social,
                  // Si lo marca, ponemos "https://", si lo desmarca, lo dejamos vacío ""
                  [platform]: e.target.checked ? "https://" : "",
                },
              });
            }}
            className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500 cursor-pointer"
          />
          <span className="font-medium flex items-center gap-2 text-neutral-700">
            {icon} Mostrar {label} en la tienda
          </span>
        </label>

        {/* Solo mostramos el input si el check está marcado */}
        {isEnabled && (
          <div className="mt-3 pl-8">
            <input
              type="text"
              value={formData.social?.[platform] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  social: { ...formData.social, [platform]: e.target.value },
                })
              }
              placeholder={`Enlace a tu perfil de ${label}`}
              className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-20">
      <h1 className="text-3xl font-bold mb-6 text-neutral-800">
        Configuración de la Tienda
      </h1>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 font-medium ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COLUMNA 1: Datos de Contacto */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              📞 Datos de Contacto
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-sm text-neutral-600">
                  Nombre de la Tienda
                </label>
                <input
                  value={formData.siteName}
                  onChange={(e) =>
                    setFormData({ ...formData, siteName: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm text-neutral-600">
                  Email Oficial (Para Footer y Arriba)
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value },
                    })
                  }
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-sm text-neutral-600">
                  Teléfono / WhatsApp
                </label>
                <input
                  value={formData.contact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, phone: e.target.value },
                    })
                  }
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* COLUMNA 1: Sobre Nosotros */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              📖 Sobre Nosotros
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-sm text-neutral-600">
                  Título de la sección
                </label>
                <input
                  value={formData.aboutUs.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aboutUs: { ...formData.aboutUs, title: e.target.value },
                    })
                  }
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Nuestra Historia"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-sm text-neutral-600">
                  Texto descriptivo
                </label>
                <textarea
                  value={formData.aboutUs.content}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aboutUs: { ...formData.aboutUs, content: e.target.value },
                    })
                  }
                  rows="5"
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Escribe la historia de Margarita..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* NUEVO: Portada Principal */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            🖼️ Portada Principal (Hero)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-sm text-neutral-600">
                Título Principal
              </label>
              <input
                value={formData.hero.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, title: e.target.value },
                  })
                }
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ej: Bienvenidos al mundo de Margarita"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm text-neutral-600">
                Subtítulo
              </label>
              <input
                value={formData.hero.subtitle}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, subtitle: e.target.value },
                  })
                }
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ej: Estilo y alegría para tu día a día"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-sm text-neutral-600">
                Enlace de la Imagen (URL)
              </label>
              <input
                value={formData.hero.image}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, image: e.target.value },
                  })
                }
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://ejemplo.com/mifoto.jpg"
              />
              <p className="text-xs text-neutral-400 mt-1">
                Pega aquí el enlace de la imagen que quieres mostrar en el
                inicio.
              </p>
            </div>
          </div>
        </div>
        {/* COLUMNA 2: Redes Sociales */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            📱 Redes Sociales
          </h2>
          <p className="text-sm text-neutral-500 mb-4">
            Activa las redes que quieres que aparezcan en el pie de página de la
            tienda.
          </p>

          {renderSocialToggle(
            "instagram",
            "Instagram",
            <FiInstagram className="text-pink-600" />,
          )}
          {renderSocialToggle(
            "facebook",
            "Facebook",
            <FiFacebook className="text-blue-600" />,
          )}
          {renderSocialToggle(
            "youtube",
            "YouTube",
            <FiYoutube className="text-red-600" />,
          )}
          {renderSocialToggle(
            "tiktok",
            "TikTok",
            <FiMessageCircle className="text-black" />,
          )}
        </div>
      </div>

      {/* Botón Guardar Flotante */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-40">
        <div className="max-w-4xl mx-auto flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {saving ? "Guardando Cambios..." : "Guardar Toda La Configuración"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
