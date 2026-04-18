import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";

const Hero = () => {
  const { config } = useSite();

  const heroData = config?.hero || {
    title: "Bienvenidos al mundo de Margarita",
    subtitle: "Estilo y alegría para tu día a día",
    image: "https://via.placeholder.com/600x800?text=Foto+Margarita",
  };

  return (
    <section className="relative bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center min-h-[600px]">
          <div className="w-full md:w-1/2 p-8 md:p-12 z-10">
            <h1 className="text-5xl md:text-6xl font-black text-neutral-800 leading-tight mb-6">
              {heroData.title}
            </h1>
            <p className="text-xl text-neutral-600 mb-8">{heroData.subtitle}</p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/productos"
                className="bg-primary-500 text-white px-8 py-3 rounded-full font-medium hover:bg-primary-600 transition-colors shadow-lg"
              >
                Ver Productos
              </Link>
              <Link
                to="/nosotros"
                className="border-2 border-primary-500 text-primary-500 px-8 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors"
              >
                Conocer Más
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 h-[400px] md:h-[600px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-50 to-transparent z-10 md:hidden"></div>
            {heroData.image ? (
              <img
                src={heroData.image}
                alt="Portada Margarita"
                className="w-full h-full object-cover rounded-l-3xl md:rounded-none shadow-2xl"
              />
            ) : (
              <div className="w-full h-full bg-primary-100 flex items-center justify-center rounded-l-3xl">
                <span className="text-primary-500 font-bold">
                  Falta subir imagen
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
