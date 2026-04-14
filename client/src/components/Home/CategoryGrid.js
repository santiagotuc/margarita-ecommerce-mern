import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  FiDroplet,
  FiSun,
  FiHeart,
  FiBox,
  FiPackage,
  FiWind,
  FiFeather,
  FiHexagon,
} from "react-icons/fi";

const iconMap = {
  droplet: FiDroplet,
  sun: FiSun,
  heart: FiHeart,
  box: FiBox,
  package: FiPackage,
  wind: FiWind,
  feather: FiFeather,
  hexagon: FiHexagon,
};

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="text-center">Cargando categorías...</div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Explora por Categoría
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Encuentra todo lo que necesitas para tus proyectos artesanales
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || FiBox;
          return (
            <Link
              key={cat._id}
              to={`/productos/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-square relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className="text-2xl" />
                    <h3 className="font-bold text-xl">{cat.name}</h3>
                  </div>
                  <p className="text-sm text-white/80 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
