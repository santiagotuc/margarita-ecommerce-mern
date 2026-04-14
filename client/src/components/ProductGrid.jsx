import { FiShoppingCart } from "react-icons/fi";

const ProductGrid = () => {
  // Placeholders de productos (vacío por ahora)
  const products = []; // Tu cliente los creará desde el admin

  const placeholders = [
    { name: "MOCHILA", price: "$25.000", emoji: "🎒" },
    { name: "BOTELLA", price: "$12.000", emoji: "💧" },
    { name: "CANTIMPLORA", price: "$15.000", emoji: "🥤" },
    { name: "KIT ESCOLAR", price: "$18.000", emoji: "🎨" },
    { name: "TAZA", price: "$5.000", emoji: "☕" },
    { name: "MOCHILA 1", price: "$22.000", emoji: "🎒" },
    { name: "MOCHILA 2", price: "$28.000", emoji: "🎒" },
    { name: "MOCHILA 3", price: "$30.000", emoji: "🎒" },
  ];

  return (
    <section className="py-12 px-4 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-neutral-800 mb-10">
          NUESTROS MEJORES PRODUCTOS
        </h2>

        {products.length === 0 ? (
          // Mostrar placeholders cuando no hay productos
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {placeholders.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-neutral-100"
              >
                {/* Imagen placeholder */}
                <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center text-6xl">
                  {item.emoji}
                </div>

                {/* Info */}
                <div className="p-4 text-center">
                  <h3 className="font-bold text-neutral-800 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-primary-600 font-bold text-lg mb-3">
                    {item.price}
                  </p>
                  <button className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                    <FiShoppingCart size={16} />
                    Añadir al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Cuando haya productos reales
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-primary-500 font-bold">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje para admin */}
        <div className="mt-12 text-center p-6 bg-accent-yellow/30 rounded-2xl">
          <p className="text-amber-800 font-medium">
            📝 Los productos reales se agregarán desde el panel de
            administración
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
