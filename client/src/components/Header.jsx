import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useSite } from "../context/SiteContext";
import {
  FiSearch,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
  FiPhone,
  FiMail,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { categories, contact, logo, siteName } = useSite();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activeCategories = categories?.filter((cat) => cat.isActive) || [];

  const menuItems =
    activeCategories.length > 0
      ? activeCategories
      : [
          { name: "MOCHILAS", slug: "mochilas" },
          { name: "BOTELLAS", slug: "botellas" },
          { name: "KITS ESCOLARES", slug: "kits-escolares" },
          { name: "LIBRETAS", slug: "libretas" },
          { name: "ACCESORIOS", slug: "accesorios" },
        ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Barra superior */}
      <div className="bg-primary-500 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FiMail size={14} />
              {contact?.email || "e-mail@margarita27.com"}
            </span>
            <span className="flex items-center gap-1">
              <FiPhone size={14} />
              {contact?.phone || "(913) 956-3938"}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span>🚚 Envíos gratis en compras mayores a $50.000</span>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt="Logo"
                className="w-16 h-16 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-primary-300 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                M
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-primary-600">
                {siteName?.split("By")[0] || "Margarita"}
              </h1>
              <p className="text-xs text-neutral-500">
                {siteName?.includes("By")
                  ? siteName.split("By")[1]
                  : "By Ari Rivarola"}
              </p>
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
                CATEGORÍAS <FiChevronDown />
              </button>

              {productsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-neutral-200 py-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item._id || item.slug}
                      to={`/categoria/${item.slug}`}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                      onClick={() => setProductsOpen(false)}
                    >
                      {item.name}
                    </Link>
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

          {/* Buscador, carrito y usuario */}
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

            {/* BOTÓN DE LOGIN o MENÚ DE USUARIO */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-neutral-100 rounded-full"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-primary-600" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-neutral-700">
                    {user?.firstName}
                  </span>
                  <FiChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-neutral-200 py-2">
                    {user?.role === "admin" && (
                      <>
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Panel Admin
                        </Link>
                        <div className="border-t border-neutral-100 my-1"></div>
                      </>
                    )}
                    <Link
                      to="/perfil/editar"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Editar Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiLogOut size={14} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/registrarse"
                  className="hidden md:block text-primary-600 font-medium hover:text-primary-700"
                >
                  Registrarse
                </Link>
                <Link
                  to="/ingresar"
                  className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-600 transition-colors"
                >
                  Ingresar
                </Link>
              </>
            )}

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
            <p className="font-medium text-neutral-600 mt-2">CATEGORÍAS</p>
            {menuItems.map((item) => (
              <Link
                key={item._id || item.slug}
                to={`/categoria/${item.slug}`}
                className="py-2 pl-4 text-neutral-600 text-sm"
              >
                {item.name}
              </Link>
            ))}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/ingresar"
                  className="py-2 text-primary-600 font-medium"
                >
                  Ingresar
                </Link>
                <Link
                  to="/registrarse"
                  className="py-2 text-primary-600 font-medium"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <>
                <div className="border-t border-neutral-200 my-2"></div>
                <p className="font-medium text-neutral-600">Mi Cuenta</p>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="py-2 pl-4 text-neutral-600 text-sm"
                  >
                    Panel Admin
                  </Link>
                )}
                <Link
                  to="/perfil/editar"
                  className="py-2 pl-4 text-neutral-600 text-sm"
                >
                  Editar Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2 pl-4 text-red-600 text-sm text-left"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
