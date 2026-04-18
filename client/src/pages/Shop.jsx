import { useState, useEffect } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import { useSite } from "../context/SiteContext";
import api from "../services/api";
import { FiShoppingCart, FiFilter, FiX } from "react-icons/fi";

const Shop = () => {
  const { categories } = useSite();
  const location = useLocation();
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const filterType = queryParams.get("filtro");

  const activeCategory = categories.find((c) => c.slug === slug);

  useEffect(() => {
    if (!slug || categories.length > 0) {
      fetchProducts();
    }
  }, [location.search, slug, categories]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = "/products?";

      if (slug && categories.length > 0) {
        const cat = categories.find((c) => c.slug === slug);
        if (cat) url += `category=${cat._id}&`;
      }

      // LA SOLUCIÓN ESTÁ AQUÍ: Conectamos los filtros de la URL con el Backend
      if (filterType === "nuevos") url += `newArrivals=true&`;
      if (filterType === "ofertas") url += `offer=true&`;
      if (filterType === "kits") url += `kitMargarita=true&`; // ¡Conexión lista!

      const res = await api.get(url);
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error cargando catálogo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para darle un título bonito según el filtro seleccionado
  const getPageTitle = () => {
    if (activeCategory) return activeCategory.name;
    if (filterType === "nuevos") return "Nuevas Llegadas";
    if (filterType === "kits") return "Kit Margarita";
    if (filterType === "ofertas") return "Ofertas Semanales";
    return "Tienda Completa";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="mb-8 border-b border-neutral-100 pb-6 flex justify-between items-center">
        <h1 className="text-3xl font-black text-neutral-800 uppercase">
          {getPageTitle()}
        </h1>
        <button
          onClick={() => setShowMobileFilters(true)}
          className="md:hidden flex items-center gap-2 bg-neutral-100 px-4 py-2 rounded-lg font-bold"
        >
          <FiFilter /> Filtros
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* SIDEBAR: Categorías */}
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
                  className={`block py-2 px-4 rounded-xl transition-colors ${!slug && !filterType ? "bg-primary-500 text-white font-bold" : "hover:bg-neutral-100"}`}
                >
                  Todas las categorías
                </Link>
              </li>
              {categories
                .filter((c) => c.isActive)
                .map((cat) => (
                  <li key={cat._id}>
                    <Link
                      to={`/categoria/${cat.slug}`}
                      className={`block py-2 px-4 rounded-xl transition-colors ${slug === cat.slug ? "bg-primary-500 text-white font-bold" : "hover:bg-neutral-100"}`}
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
              {/* AGREGO EL FILTRO DE KIT A LA BARRA LATERAL TAMBIÉN */}
              <Link
                to="/productos?filtro=kits"
                className={`block py-2 px-4 rounded-xl transition-colors ${filterType === "kits" ? "bg-orange-500 text-white font-bold" : "hover:bg-neutral-100"}`}
              >
                🎁 Kit Margarita
              </Link>
              <Link
                to="/productos?filtro=ofertas"
                className={`block py-2 px-4 rounded-xl transition-colors ${filterType === "ofertas" ? "bg-red-500 text-white font-bold" : "hover:bg-neutral-100"}`}
              >
                🔥 Ofertas Semanales
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN: Grilla de Productos */}
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
                Aún no hay productos en esta sección.
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
                  className="bg-white rounded-2xl border border-neutral-100 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-neutral-50">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-neutral-800 truncate mb-1">
                      {product.name}
                    </h3>

                    <div className="mt-auto pt-2">
                      {product.isWeeklyOffer && product.offerDiscount > 0 ? (
                        <div className="flex items-end gap-2">
                          <span className="text-primary-600 font-black text-lg">
                            $
                            {(
                              product.price -
                              (product.price * product.offerDiscount) / 100
                            ).toLocaleString("es-CO")}
                          </span>
                          <span className="text-xs text-neutral-400 line-through mb-1">
                            ${product.price.toLocaleString("es-CO")}
                          </span>
                        </div>
                      ) : (
                        <p className="text-primary-600 font-black text-lg">
                          ${product.price.toLocaleString("es-CO")}
                        </p>
                      )}
                    </div>

                    <Link
                      to={`/producto/${product._id}`}
                      className="w-full mt-4 bg-neutral-800 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-500 transition-colors"
                    >
                      <FiShoppingCart /> Ver Detalle
                    </Link>
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
