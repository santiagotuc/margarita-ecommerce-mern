import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import heic2any from "heic2any";
import Modal from "../components/Modal"; // <-- IMPORTAMOS TU MODAL
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiImage,
  FiX,
  FiCheck,
  FiPackage,
  FiTag,
  FiDollarSign,
  FiGrid,
  FiStar,
} from "react-icons/fi";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  // ESTADO DEL MODAL
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    minStockAlert: 5,
    isNewArrival: false,
    isWeeklyOffer: false,
    offerDiscount: 0,
    featured: false,
    isActive: true,
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [converting, setConverting] = useState(false);
  const navigate = useNavigate();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  // Función ayudante para lanzar el Modal fácilmente
  const showModal = (type, title, message) => {
    setModalConfig({ isOpen: true, type, title, message });
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/all");
      setProducts(res.data);
    } catch (error) {
      showModal("error", "Error", "Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.filter((cat) => cat.isActive));
    } catch (error) {
      // Omitimos consola para mantener todo limpio
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      showModal(
        "warning",
        "Límite excedido",
        "Puedes subir un máximo de 5 imágenes",
      );
      return;
    }

    setConverting(true);
    const processedFiles = [];
    const previews = [];

    try {
      for (let file of files) {
        const isHeic =
          file.type === "image/heic" ||
          file.type === "image/heif" ||
          file.name.toLowerCase().endsWith(".heic") ||
          file.name.toLowerCase().endsWith(".heif");

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

          processedFiles.push(convertedFile);
          previews.push(URL.createObjectURL(convertedBlob));
        } else {
          processedFiles.push(file);
          previews.push(URL.createObjectURL(file));
        }
      }

      setSelectedFiles(processedFiles);
      setPreviewImages(previews);
    } catch (error) {
      showModal(
        "error",
        "Error",
        "Hubo un problema procesando las fotos. Intenta con otra imagen.",
      );
    } finally {
      setConverting(false);
    }
  };

  const handleQuickCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/categories", newCategory);

      setCategories([...categories, data.category]);
      setFormData({ ...formData, category: data.category._id });

      setShowCategoryModal(false);
      setNewCategory({ name: "", description: "" });

      showModal("success", "¡Listo!", "Categoría creada exitosamente");
    } catch (error) {
      showModal(
        "error",
        "Error",
        error.response?.data?.message || "Error creando categoría",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      selectedFiles.forEach((file) => {
        data.append("images", file);
      });

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data);
        showModal(
          "success",
          "¡Actualizado!",
          "Producto actualizado exitosamente",
        );
      } else {
        await api.post("/products", data);
        showModal("success", "¡Creado!", "Producto publicado exitosamente");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      showModal(
        "error",
        "Error",
        error.response?.data?.message || "Error guardando producto",
      );
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category?._id || product.category,
      minStockAlert: product.minStockAlert,
      isNewArrival: product.isNewArrival,
      isWeeklyOffer: product.isWeeklyOffer,
      offerDiscount: product.offerDiscount,
      featured: product.featured,
      isActive: product.isActive,
    });
    setPreviewImages(product.images || []);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  // REEMPLAZAMOS EL WINDOW.CONFIRM POR EL MODAL
  const handleDelete = (id) => {
    setModalConfig({
      isOpen: true,
      type: "warning",
      title: "Eliminar Producto",
      message:
        "¿Estás segura de que quieres eliminar este producto? Esta acción no se puede deshacer.",
      actionText: "Sí, Eliminar",
      onAction: async () => {
        try {
          await api.delete(`/products/${id}`);
          fetchProducts();
          showModal(
            "success",
            "Eliminado",
            "El producto fue eliminado de la tienda.",
          );
        } catch (error) {
          showModal("error", "Error", "Error al intentar eliminar el producto");
        }
      },
    });
  };

  const toggleActive = async (id) => {
    try {
      await api.patch(`/products/${id}/toggle`);
      fetchProducts();
    } catch (error) {
      showModal("error", "Error", "Error cambiando el estado del producto");
    }
  };

  // REEMPLAZAMOS EL WINDOW.CONFIRM POR EL MODAL
  const deleteImage = (productId, imageIndex) => {
    setModalConfig({
      isOpen: true,
      type: "warning",
      title: "Quitar Imagen",
      message: "¿Segura que deseas borrar esta foto del producto?",
      actionText: "Borrar Foto",
      onAction: async () => {
        try {
          await api.delete(`/products/${productId}/image/${imageIndex}`);
          fetchProducts();
          if (editingProduct) {
            const updatedImages = editingProduct.images.filter(
              (_, i) => i !== imageIndex,
            );
            setEditingProduct({ ...editingProduct, images: updatedImages });
            setPreviewImages(updatedImages);
          }
          // Cerramos el modal
          setModalConfig({ isOpen: false });
        } catch (error) {
          showModal("error", "Error", "No se pudo eliminar la imagen");
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      minStockAlert: 5,
      isNewArrival: false,
      isWeeklyOffer: false,
      offerDiscount: 0,
      featured: false,
      isActive: true,
    });
    setSelectedFiles([]);
    setPreviewImages([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading)
    return <div className="text-center py-12">Cargando productos...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* AQUÍ MONTAMOS EL MODAL PARA TODA LA PÁGINA */}
      <Modal
        {...modalConfig}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">
            Gestión de Productos
          </h1>
          <p className="text-neutral-500 mt-1">
            {products.length} productos en total
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 shadow-lg"
        >
          {showForm ? <FiX /> : <FiPlus />}
          {showForm ? "Cancelar" : "Nuevo Producto"}
        </button>
      </div>

      {/* Formulario de Producto */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-neutral-200">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiPackage className="text-primary-500" />
            {editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Nombre */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-2 text-sm">
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Ej: Mochila Escolar Unicornio"
                required
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block font-medium mb-2 text-sm">
                SKU (Código) *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sku: e.target.value.toUpperCase(),
                  })
                }
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none uppercase"
                placeholder="Ej: MOC-001"
                required
              />
            </div>

            {/* Categoría con botón de crear rápido */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-medium text-sm">Categoría *</label>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="text-primary-500 text-sm hover:text-primary-600 flex items-center gap-1 font-medium"
                >
                  <FiPlus size={16} /> Crear nueva categoría
                </button>
              </div>

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {categories.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No hay categorías creadas. Crea una primero.
                </p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label className="block font-medium mb-2 text-sm">Precio *</label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="25000"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block font-medium mb-2 text-sm">Stock *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="10"
                min="0"
                required
              />
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-2 text-sm">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                placeholder="Descripción detallada del producto..."
                required
              />
            </div>

            {/* Imágenes */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-2 text-sm flex items-center gap-2">
                <FiImage /> Imágenes {editingProduct ? "(Agregar nuevas)" : "*"}
              </label>
              <input
                type="file"
                multiple
                accept="image/*,.heic,.heif"
                onChange={handleImageChange}
                disabled={converting}
                className="w-full px-4 py-3 border border-neutral-200 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                required={!editingProduct}
              />

              {converting ? (
                <p className="text-sm text-blue-500 font-bold mt-2 animate-pulse">
                  🔄 Transformando fotos de iPhone para la web...
                </p>
              ) : (
                <p className="text-xs text-neutral-500 mt-1">
                  Máximo 5 imágenes. La primera imagen será la principal. Fotos
                  de iPhone soportadas automáticamente.
                </p>
              )}

              {/* Preview de imágenes */}
              {previewImages.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {previewImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt={`Preview ${idx}`}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      {editingProduct && (
                        <button
                          type="button"
                          onClick={() => deleteImage(editingProduct._id, idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX size={12} />
                        </button>
                      )}
                      {idx === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-primary-500 text-white text-xs text-center py-0.5 rounded-b-lg">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Opciones adicionales */}
            <div className="md:col-span-2 bg-neutral-50 p-4 rounded-lg">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <FiGrid /> Opciones Especiales
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isNewArrival: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-primary-500 rounded"
                  />
                  <span className="text-sm">🆕 Nueva Llegada</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isWeeklyOffer}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isWeeklyOffer: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-primary-500 rounded"
                  />
                  <span className="text-sm">🏷️ Oferta Semanal</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-5 h-5 text-primary-500 rounded"
                  />
                  <span className="text-sm">⭐ Destacado</span>
                </label>
              </div>

              {/* Descuento */}
              {formData.isWeeklyOffer && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Descuento (%)
                  </label>
                  <input
                    type="number"
                    value={formData.offerDiscount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        offerDiscount: e.target.value,
                      })
                    }
                    className="w-32 px-3 py-2 border rounded-lg"
                    min="0"
                    max="100"
                    placeholder="20"
                  />
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="md:col-span-2 flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={converting}
                className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
              >
                <FiCheck />{" "}
                {editingProduct ? "Actualizar Producto" : "Crear Producto"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Productos */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden relative z-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left p-4 font-semibold text-neutral-700">
                  Producto
                </th>
                <th className="text-left p-4 font-semibold text-neutral-700">
                  Categoría
                </th>
                <th className="text-left p-4 font-semibold text-neutral-700">
                  Precio
                </th>
                <th className="text-left p-4 font-semibold text-neutral-700">
                  Stock
                </th>
                <th className="text-left p-4 font-semibold text-neutral-700">
                  Estado
                </th>
                <th className="text-left p-4 font-semibold text-neutral-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className={
                    !product.isActive ? "bg-neutral-50 opacity-60" : ""
                  }
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          product.images?.[0] ||
                          "https://via.placeholder.com/50"
                        }
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-neutral-100"
                      />
                      <div>
                        <p className="font-medium text-neutral-800">
                          {product.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          SKU: {product.sku}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {product.isNewArrival && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                              Nuevo
                            </span>
                          )}
                          {product.isWeeklyOffer && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                              Oferta
                            </span>
                          )}
                          {product.featured && (
                            <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded">
                              ⭐
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-neutral-600">
                    {product.category?.name || "Sin categoría"}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-neutral-800">
                      {formatPrice(
                        product.isWeeklyOffer && product.offerDiscount > 0
                          ? product.price -
                              (product.price * product.offerDiscount) / 100
                          : product.price,
                      )}
                    </div>
                    {product.isWeeklyOffer && product.offerDiscount > 0 && (
                      <div className="text-xs text-neutral-400 line-through">
                        {formatPrice(product.price)}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock <= product.minStockAlert
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {product.stock} unidades
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(product._id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        product.isActive
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      {product.isActive ? (
                        <FiEye size={12} />
                      ) : (
                        <FiEyeOff size={12} />
                      )}
                      {product.isActive ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <FiPackage size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500">No hay productos aún</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-primary-500 hover:underline"
            >
              Crear el primer producto
            </button>
          </div>
        )}
      </div>

      {/* Modal Crear Categoría Rápida - Limpio y con Z-Index ALTO */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-neutral-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl relative">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800"
            >
              <FiX size={24} />
            </button>

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black flex items-center gap-2 text-neutral-800">
                <FiPlus className="text-primary-500" />
                Nueva Categoría
              </h3>
            </div>

            <form onSubmit={handleQuickCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-neutral-600">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Ej: Mochilas"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-neutral-600">
                  Descripción
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="Breve descripción..."
                  rows="2"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-primary-500 text-white py-3 rounded-xl hover:bg-primary-600 font-bold shadow-lg"
                >
                  Crear Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
