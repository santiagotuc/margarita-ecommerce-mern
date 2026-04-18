import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../services/api";
import {
  FiPackage,
  FiGrid,
  FiAlertTriangle,
  FiTag,
  FiSettings,
  FiArrowRight,
  FiStar,
  FiEdit,
} from "react-icons/fi";

const AdminProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [allProducts, setAllProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockCount: 0,
    weeklyOffers: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  // ESTADO NUEVO: Controla qué filtro está activo en la tabla
  const [currentFilter, setCurrentFilter] = useState("all");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products/all"),
          api.get("/categories"),
        ]);

        const products = productsRes.data;
        const categories = categoriesRes.data;

        setAllProducts(products);

        const lowStock = products.filter(
          (p) => p.stock <= (p.minStockAlert || 5),
        );

        setStats({
          totalProducts: products.length,
          activeProducts: products.filter((p) => p.isActive).length,
          lowStockCount: lowStock.length,
          weeklyOffers: products.filter((p) => p.isWeeklyOffer).length,
          totalCategories: categories.length,
        });
      } catch (error) {
        console.error("Error cargando el dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Función para filtrar los productos de la tabla según la tarjeta seleccionada
  const getFilteredProducts = () => {
    switch (currentFilter) {
      case "lowStock":
        return allProducts.filter((p) => p.stock <= (p.minStockAlert || 5));
      case "offers":
        return allProducts.filter((p) => p.isWeeklyOffer);
      case "active":
        return allProducts.filter((p) => p.isActive);
      case "all":
      default:
        return allProducts;
    }
  };

  const displayedProducts = getFilteredProducts();

  if (loading) {
    return (
      <div className="text-center py-20 text-neutral-500 font-medium">
        Cargando tu centro de control...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Saludo de Bienvenida */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-800">
            ¡Hola, {user?.firstName || "Administradora"}! 👋
          </h1>
          <p className="text-neutral-500 mt-2 text-lg">
            Centro de control de inventario y estado de la tienda.
          </p>
        </div>
        <Link
          to="/admin/productos"
          className="bg-primary-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <FiPackage /> Gestionar Productos
        </Link>
      </div>

      {/* Tarjetas de Métricas (AHORA SON FILTROS INTERACTIVOS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Productos - FILTRO 'all' */}
        <div
          onClick={() => setCurrentFilter("all")}
          className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between cursor-pointer transition-all hover:-translate-y-1 ${currentFilter === "all" ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20" : "border-neutral-100 bg-white hover:border-blue-300"}`}
        >
          <div>
            <p className="text-neutral-500 font-medium text-sm mb-1">
              Inventario Total
            </p>
            <h3 className="text-3xl font-black text-neutral-800">
              {stats.totalProducts}
            </h3>
            <p className="text-xs text-blue-500 mt-1 font-bold">
              Ver todos los productos
            </p>
          </div>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${currentFilter === "all" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" : "bg-blue-50 text-blue-500"}`}
          >
            <FiPackage size={24} />
          </div>
        </div>

        {/* Alertas de Stock - FILTRO 'lowStock' */}
        <div
          onClick={() => setCurrentFilter("lowStock")}
          className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between cursor-pointer transition-all hover:-translate-y-1 ${currentFilter === "lowStock" ? "border-red-500 bg-red-50/50 ring-2 ring-red-500/20" : "border-neutral-100 bg-white hover:border-red-300"}`}
        >
          <div>
            <p className="text-neutral-500 font-medium text-sm mb-1">
              Alertas de Stock
            </p>
            <h3 className="text-3xl font-black text-neutral-800">
              {stats.lowStockCount}
            </h3>
            <p
              className={`text-xs mt-1 font-bold ${stats.lowStockCount > 0 ? "text-red-500" : "text-green-500"}`}
            >
              {stats.lowStockCount > 0
                ? "¡Requieren atención!"
                : "Stock saludable"}
            </p>
          </div>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${currentFilter === "lowStock" ? "bg-red-500 text-white shadow-lg shadow-red-500/30" : stats.lowStockCount > 0 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}
          >
            <FiAlertTriangle size={24} />
          </div>
        </div>

        {/* Ofertas Activas - FILTRO 'offers' */}
        <div
          onClick={() => setCurrentFilter("offers")}
          className={`p-6 rounded-2xl shadow-sm border flex items-center justify-between cursor-pointer transition-all hover:-translate-y-1 ${currentFilter === "offers" ? "border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20" : "border-neutral-100 bg-white hover:border-orange-300"}`}
        >
          <div>
            <p className="text-neutral-500 font-medium text-sm mb-1">
              Ofertas Activas
            </p>
            <h3 className="text-3xl font-black text-neutral-800">
              {stats.weeklyOffers}
            </h3>
            <p className="text-xs text-orange-500 mt-1 font-bold">
              Productos con descuento
            </p>
          </div>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${currentFilter === "offers" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "bg-orange-50 text-orange-500"}`}
          >
            <FiTag size={24} />
          </div>
        </div>

        {/* Total Categorías - SIN FILTRO, SOLO INFORMATIVO */}
        <div className="p-6 rounded-2xl shadow-sm border border-neutral-100 bg-white flex items-center justify-between">
          <div>
            <p className="text-neutral-500 font-medium text-sm mb-1">
              Colecciones
            </p>
            <h3 className="text-3xl font-black text-neutral-800">
              {stats.totalCategories}
            </h3>
            <p className="text-xs text-purple-500 mt-1 font-bold">
              Categorías creadas
            </p>
          </div>
          <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
            <FiGrid size={24} />
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Tabla y Accesos Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel Izquierdo: Tabla de Control de Inventario Dinámica */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col max-h-[700px]">
          {/* Cabecera de la tabla */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
            <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
              {currentFilter === "lowStock" && (
                <>
                  <FiAlertTriangle className="text-red-500" /> Productos por
                  agotarse
                </>
              )}
              {currentFilter === "all" && (
                <>
                  <FiPackage className="text-blue-500" /> Todo el Inventario
                </>
              )}
              {currentFilter === "offers" && (
                <>
                  <FiTag className="text-orange-500" /> Productos en Oferta
                </>
              )}
              {currentFilter === "active" && (
                <>
                  <FiStar className="text-green-500" /> Productos Activos
                </>
              )}
            </h2>
            <span className="bg-white border border-neutral-200 px-3 py-1 rounded-full text-xs font-bold text-neutral-600 shadow-sm">
              Mostrando {displayedProducts.length}
            </span>
          </div>

          {/* Contenedor scrolleable de la tabla */}
          <div className="overflow-y-auto flex-1 p-0 custom-scrollbar">
            {displayedProducts.length > 0 ? (
              <table className="w-full relative">
                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                  <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider font-bold">
                    <th className="p-4">Producto</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {displayedProducts.map((product) => (
                    <tr
                      key={product._id}
                      className={`transition-colors hover:bg-neutral-50 ${!product.isActive ? "opacity-60 bg-neutral-50" : ""}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.images?.[0] ||
                              "https://via.placeholder.com/40"
                            }
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border border-neutral-200 bg-white"
                          />
                          <div>
                            <span className="font-bold text-neutral-800 line-clamp-1">
                              {product.name}
                            </span>
                            <span className="text-xs text-neutral-400 block mt-0.5">
                              SKU: {product.sku}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-neutral-700">
                        ${product.price.toLocaleString("es-CO")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black ${product.stock <= (product.minStockAlert || 5) ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}
                        >
                          {product.stock} un.
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Link
                          to="/admin/productos"
                          className="inline-flex items-center gap-1 bg-white border border-neutral-200 text-neutral-600 hover:text-primary-500 hover:border-primary-500 px-3 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm hover:shadow"
                          title="Ir a gestionar productos"
                        >
                          <FiEdit size={14} /> Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPackage size={28} />
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-1">
                  Nada por aquí
                </h3>
                <p className="text-neutral-500">
                  No hay productos que coincidan con este filtro.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panel Derecho: Accesos Rápidos (MANTENIDO INTACTO) */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 h-fit">
          <h2 className="text-lg font-bold text-neutral-800 mb-6">
            Accesos Rápidos
          </h2>

          <div className="space-y-4">
            <Link
              to="/admin/productos"
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:border-primary-500 hover:shadow-md transition-all group bg-neutral-50/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center">
                  <FiPackage size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800 group-hover:text-primary-500 transition-colors">
                    Nuevo Producto
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Cargar artículos al catálogo
                  </p>
                </div>
              </div>
              <FiArrowRight className="text-neutral-300 group-hover:text-primary-500" />
            </Link>

            <Link
              to="/admin/categorias"
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:border-purple-500 hover:shadow-md transition-all group bg-neutral-50/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center">
                  <FiGrid size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800 group-hover:text-purple-500 transition-colors">
                    Colecciones
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Organizar categorías
                  </p>
                </div>
              </div>
              <FiArrowRight className="text-neutral-300 group-hover:text-purple-500" />
            </Link>

            <Link
              to="/admin/configuracion"
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:border-blue-500 hover:shadow-md transition-all group bg-neutral-50/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                  <FiSettings size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800 group-hover:text-blue-500 transition-colors">
                    Configuración
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Banners, contacto y portada
                  </p>
                </div>
              </div>
              <FiArrowRight className="text-neutral-300 group-hover:text-blue-500" />
            </Link>

            {/* Acceso a la tienda pública */}
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:bg-neutral-800 hover:border-neutral-800 transition-all group mt-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 text-neutral-600 group-hover:bg-neutral-700 group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
                  <FiStar size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-800 group-hover:text-white transition-colors">
                    Ver Mi Tienda
                  </h4>
                  <p className="text-xs text-neutral-500 group-hover:text-neutral-300">
                    Ir a la vista de los clientes
                  </p>
                </div>
              </div>
              <FiArrowRight className="text-neutral-300 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      {/* Estilos para el scrollbar interno de la tabla */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `,
        }}
      />
    </div>
  );
};

export default AdminProfile;
