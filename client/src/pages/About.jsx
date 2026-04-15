import { useSite } from "../context/SiteContext";

const About = () => {
  // Traemos los textos mágicamente desde la base de datos
  const { aboutUs, siteName } = useSite();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
      <div className="bg-white rounded-[2rem] shadow-sm border border-neutral-100 p-8 md:p-16 text-center">
        <span className="text-primary-500 font-bold uppercase tracking-widest text-sm mb-4 block">
          Conoce nuestra historia
        </span>

        <h1 className="text-4xl md:text-5xl font-black text-neutral-800 mb-8">
          {aboutUs?.title || `Sobre ${siteName || "Nosotros"}`}
        </h1>

        <div className="w-24 h-1 bg-primary-500 mx-auto mb-10 rounded-full"></div>

        {/* whitespace-pre-line respeta los "Enter" que la admin ponga en el texto */}
        <p className="text-lg text-neutral-600 leading-relaxed whitespace-pre-line max-w-2xl mx-auto font-medium">
          {aboutUs?.content ||
            "Bienvenidos a nuestra tienda. Estamos dedicados a ofrecerte los mejores productos."}
        </p>
      </div>
    </div>
  );
};

export default About;
