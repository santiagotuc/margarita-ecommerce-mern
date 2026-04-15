import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";

const CategoryCircles = () => {
  // 1. Traemos las categorías del Contexto Global que ya tienes configurado
  const { categories } = useSite();

  // 2. Filtramos SOLO las que están activas y marcadas como "destacadas" (featured)
  // Las ordenamos y cortamos para mostrar máximo 4
  const featuredCategories = categories
    .filter((cat) => cat.isActive && cat.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder)
    .slice(0, 4);

  // Si aún no ha destacado ninguna, no mostramos la sección para evitar errores visuales
  if (featuredCategories.length === 0) return null;

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-neutral-800 mb-2">
          CATEGORÍAS DESTACADAS
        </h2>
        <p className="text-center text-neutral-500 mb-10">
          Encuentra todo lo que necesitas
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {featuredCategories.map((cat) => (
            <Link
              key={cat._id}
              to={`/categoria/${cat.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-4 group-hover:scale-105 transition-transform shadow-lg group-hover:shadow-xl overflow-hidden border-4 border-white">
                {/* Usamos la imagen real que la administradora subió */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-neutral-800 mb-1">{cat.name}</h3>
              <p className="text-xs text-primary-500 uppercase tracking-wide font-medium">
                Ver todo →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;
