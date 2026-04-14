import { useState, useEffect } from "react";
import { useSite } from "../context/SiteContext";
import api from "../services/api";

const AdminSettings = () => {
  const { config, refreshConfig } = useSite();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (config) setFormData(config);
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/config", formData);
      setMessage("✅ Cambios guardados");
      refreshConfig();
    } catch (error) {
      setMessage("❌ Error al guardar");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Configuración del Sitio</h1>

      {message && (
        <div
          className={`p-4 rounded-lg mb-4 ${message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4">Información General</h2>

        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nombre del Sitio</label>
            <input
              value={formData.siteName || ""}
              onChange={(e) =>
                setFormData({ ...formData, siteName: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email de Contacto</label>
            <input
              value={formData.contact?.email || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value },
                })
              }
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Teléfono</label>
            <input
              value={formData.contact?.phone || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, phone: e.target.value },
                })
              }
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
