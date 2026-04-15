import { useState, useEffect } from "react";
import { FiShoppingCart, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../services/api";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      // Pedimos solo los que tienen featured=true
      const res = await api.get("/products?featured=true&limit=10");
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error cargando productos destacados:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null; // Ocultamos mientras carga

  // Si no hay destacados, no mostramos la sección
  if (products.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-800">
              PRODUCTOS DESTACADOS
            </h2>
            <p className="text-neutral-500 mt-2">Los favoritos de la semana</p>
          </div>
          <Link
            to="/productos"
            className="hidden md:flex items-center gap-1 text-primary-500 font-bold hover:text-primary-600 transition-colors"
          >
            Ver todo el catálogo <FiChevronRight />
          </Link>
        </div>

        {/* SLIDER (Contenedor con scroll horizontal) */}
        <div
          className="flex overflow-x-auto gap-6 pb-8 pt-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="min-w-[280px] w-[280px] md:min-w-[300px] md:w-[300px] snap-start bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-neutral-100 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-50">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="bg-yellow-400 text-yellow-900 text-xs uppercase tracking-wider px-3 py-1 rounded-full font-black shadow-md">
                    ⭐ Destacado
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1 font-bold">
                  {product.category?.name || "Categoría"}
                </p>
                <h3 className="font-bold text-neutral-800 mb-2 line-clamp-2 text-lg">
                  {product.name}
                </h3>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    {product.isWeeklyOffer && product.offerDiscount > 0 ? (
                      <>
                        <span className="text-xs text-neutral-400 line-through">
                          ${product.price.toLocaleString("es-CO")}
                        </span>
                        <span className="text-primary-600 font-black text-xl">
                          $
                          {(
                            product.price -
                            (product.price * product.offerDiscount) / 100
                          ).toLocaleString("es-CO")}
                        </span>
                      </>
                    ) : (
                      <span className="text-primary-600 font-black text-xl">
                        ${product.price.toLocaleString("es-CO")}
                      </span>
                    )}
                  </div>

                  <button className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                    <FiShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
