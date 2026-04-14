const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-accent-lavender/30 via-white to-accent-pink/30 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Texto */}
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl lg:text-6xl font-bold text-neutral-800 leading-tight mb-6">
              Bienvenidos al mundo de{" "}
              <span className="text-primary-500">Margarita</span>.
            </h2>
            <p className="text-xl lg:text-2xl text-neutral-600 mb-8">
              Estilo y alegría para tu día a día.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary-500 text-white px-8 py-3 rounded-full font-medium hover:bg-primary-600 transition-colors shadow-lg">
                Ver Productos
              </button>
              <button className="border-2 border-primary-500 text-primary-500 px-8 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors">
                Conocer Más
              </button>
            </div>
          </div>

          {/* Imagen placeholder */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              {/* Círculo decorativo */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-accent-pink rounded-full blur-3xl opacity-50 scale-110"></div>

              {/* Placeholder de imagen */}
              <div className="relative bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-3xl w-full max-w-md aspect-[4/5] flex items-center justify-center shadow-2xl">
                <div className="text-center p-8">
                  <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-6xl">🎒</span>
                  </div>
                  <p className="text-neutral-500 font-medium">
                    Imagen de niña con mochila
                  </p>
                  <p className="text-neutral-400 text-sm mt-2">
                    (Espacio reservado)
                  </p>
                </div>
              </div>

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
