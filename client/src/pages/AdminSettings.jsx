import { useState, useEffect } from "react";
import { useSite } from "../context/SiteContext";
import api from "../services/api";
import heic2any from "heic2any"; // <-- IMPORTANTE PARA IPHONE
import {
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiMessageCircle,
  FiImage,
  FiX,
} from "react-icons/fi";

const AdminSettings = () => {
  const { config, refreshConfig } = useSite();

  const [formData, setFormData] = useState({
    siteName: "",
    contact: { email: "", phone: "", address: "" },
    social: { instagram: "", facebook: "", youtube: "", tiktok: "" },
    aboutUs: { title: "", content: "" },
    hero: { title: "", subtitle: "", image: "" },
  });

  // Estados para la imagen
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState("");
  const [convertingImage, setConvertingImage] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (config) {
      setFormData({
        siteName: config.siteName || "",
        contact: { ...formData.contact, ...config.contact },
        social: { ...formData.social, ...config.social },
        aboutUs: { ...formData.aboutUs, ...config.aboutUs },
        hero: { ...formData.hero, ...config.hero },
      });
      // Si ya hay una imagen guardada, la mostramos en el preview
      if (config.hero?.image) {
        setHeroImagePreview(config.hero.image);
      }
    }
  }, [config]);

  // Manejador de la imagen con soporte para iPhone
  const handleHeroImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setConvertingImage(true);
    try {
      const isHeic =
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic");

      if (isHeic) {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });
        const convertedFile = new File(
          [convertedBlob],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          { type: "image/jpeg" },
        );
        setHeroImageFile(convertedFile);
        setHeroImagePreview(URL.createObjectURL(convertedBlob));
      } else {
        setHeroImageFile(file);
        setHeroImagePreview(URL.createObjectURL(file));
      }
    } catch (error) {
      console.error("Error al convertir imagen:", error);
      alert("Error procesando la imagen. Intenta con otra.");
    } finally {
      setConvertingImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Como ahora enviamos un ARCHIVO, necesitamos usar FormData
      const data = new FormData();

      // Empaquetamos todo el JSON en un solo campo de texto
      data.append("configData", JSON.stringify(formData));

      // Adjuntamos la imagen si es que subió una nueva
      if (heroImageFile) {
        data.append("heroImage", heroImageFile);
      }

      // Enviamos la petición
      await api.put("/config", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Cambios guardados exitosamente");
      refreshConfig();
      setHeroImageFile(null); // Reseteamos el archivo tras guardar
    } catch (error) {
      setMessage("❌ Error al guardar los cambios");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const renderSocialToggle = (platform, label, icon) => {
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
                  Email Oficial
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
                  placeholder="Escribe la historia..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* REEMPLAZADO: PORTADA PRINCIPAL CON SUBIDA DE ARCHIVO */}
        <div className="space-y-6">
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
                />
              </div>

              {/* Nuevo Input de Archivo para la foto */}
              <div>
                <label className="block font-medium mb-2 text-sm text-neutral-600">
                  Foto de la portada
                </label>
                <input
                  type="file"
                  accept="image/*,.heic,.heif"
                  onChange={handleHeroImageChange}
                  disabled={convertingImage}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />

                {convertingImage && (
                  <p className="text-sm text-blue-500 font-bold mt-2 animate-pulse">
                    🔄 Procesando foto de iPhone...
                  </p>
                )}

                {/* Vista previa de la imagen */}
                {heroImagePreview && (
                  <div className="mt-4 relative rounded-xl overflow-hidden border border-neutral-200">
                    <img
                      src={heroImagePreview}
                      alt="Vista previa Portada"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              📱 Redes Sociales
            </h2>
            <p className="text-sm text-neutral-500 mb-4">
              Activa las redes que quieres que aparezcan en el pie de página.
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
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-40">
        <div className="max-w-4xl mx-auto flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || convertingImage}
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
