import { Link } from "react-router-dom";

const CategoryCircles = () => {
  const categories = [
    {
      name: "Mochilas",
      emoji: "🎒",
      color: "bg-accent-lavender",
      href: "#mochilas",
    },
    {
      name: "Botellas",
      emoji: "💧",
      color: "bg-accent-mint",
      href: "#botellas",
    },
    { name: "Tazas", emoji: "☕", color: "bg-accent-pink", href: "#tazas" },
    {
      name: "Kits Escolares",
      emoji: "🎨",
      color: "bg-accent-yellow",
      href: "#kits",
    },
  ];

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
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className="group flex flex-col items-center text-center"
            >
              <div
                className={`${cat.color} w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-xl`}
              >
                {cat.emoji}
              </div>
              <h3 className="font-bold text-neutral-800 mb-1">{cat.name}</h3>
              <p className="text-xs text-primary-500 uppercase tracking-wide font-medium">
                Ver {cat.name.toLowerCase()} →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;
