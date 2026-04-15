import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiArrowLeft,
  FiTruck,
  FiShield,
  FiCheck,
} from "react-icons/fi";
import api from "../services/api";

const ProductDetail = () => {
  const { id } = useParams(); // Obtenemos el ID de la URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(0); // Para la galería de imágenes
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error al cargar producto", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4">
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">
          Producto no encontrado
        </h2>
        <p className="text-neutral-500 mb-6">
          El producto que buscas ya no existe o fue eliminado.
        </p>
        <button
          onClick={() => navigate("/productos")}
          className="bg-primary-500 text-white px-6 py-2 rounded-full font-bold"
        >
          Volver a la tienda
        </button>
      </div>
    );
  }

  // Calcular precio final si hay oferta
  const isOffer = product.isWeeklyOffer && product.offerDiscount > 0;
  const finalPrice = isOffer
    ? product.price - (product.price * product.offerDiscount) / 100
    : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {/* Botón Volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-neutral-500 hover:text-primary-500 font-medium mb-8 transition-colors"
      >
        <FiArrowLeft /> Volver atrás
      </button>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-neutral-100">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* LADO IZQUIERDO: Imágenes */}
          <div className="flex flex-col gap-4">
            {/* Imagen Principal */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-50 relative border border-neutral-100">
              <img
                src={product.images[mainImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Etiquetas */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNewArrival && (
                  <span className="bg-blue-500 text-white text-xs uppercase tracking-widest px-3 py-1.5 rounded-lg font-bold shadow-sm">
                    Nuevo
                  </span>
                )}
                {isOffer && (
                  <span className="bg-red-500 text-white text-xs uppercase tracking-widest px-3 py-1.5 rounded-lg font-bold shadow-sm">
                    -{product.offerDiscount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Miniaturas (Galería) */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${mainImage === index ? "border-primary-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img
                      src={img}
                      alt={`Vista ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LADO DERECHO: Información del Producto */}
          <div className="flex flex-col">
            <p className="text-primary-500 font-bold uppercase tracking-widest text-sm mb-2">
              {product.category?.name || "Categoría"}
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-neutral-800 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Precios */}
            <div className="mb-6 flex items-end gap-3">
              <span className="text-4xl font-black text-neutral-900">
                ${finalPrice.toLocaleString("es-CO")}
              </span>
              {isOffer && (
                <span className="text-xl text-neutral-400 line-through mb-1">
                  ${product.price.toLocaleString("es-CO")}
                </span>
              )}
            </div>

            <p className="text-neutral-600 mb-8 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            {/* Separador */}
            <hr className="border-neutral-100 mb-8" />

            {/* Controles de Compra */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-bold text-neutral-700">Cantidad:</span>
                <div className="flex items-center bg-neutral-100 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:text-primary-500 transition-colors font-bold text-xl"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-neutral-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:text-primary-500 transition-colors font-bold text-xl"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-neutral-500">
                  ({product.stock} disponibles)
                </span>
              </div>

              <button
                className="w-full bg-primary-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stock === 0}
              >
                <FiShoppingCart size={22} />
                {product.stock === 0 ? "Agotado" : "Añadir al carrito"}
              </button>
            </div>

            {/* Info Extra (Confianza) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              <div className="bg-neutral-50 p-4 rounded-xl flex items-start gap-3 border border-neutral-100">
                <FiTruck className="text-primary-500 text-xl flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-neutral-800">
                    Envíos a todo el país
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    Llega seguro a tu casa
                  </p>
                </div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-xl flex items-start gap-3 border border-neutral-100">
                <FiShield className="text-primary-500 text-xl flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-neutral-800">
                    Compra Segura
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    Tus datos están protegidos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
