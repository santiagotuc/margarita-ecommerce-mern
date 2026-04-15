import { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import api from "../services/api";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Llamamos a la ruta pública que trae los productos (límite de 8 para el inicio)
      const res = await api.get("/products?limit=8");
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 px-4 bg-neutral-50 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-neutral-800 mb-10">
          NUESTROS ÚLTIMOS PRODUCTOS
        </h2>

        {products.length === 0 ? (
          <div className="text-center text-neutral-500 py-12 bg-white rounded-2xl shadow-sm border border-neutral-100">
            <span className="text-4xl mb-4 block">🛍️</span>
            <p>Aún no hay productos disponibles.</p>
            <p className="text-sm mt-2">
              La administradora pronto agregará novedades.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-neutral-100"
              >
                {/* Imagen del producto */}
                <div className="relative aspect-square overflow-hidden bg-neutral-50">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Etiquetas (Nuevo / Oferta) flotantes */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNewArrival && (
                      <span className="bg-blue-500 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold shadow-sm">
                        Nuevo
                      </span>
                    )}
                    {product.isWeeklyOffer && (
                      <span className="bg-red-500 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold shadow-sm">
                        Oferta -{product.offerDiscount}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Información del producto */}
                <div className="p-4 md:p-5">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1 font-medium">
                    {product.category?.name || "Categoría"}
                  </p>
                  <h3
                    className="font-bold text-neutral-800 mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors"
                    title={product.name}
                  >
                    {product.name}
                  </h3>

                  <div className="flex flex-col mb-4">
                    {product.isWeeklyOffer && product.offerDiscount > 0 ? (
                      <>
                        <span className="text-xs text-neutral-400 line-through">
                          ${product.price.toLocaleString("es-CO")}
                        </span>
                        <span className="text-primary-600 font-black text-lg">
                          $
                          {(
                            product.price -
                            (product.price * product.offerDiscount) / 100
                          ).toLocaleString("es-CO")}
                        </span>
                      </>
                    ) : (
                      <span className="text-primary-600 font-black text-lg">
                        ${product.price.toLocaleString("es-CO")}
                      </span>
                    )}
                  </div>

                  <button className="w-full bg-primary-50 text-primary-600 py-2.5 rounded-lg group-hover:bg-primary-500 group-hover:text-white transition-colors flex items-center justify-center gap-2 text-sm font-bold">
                    <FiShoppingCart size={16} />
                    Ver Detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
