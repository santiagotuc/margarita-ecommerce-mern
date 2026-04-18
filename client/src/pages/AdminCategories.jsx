import { useState, useEffect } from "react";
import api from "../services/api";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiPackage,
} from "react-icons/fi";

// Componente para el Slideshow automático (3 segundos)
const CategoryImageSlideshow = ({ images, categoryName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3 segundos
    return () => clearInterval(intervalId);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-neutral-100 flex flex-col items-center justify-center text-neutral-400 p-4">
        <FiPackage size={40} className="mb-2 opacity-50" />
        <span className="text-xs font-medium text-center">Sin productos</span>
      </div>
    );
  }

  return (
    <img
      key={currentIndex} // Esto fuerza que React la re-renderice (ideal para transiciones simples)
      src={images[currentIndex]}
      alt={`${categoryName} preview`}
      className="w-full h-full object-cover transition-opacity duration-500 animate-fadeIn"
    />
  );
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 0,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
      } else {
        await api.post("/categories", formData);
      }

      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "", order: 0 });
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Error guardando categoría");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      order: category.order || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "¿Eliminar esta categoría? Solo se puede si no tiene productos.",
      )
    )
      return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Error eliminando categoría");
    }
  };

  const toggleFeatured = async (id, featured) => {
    try {
      await api.patch(`/categories/${id}/featured`, { featured });
      fetchCategories();
    } catch (error) {
      console.error(error);
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
            setFormData({ name: "", description: "", order: 0 });
            setShowForm(!showForm);
          }}
          className="bg-primary-500 text-white px-6 py-3 rounded-xl hover:bg-primary-600 transition-colors flex items-center gap-2 font-bold shadow-md"
        >
          <FiPlus /> {showForm ? "Cancelar" : "Nueva Categoría"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-8 border border-neutral-100">
          <h2 className="text-2xl font-black mb-6 text-neutral-800">
            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block font-bold mb-2 text-sm text-neutral-600">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Ej: Mochilas Escolares"
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-sm text-neutral-600">
                Orden de aparición (número)
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                min="0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold mb-2 text-sm text-neutral-600">
                Descripción breve
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="2"
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                placeholder="Descripción para mostrar en la tienda..."
              />
            </div>

            <div className="md:col-span-2 flex gap-4 pt-4 border-t border-neutral-100">
              <button
                type="submit"
                className="bg-primary-500 text-white px-8 py-3 rounded-xl hover:bg-primary-600 font-bold shadow-lg"
              >
                {editingCategory ? "Actualizar Categoría" : "Crear Categoría"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-8 py-3 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 font-bold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de categorías con SLIDESHOW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className={`bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 ${!category.isActive ? "opacity-75 grayscale-[50%]" : ""}`}
          >
            {/* Visualizador Inteligente (Slideshow) */}
            <div className="relative h-48 bg-neutral-100 overflow-hidden group">
              <CategoryImageSlideshow
                images={category.productPreviewImages}
                categoryName={category.name}
              />

              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() =>
                    toggleFeatured(category._id, !category.featured)
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-black shadow-md transition-colors ${category.featured ? "bg-yellow-400 text-yellow-900" : "bg-white text-neutral-400 hover:text-yellow-500"}`}
                  title="Destacar en Inicio"
                >
                  {category.featured ? "⭐ DESTACADA" : "☆ Destacar"}
                </button>
              </div>

              {!category.isActive && (
                <div className="absolute inset-0 bg-neutral-900/40 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-4 py-1 rounded-full font-bold uppercase tracking-widest text-xs">
                    Oculta
                  </span>
                </div>
              )}
            </div>

            {/* Datos */}
            <div className="p-6">
              <h3 className="text-xl font-black text-neutral-800 mb-1">
                {category.name}
              </h3>
              <p className="text-neutral-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
                {category.description || "Sin descripción"}
              </p>

              <p className="text-xs font-bold text-primary-500 mb-6 uppercase tracking-wider">
                {category.productCount || 0} Productos vinculados
              </p>

              {/* Botones de acción */}
              <div className="flex gap-2 border-t border-neutral-100 pt-4">
                <button
                  onClick={() => toggleActive(category._id)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors ${category.isActive ? "bg-orange-50 text-orange-600 hover:bg-orange-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                >
                  {category.isActive ? (
                    <>
                      <FiEyeOff /> Ocultar
                    </>
                  ) : (
                    <>
                      <FiEye /> Mostrar
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleEdit(category)}
                  className="w-12 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <FiEdit size={16} />
                </button>

                <button
                  onClick={() => handleDelete(category._id)}
                  className="w-12 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-100 shadow-sm mt-8">
          <FiPackage size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-xl font-bold text-neutral-800">
            No hay categorías
          </h3>
          <p className="text-neutral-500 mt-2">
            Empieza creando una categoría para organizar tus productos.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
