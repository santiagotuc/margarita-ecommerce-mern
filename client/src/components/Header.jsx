import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSite } from "../context/SiteContext";
import { useCart } from "../context/CartContext"; // <-- 1. Importamos el Carrito
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { logout } from "../store/authSlice";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { contact, categories, siteName } = useSite();

  // 2. Extraemos el contador y la función para abrir el carrito lateral
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
    setProductsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <>
      {/* Top Bar - Contact Info */}
      <div className="bg-primary-500 text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {contact?.email && <span>{contact.email}</span>}
            {contact?.phone && <span>{contact.phone}</span>}
          </div>
          <div className="flex items-center gap-4 font-medium tracking-wide">
            <span>ENVÍOS A TODO EL PAÍS</span>
            <span>COMPRA 100% SEGURA</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
            : "bg-white py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-neutral-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-black text-neutral-800 tracking-tighter"
          >
            {siteName || "MARGARITA"}
            <span className="text-primary-500">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-neutral-800 hover:text-primary-500 font-medium transition-colors"
            >
              INICIO
            </Link>

            {/* Categorías Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                className="flex items-center gap-1 text-neutral-800 hover:text-primary-500 font-medium transition-colors"
              >
                CATEGORÍAS <FiChevronDown />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 py-2 transition-all duration-200 ${productsOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
              >
                <Link
                  to="/productos"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 font-bold border-b border-neutral-50 mb-1"
                >
                  Ver Todo el Catálogo
                </Link>
                {activeCategories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/categoria/${cat.slug}`}
                    className="block px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-primary-500 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/nosotros"
              className="text-neutral-800 hover:text-primary-500 font-medium transition-colors"
            >
              NOSOTROS
            </Link>
            <Link
              to="/contacto"
              className="text-neutral-800 hover:text-primary-500 font-medium transition-colors"
            >
              CONTACTO
            </Link>
          </nav>

          {/* Icons (Desktop & Mobile) */}
          <div className="flex items-center gap-5">
            {/* 3. BOTÓN DEL CARRITO CON BURBUJA */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-neutral-800 hover:text-primary-500 transition-colors relative"
            >
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/admin"
                  className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm"
                >
                  {user.firstName ? user.firstName[0] : "A"}
                </Link>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-neutral-800">
                    {user.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-[10px] text-neutral-500 hover:text-red-500 text-left uppercase font-bold tracking-wider"
                  >
                    Salir
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/ingresar"
                className="hidden md:block text-neutral-800 hover:text-primary-500 transition-colors"
              >
                <FiUser size={22} />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-neutral-100 shadow-xl transition-all duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible h-0 overflow-hidden"}`}
        >
          <div className="p-4 flex flex-col gap-4">
            <Link
              to="/"
              className="font-bold text-neutral-800 py-2 border-b border-neutral-50"
            >
              INICIO
            </Link>

            <div>
              <p className="font-bold text-neutral-400 text-xs mb-2">
                CATEGORÍAS
              </p>
              <div className="flex flex-col gap-2 pl-4 border-l-2 border-primary-100">
                <Link
                  to="/productos"
                  className="text-neutral-800 font-bold py-1"
                >
                  Ver Todo
                </Link>
                {activeCategories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/categoria/${cat.slug}`}
                    className="text-neutral-600 py-1"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/nosotros"
              className="font-bold text-neutral-800 py-2 border-b border-neutral-50"
            >
              NOSOTROS
            </Link>
            <Link
              to="/contacto"
              className="font-bold text-neutral-800 py-2 border-b border-neutral-50"
            >
              CONTACTO
            </Link>

            {user ? (
              <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-3">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-primary-600 font-bold bg-primary-50 p-3 rounded-lg"
                >
                  <FiSettings /> Panel de Administración
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 font-bold p-3"
                >
                  <FiLogOut /> Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                to="/ingresar"
                className="mt-4 flex items-center justify-center gap-2 bg-neutral-800 text-white p-3 rounded-lg font-bold"
              >
                <FiUser /> Iniciar Sesión (Admin)
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
