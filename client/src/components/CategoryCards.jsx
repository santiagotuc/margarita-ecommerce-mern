import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";

const CategoryCards = () => {
  const { categories } = useSite();

  // Filtramos solo las activas
  const activeCategories = categories.filter((cat) => cat.isActive);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-800 uppercase tracking-widest">
            Nuestras Colecciones
          </h2>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeCategories.map((cat) => (
            <Link
              key={cat._id}
              to={`/categoria/${cat.slug}`}
              className="group relative h-80 overflow-hidden rounded-2xl shadow-md block"
            >
              {/* Imagen de fondo */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Overlay oscuro */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>

              {/* Texto al centro */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 transform group-hover:-translate-y-1 transition-transform text-center">
                  {cat.name}
                </h3>
                <span className="bg-white text-neutral-900 px-6 py-2 rounded-full text-xs font-bold uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  Ver Colección
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
