import {
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiMessageCircle,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { useSite } from "../context/SiteContext";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  // Traemos toda la info de la base de datos a través de tu contexto
  const { contact, social, siteName, aboutUs } = useSite();

  const footerLinks = {
    productos: [
      { name: "Mochilas", slug: "mochilas" },
      { name: "Botellas", slug: "botellas" },
      { name: "Kits Escolares", slug: "kits-escolares" },
      { name: "Ver Todos", slug: "" },
    ],
  };

  return (
    <footer className="bg-neutral-100 pt-16 pb-8 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* 1. Sobre Nosotros */}
          <div>
            <h4 className="font-bold text-neutral-800 mb-4 uppercase text-sm tracking-widest">
              {aboutUs?.title || "Sobre Nosotros"}
            </h4>
            <p className="text-neutral-600 text-sm leading-relaxed mb-4">
              {aboutUs?.content ||
                "Bienvenidos a Margarita. Estilo y alegría para tu día a día."}
            </p>
          </div>

          {/* 2. Enlaces Rápidos (Productos) */}
          <div>
            <h4 className="font-bold text-neutral-800 mb-4 uppercase text-sm tracking-widest">
              Nuestros Productos
            </h4>
            <ul className="space-y-3">
              {footerLinks.productos.map((link) => (
                <li key={link.name}>
                  <Link
                    to={`/categoria/${link.slug}`}
                    className="text-neutral-600 hover:text-primary-500 text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="text-primary-300">›</span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Datos de Contacto */}
          <div>
            <h4 className="font-bold text-neutral-800 mb-4 uppercase text-sm tracking-widest">
              Contáctanos
            </h4>
            <ul className="space-y-4">
              {contact?.phone && (
                <li className="flex items-start gap-3">
                  <FiPhone className="text-primary-500 mt-1" />
                  <span className="text-neutral-600 text-sm">
                    {contact.phone}
                  </span>
                </li>
              )}
              {contact?.email && (
                <li className="flex items-start gap-3">
                  <FiMail className="text-primary-500 mt-1" />
                  <span className="text-neutral-600 text-sm">
                    {contact.email}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* 4. Redes Sociales Dinámicas */}
          <div>
            <h4 className="font-bold text-neutral-800 mb-4 uppercase text-sm tracking-widest">
              Síguenos
            </h4>
            <div className="flex gap-3 mb-6">
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:bg-pink-600 hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                >
                  <FiInstagram size={18} />
                </a>
              )}
              {social?.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                >
                  <FiFacebook size={18} />
                </a>
              )}
              {social?.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                >
                  <FiYoutube size={18} />
                </a>
              )}
              {social?.tiktok && (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-neutral-600 hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                >
                  <FiMessageCircle size={18} />{" "}
                  {/* Ícono representativo para TikTok */}
                </a>
              )}
            </div>

            {/* Si todas las redes están apagadas, mostramos un mensaje sutil o nada */}
            {!social?.instagram &&
              !social?.facebook &&
              !social?.youtube &&
              !social?.tiktok && (
                <p className="text-neutral-400 text-sm">
                  No hay redes sociales vinculadas.
                </p>
              )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            © {currentYear} {siteName || "Margarita"}. Todos los derechos
            reservados.
          </p>
          <p className="text-neutral-400 text-xs">Desarrollado con ♥ por ti</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
