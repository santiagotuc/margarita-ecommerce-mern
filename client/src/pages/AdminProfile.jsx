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
} from "react-icons/fi";

const AdminProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: [],
    weeklyOffers: 0,
    totalCategories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obtenemos todos los datos usando las rutas que ya existen
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products/all"),
          api.get("/categories"),
        ]);

        const products = productsRes.data;
        const categories = categoriesRes.data;

        // Calculamos las estadísticas en el frontend
        const lowStock = products.filter(
          (p) => p.stock <= (p.minStockAlert || 5),
        );

        setStats({
          totalProducts: products.length,
          activeProducts: products.filter((p) => p.isActive).length,
          lowStockProducts: lowStock,
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

  if (loading) {
    return (
      <div className="text-center py-20 text-neutral-500 font-medium">
        Cargando el panel principal...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Saludo de Bienvenida */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-neutral-800">
          ¡Hola, {user?.firstName || "Administradora"}! 👋
        </h1>
        <p className="text-neutral-500 mt-2 text-lg">
          Este es el resumen general de tu tienda Margarita.
        </p>
      </div>

      {/* Tarjetas de Métricas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Productos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-between">
          <div>
            <p className="text-neutral-500 font-medium text-sm mb-1">
              Total Productos
            </p>
            <h3 className="text-3xl font-black text-neutral-800">
              {stats.totalProducts}
            </h3>
            <p className="text-xs text-green-500 mt-1 font-medium">
              {stats.activeProducts} activos en tienda
            </p>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <FiPackage size={24} />
          </div>
        </div>

        {/* Alertas de Stock */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-between">
          <div>
            <p className="text-neutral-500 font-medium text-sm mb-1">
              Alertas de Stock
            </p>
            <h3 className="text-3xl font-black text-neutral-800">
              {stats.lowStockProducts.length}
            </h3>
            <p
              className={`text-xs mt-1 font-medium ${stats.lowStockProducts.length > 0 ? "text-red-500" : "text-neutral-400"}`}
            >
              {stats.lowStockProducts.length > 0
                ? "Requieren tu atención"
                : "Inventario saludable"}
            </p>
          </div>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stats.lowStockProducts.length > 0 ? "bg-red-50 text-red-500" : "bg-neutral-50 text-neutral-400"}`}
          >
            <FiAlertTriangle size={24} />
          </div>
        </div>

        {/* Ofertas Activas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-between">
          <div>
            <p className="text-neutral-500 font-medium text-sm mb-1">
              Ofertas Semanales
            </p>
            <h3 className="text-3xl font-black text-neutral-800">
              {stats.weeklyOffers}
            </h3>
            <p className="text-xs text-orange-500 mt-1 font-medium">
              Productos en promoción
            </p>
          </div>
          <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
            <FiTag size={24} />
          </div>
        </div>

        {/* Total Categorías */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-between">
          <div>
            <p className="text-neutral-500 font-medium text-sm mb-1">
              Colecciones
            </p>
            <h3 className="text-3xl font-black text-neutral-800">
              {stats.totalCategories}
            </h3>
            <p className="text-xs text-purple-500 mt-1 font-medium">
              Categorías creadas
            </p>
          </div>
          <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
            <FiGrid size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel Izquierdo: Productos con Bajo Stock */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
              <FiAlertTriangle className="text-red-500" /> Productos por
              agotarse
            </h2>
            <Link
              to="/admin/productos"
              className="text-sm font-bold text-primary-500 hover:underline"
            >
              Ver todos
            </Link>
          </div>

          <div className="p-0">
            {stats.lowStockProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 text-left text-xs text-neutral-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-4">Producto</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Stock Actual</th>
                      <th className="p-4">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {stats.lowStockProducts.slice(0, 5).map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-neutral-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                product.images?.[0] ||
                                "https://via.placeholder.com/40"
                              }
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg border border-neutral-200"
                            />
                            <span className="font-medium text-neutral-800">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-neutral-500">
                          {product.sku}
                        </td>
                        <td className="p-4">
                          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                            Solo {product.stock} un.
                          </span>
                        </td>
                        <td className="p-4">
                          <Link
                            to="/admin/productos"
                            className="text-primary-500 font-bold text-sm hover:underline"
                          >
                            Actualizar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPackage size={28} />
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-1">
                  ¡Todo en orden!
                </h3>
                <p className="text-neutral-500">
                  Ningún producto está por agotarse.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panel Derecho: Accesos Rápidos */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <h2 className="text-lg font-bold text-neutral-800 mb-6">
            Accesos Rápidos
          </h2>

          <div className="space-y-4">
            <Link
              to="/admin/productos"
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:border-primary-500 hover:shadow-md transition-all group"
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
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:border-purple-500 hover:shadow-md transition-all group"
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
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:border-blue-500 hover:shadow-md transition-all group"
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
              className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:bg-neutral-800 hover:border-neutral-800 transition-all group"
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
    </div>
  );
};

export default AdminProfile;
