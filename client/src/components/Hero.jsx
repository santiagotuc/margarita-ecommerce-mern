import { useSite } from "../context/SiteContext";
import { Link } from "react-router-dom";

const Hero = () => {
  const { hero } = useSite();

  // Si no hay hero en la base de datos, usar estos valores por defecto
  const heroData = hero || {
    title: "Bienvenidos al mundo de Margarita.",
    subtitle: "Estilo y alegría para tu día a día.",
    image: "",
    buttonText: "Ver Productos",
  };

  return (
    <section className="bg-gradient-to-r from-accent-lavender/30 via-white to-accent-pink/30 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Texto DINÁMICO */}
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl lg:text-6xl font-bold text-neutral-800 leading-tight mb-6">
              {heroData.title?.split("Margarita")[0]}
              <span className="text-primary-500">Margarita</span>
              {heroData.title?.split("Margarita")[1]}
            </h2>
            <p className="text-xl lg:text-2xl text-neutral-600 mb-8">
              {heroData.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/productos"
                className="bg-primary-500 text-white px-8 py-3 rounded-full font-medium hover:bg-primary-600 transition-colors shadow-lg"
              >
                {heroData.buttonText || "Ver Productos"}
              </Link>
              <Link
                to="/categorias"
                className="border-2 border-primary-500 text-primary-500 px-8 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors"
              >
                Conocer Más
              </Link>
            </div>
          </div>

          {/* Imagen DINÁMICA */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-accent-pink rounded-full blur-3xl opacity-50 scale-110"></div>

              {heroData.image ? (
                <img
                  src={heroData.image}
                  alt="Hero"
                  className="relative w-full max-w-md aspect-[4/5] object-cover rounded-3xl shadow-2xl"
                />
              ) : (
                <div className="relative bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl w-full max-w-md aspect-[4/5] flex items-center justify-center shadow-2xl">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-6xl">🎒</span>
                    </div>
                    <p className="text-neutral-500 font-medium">
                      Imagen de niña con mochila
                    </p>
                    <p className="text-neutral-400 text-sm mt-2">
                      (Subir desde Admin)
                    </p>
                  </div>
                </div>
              )}

              {/* Badge flotante */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
                <p className="text-2xl font-bold text-primary-500">Nuevos</p>
                <p className="text-sm text-neutral-600">Diseños 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
