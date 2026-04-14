import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiImage,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import heic2any from "heic2any";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 0,
    icon: "box",
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [converting, setConverting] = useState(false); // Nuevo estado para loading

  const icons = [
    { value: "droplet", label: "Gota (Jabones)" },
    { value: "sun", label: "Sol (Velas)" },
    { value: "heart", label: "Corazón (Cosmética)" },
    { value: "box", label: "Caja (Moldes)" },
    { value: "package", label: "Paquete (Envases)" },
    { value: "wind", label: "Viento (Flores)" },
    { value: "feather", label: "Pluma (Kits)" },
    { value: "hexagon", label: "Hexágono (Madera)" },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories/all");
      setCategories(res.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN CORREGIDA: Conversión HEIC incluida DENTRO del componente
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Detectar HEIC/HEIF (iPhone)
      const isHeic =
        file.type === "image/heic" ||
        file.type === "image/heif" ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif");

      if (isHeic) {
        setConverting(true);
        console.log("🔄 Convirtiendo HEIC a JPEG...");

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

        setImage(convertedFile);
        setPreviewImage(URL.createObjectURL(convertedBlob));
        console.log("✅ Conversión exitosa");
      } else {
        // Cualquier otra imagen (JPG, PNG, WebP)
        setImage(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    } catch (error) {
      console.error("❌ Error convirtiendo imagen:", error);
      alert("Error al convertir la imagen. Intenta con otro formato.");
    } finally {
      setConverting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      const data = new FormData();

      // Agregar todos los campos del formulario
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Agregar imagen si existe
      if (image) {
        data.append("image", image);
      }

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, data);
      } else {
        await api.post("/categories", data);
      }

      // Limpiar formulario
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "", order: 0, icon: "box" });
      setImage(null);
      setPreviewImage("");

      // Recargar lista
      fetchCategories();
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || "Error guardando categoría");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      order: category.order,
      icon: category.icon || "box",
    });
    setPreviewImage(category.image);
    setImage(null); // Resetear imagen para no re-subirla si no cambia
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Error eliminando categoría");
    }
  };

  const toggleActive = async (id) => {
    try {
      await api.patch(`/categories/${id}/toggle`);
      fetchCategories();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div className="text-center py-12">Cargando...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestionar Categorías</h1>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", description: "", order: 0, icon: "box" });
            setPreviewImage("");
            setImage(null);
            setShowForm(!showForm);
          }}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2"
        >
          <FiPlus /> {showForm ? "Cancelar" : "Nueva Categoría"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border">
          <h2 className="text-xl font-bold mb-4">
            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Nombre */}
            <div>
              <label className="block font-medium mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ej: Mochilas Escolares"
              />
            </div>

            {/* Orden */}
            <div>
              <label className="block font-medium mb-2">Orden</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                min="0"
              />
            </div>

            {/* Icono */}
            <div>
              <label className="block font-medium mb-2">Icono</label>
              <select
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                {icons.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Imagen con soporte HEIC */}

            <div>
              <label className="block font-medium mb-2">
                Imagen {editingCategory && "(Dejar vacío para mantener actual)"}
              </label>

              <div className="space-y-3">
                {/* Input de archivo con accept ampliado */}
                <input
                  type="file"
                  accept="image/*,.heic,.heif"
                  onChange={handleImageChange}
                  disabled={converting}
                  className="w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary disabled:opacity-50"
                />

                {/* Indicador de conversión */}
                {converting && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Convirtiendo imagen de iPhone...
                  </div>
                )}

                {/* Preview de imagen */}
                {previewImage && (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Vista previa"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setPreviewImage("");
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title="Quitar imagen"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                )}

                {/* Texto informativo */}
                <p className="text-xs text-gray-500">
                  Formatos: JPG, PNG, WebP.
                  <span className="text-blue-600 font-medium">
                    {" "}
                    Fotos de iPhone (.heic) se convierten automáticamente.
                  </span>
                  Máx: 10MB.
                </p>
              </div>
            </div>

            {/* Descripción - ocupa 2 columnas */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                placeholder="Descripción breve de la categoría..."
              />
            </div>

            {/* Botones */}
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                disabled={converting}
                className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {editingCategory ? "Actualizar Categoría" : "Crear Categoría"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                  setImage(null);
                  setPreviewImage("");
                }}
                className="px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className={`bg-white rounded-xl shadow-sm overflow-hidden border transition-all hover:shadow-md ${!category.isActive ? "opacity-60 grayscale" : ""}`}
          >
            {/* Imagen de categoría */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={
                  category.image ||
                  "https://via.placeholder.com/400x300?text=Sin+Imagen"
                }
                alt={category.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Error+Carga";
                }}
              />
              {/* Badge de estado */}
              <div className="absolute top-3 right-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${category.isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                >
                  {category.isActive ? "Activa" : "Inactiva"}
                </span>
              </div>
              {/* Badge de orden */}
              <div className="absolute top-3 left-3">
                <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                  #{category.order}
                </span>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">
                  {category.name}
                </h3>
              </div>

              <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {category.description || "Sin descripción"}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FiPackage size={16} />
                  {category.productCount || 0} productos
                </span>
                <span className="flex items-center gap-1">
                  <FiImage size={16} />
                  {category.icon}
                </span>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-3 border-t">
                <button
                  onClick={() => toggleActive(category._id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${category.isActive ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                  title={category.isActive ? "Desactivar" : "Activar"}
                >
                  {category.isActive ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                  {category.isActive ? "Desactivar" : "Activar"}
                </button>

                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FiEdit size={16} />
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(category._id)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  title="Eliminar"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {categories.length === 0 && !loading && (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            No hay categorías
          </h3>
          <p className="text-gray-500">
            Crea tu primera categoría para comenzar
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
