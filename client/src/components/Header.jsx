import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const menuItems = [
    { name: "MOCHILAS", href: "#mochilas" },
    { name: "BOTELLAS", href: "#botellas" },
    { name: "KITS ESCOLARES", href: "#kits" },
    { name: "LIBRETAS", href: "#libretas" },
    { name: "ACCESORIOS", href: "#accesorios" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Barra superior */}
      <div className="bg-primary-500 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>✉️ e-mail@margarita27.com</span>
            <span>📞 (913) 956-3938</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span>🚚 Envíos gratis en compras mayores a $50.000</span>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo placeholder */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-300 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
              M
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-primary-600">Margarita</h1>
              <p className="text-xs text-neutral-500">By Ari Rivarola</p>
            </div>
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className="text-neutral-800 hover:text-primary-500 font-medium"
            >
              INICIO
            </Link>

            {/* Menú desplegable */}
            <div className="relative">
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                className="flex items-center gap-1 text-neutral-800 hover:text-primary-500 font-medium"
              >
                PRODUCTOS <FiChevronDown />
              </button>

              {productsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-neutral-200 py-2">
                  {menuItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/nosotros"
              className="text-neutral-800 hover:text-primary-500 font-medium"
            >
              SOBRE NOSOTROS
            </Link>
            <Link
              to="/contacto"
              className="text-neutral-800 hover:text-primary-500 font-medium"
            >
              CONTACTO
            </Link>
          </nav>

          {/* Buscador y carrito */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-neutral-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent outline-none text-sm w-32 lg:w-48"
              />
              <FiSearch className="text-neutral-500" />
            </div>

            <button className="relative p-2 hover:bg-neutral-100 rounded-full">
              <FiShoppingCart className="text-xl text-neutral-700" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* Menú móvil */}
            <button
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 px-4 py-4">
          <nav className="flex flex-col gap-3">
            <Link to="/" className="py-2 text-neutral-800 font-medium">
              INICIO
            </Link>
            <p className="font-medium text-neutral-600 mt-2">PRODUCTOS</p>
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="py-2 pl-4 text-neutral-600 text-sm"
              >
                {item.name}
              </a>
            ))}
            <Link to="/nosotros" className="py-2 text-neutral-800 font-medium">
              SOBRE NOSOTROS
            </Link>
            <Link to="/contacto" className="py-2 text-neutral-800 font-medium">
              CONTACTO
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
