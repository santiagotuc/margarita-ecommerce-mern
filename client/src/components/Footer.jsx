import { FiInstagram, FiFacebook, FiYoutube, FiMail } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    informacion: ["Pago", "Envíos", "Devoluciones", "FAQ"],
    productos: [
      "Mochilas",
      "Botellas",
      "Kits Escolares",
      "Libretas",
      "Accesorios",
    ],
  };

  return (
    <footer className="bg-neutral-100 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Información */}
          <div>
            <h4 className="font-bold text-neutral-800 mb-4 uppercase text-sm tracking-wide">
              Información
            </h4>
            <ul className="space-y-2">
              {footerLinks.informacion.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-neutral-600 hover:text-primary-500 text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Productos */}
          <div>
            <h4 className="font-bold text-neutral-800 mb-4 uppercase text-sm tracking-wide">
              Productos
            </h4>
            <ul className="space-y-2">
              {footerLinks.productos.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-neutral-600 hover:text-primary-500 text-sm transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h4 className="font-bold text-neutral-800 mb-4 uppercase text-sm tracking-wide">
              Síguenos
            </h4>
            <div className="flex gap-3 mb-4">
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:bg-primary-500 hover:text-white transition-colors shadow-sm"
              >
                <FiInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:bg-primary-500 hover:text-white transition-colors shadow-sm"
              >
                <FiFacebook />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:bg-primary-500 hover:text-white transition-colors shadow-sm"
              >
                <FiYoutube />
              </a>
            </div>
            <p className="text-neutral-500 text-sm">@margarita27_10</p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-neutral-800 mb-4 uppercase text-sm tracking-wide">
              Newsletter
            </h4>
            <p className="text-neutral-600 text-sm mb-3">
              Regístrate y recibe nuestras novedades
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu e-mail"
                className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500"
              />
              <button className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
                Suscribir
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-200 pt-6 text-center">
          <p className="text-neutral-500 text-sm">
            Margarita By Ari Rivarola © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
