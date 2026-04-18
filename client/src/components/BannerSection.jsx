import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";

const BannerSection = () => {
  const { config } = useSite();
  const bannersConfig = config?.banners || {};

  const banners = [
    {
      title: bannersConfig.newArrivals?.title || "Nuevas Llegadas",
      subtitle: bannersConfig.newArrivals?.subtitle || "Lo último en tienda",
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      emoji: "✨",
      color: "text-blue-700",
      link: "/productos?filtro=nuevos",
    },
    {
      title: bannersConfig.featured?.title || "Kit Margarita",
      subtitle: bannersConfig.featured?.subtitle || "Todo en uno",
      bg: "bg-gradient-to-br from-orange-50 to-orange-100",
      emoji: "🎁",
      color: "text-orange-700",
      link: "/productos?filtro=kits",
    },
    {
      title: bannersConfig.collection?.title || "Ofertas Semanales",
      subtitle: bannersConfig.collection?.subtitle || "Descuentos únicos",
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      emoji: "🔥",
      color: "text-red-700",
      link: "/productos?filtro=ofertas",
    },
  ];

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {banners.map((banner, index) => (
            <Link
              key={index}
              to={banner.link}
              className={`${banner.bg} rounded-2xl p-6 flex items-center justify-between group hover:shadow-lg transition-all hover:-translate-y-1 border border-white/50`}
            >
              <div>
                <h3 className={`text-xl font-bold ${banner.color} mb-1`}>
                  {banner.title}
                </h3>
                <p className="text-neutral-600 text-sm mb-3">
                  {banner.subtitle}
                </p>
                <span className="inline-block bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-neutral-700 group-hover:bg-white group-hover:text-primary-500 transition-colors shadow-sm">
                  Ver productos →
                </span>
              </div>
              <div className="text-5xl group-hover:scale-110 transition-transform">
                {banner.emoji}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
