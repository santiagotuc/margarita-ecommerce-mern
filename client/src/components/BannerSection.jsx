const BannerSection = () => {
  const banners = [
    {
      title: "Nuevas Llegadas",
      subtitle: "Descubre lo último",
      bg: "bg-gradient-to-br from-accent-lavender to-primary-100",
      emoji: "✨",
      color: "text-primary-700",
    },
    {
      title: "Kits Escolares",
      subtitle: "Todo en uno",
      bg: "bg-gradient-to-br from-accent-yellow to-orange-100",
      emoji: "🎨",
      color: "text-amber-700",
    },
    {
      title: "Colección de Botellas",
      subtitle: "Mantente hidratado",
      bg: "bg-gradient-to-br from-accent-mint to-emerald-100",
      emoji: "💧",
      color: "text-emerald-700",
    },
  ];

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`${banner.bg} rounded-2xl p-6 flex items-center justify-between cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1`}
            >
              <div>
                <h3 className={`text-xl font-bold ${banner.color} mb-1`}>
                  {banner.title}
                </h3>
                <p className="text-neutral-600 text-sm mb-3">
                  {banner.subtitle}
                </p>
                <button className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-neutral-700 hover:bg-white transition-colors">
                  Comprar ahora →
                </button>
              </div>
              <div className="text-5xl">{banner.emoji}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
