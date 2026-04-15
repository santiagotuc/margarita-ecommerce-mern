import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import api from "../services/api";
import { FiShoppingCart, FiFilter, FiX } from "react-icons/fi";

const Shop = () => {
  const { categories } = useSite();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Obtener parámetros de la URL (por si vienen de un banner)
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("categoria");
  const filterType = queryParams.get("filtro");

  useEffect(() => {
    fetchProducts();
  }, [location.search]); // Se recarga si cambia la URL

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = "/products?";
      if (categoryId) url += `category=${categoryId}&`;
      if (filterType === "nuevos") url += `newArrivals=true&`;
      if (filterType === "ofertas") url += `offer=true&`;

      const res = await api.get(url);
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error cargando catálogo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado de página */}
      <div className="mb-8 border-b border-neutral-100 pb-6 flex justify-between items-center">
        <h1 className="text-3xl font-black text-neutral-800 uppercase">
          {filterType
            ? `Catálogo: ${filterType.toUpperCase()}`
            : "Tienda Completa"}
        </h1>
        <button
          onClick={() => setShowMobileFilters(true)}
          className="md:hidden flex items-center gap-2 bg-neutral-100 px-4 py-2 rounded-lg font-bold"
        >
          <FiFilter /> Filtros
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* SIDEBAR: Menú de Categorías (Izquierda) */}
        <aside
          className={`fixed inset-0 z-50 bg-white p-6 md:relative md:inset-auto md:z-0 md:bg-transparent md:p-0 md:w-64 transition-transform ${showMobileFilters ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="flex justify-between items-center md:hidden mb-8">
            <h2 className="font-bold text-xl">Filtros</h2>
            <button onClick={() => setShowMobileFilters(false)}>
              <FiX size={24} />
            </button>
          </div>

          <div className="sticky top-24">
            <h3 className="font-bold text-neutral-800 mb-4 uppercase tracking-widest text-sm">
              Categorías
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/productos"
                  className={`block py-2 px-4 rounded-xl transition-colors ${!categoryId ? "bg-primary-500 text-white font-bold" : "hover:bg-neutral-100"}`}
                >
                  Todas las categorías
                </Link>
              </li>
              {categories
                .filter((c) => c.isActive)
                .map((cat) => (
                  <li key={cat._id}>
                    <Link
                      to={`/productos?categoria=${cat._id}`}
                      className={`block py-2 px-4 rounded-xl transition-colors ${categoryId === cat._id ? "bg-primary-500 text-white font-bold" : "hover:bg-neutral-100"}`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
            </ul>

            <h3 className="font-bold text-neutral-800 mt-10 mb-4 uppercase tracking-widest text-sm">
              Más Filtros
            </h3>
            <div className="space-y-2">
              <Link
                to="/productos?filtro=nuevos"
                className={`block py-2 px-4 rounded-xl transition-colors ${filterType === "nuevos" ? "bg-blue-500 text-white font-bold" : "hover:bg-neutral-100"}`}
              >
                ✨ Nuevas Llegadas
              </Link>
              <Link
                to="/productos?filtro=ofertas"
                className={`block py-2 px-4 rounded-xl transition-colors ${filterType === "ofertas" ? "bg-red-500 text-white font-bold" : "hover:bg-neutral-100"}`}
              >
                🔥 Ofertas Especiales
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN: Grilla de Productos (Derecha) */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-neutral-100 animate-pulse rounded-2xl"
                ></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50 rounded-3xl">
              <p className="text-xl text-neutral-500">
                No encontramos productos en esta sección.
              </p>
              <Link
                to="/productos"
                className="text-primary-500 font-bold mt-4 inline-block"
              >
                Ver todo el catálogo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl border border-neutral-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-neutral-50">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-neutral-800 truncate mb-1">
                      {product.name}
                    </h3>
                    <p className="text-primary-600 font-black text-lg">
                      ${product.price.toLocaleString("es-CO")}
                    </p>
                    <button className="w-full mt-4 bg-neutral-800 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-500 transition-colors">
                      <FiShoppingCart /> Ver Detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
