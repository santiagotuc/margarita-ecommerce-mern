import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiPackage,
  FiUsers,
  FiBarChart2,
  FiLogOut,
  FiEdit,
  FiKey,
  FiSettings,
  FiGrid,
} from "react-icons/fi";
import api from "../services/api";
import { logout } from "../store/authSlice";

const AdminProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const productsRes = await api.get("/products?limit=1");
      setStats({
        products: productsRes.data.total,
        users: 1, // Temporal
        orders: 0, // Temporal
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    {
      icon: FiBarChart2,
      title: "Dashboard",
      description: "Estadísticas y métricas",
      link: "/admin",
      color: "bg-blue-500",
    },
    {
      icon: FiPackage,
      title: "Productos",
      description: "Gestionar inventario",
      link: "/admin/productos",
      color: "bg-primary-500",
    },
    {
      icon: FiGrid,
      title: "Categorías",
      description: "Crear y organizar categorías",
      link: "/admin/categorias",
      color: "bg-pink-500",
    },
    {
      icon: FiSettings,
      title: "Configuración Tienda",
      description: "Datos, redes sociales y textos",
      link: "/admin/configuracion",
      color: "bg-emerald-500",
    },
    {
      icon: FiUsers,
      title: "Usuarios",
      description: "Gestionar clientes",
      link: "/admin/usuarios",
      color: "bg-indigo-500",
    },
    {
      icon: FiEdit,
      title: "Mi Cuenta",
      description: "Editar mis datos personales",
      link: "/perfil/editar",
      color: "bg-purple-500",
    },
  ];

  if (loading) return <div className="text-center py-12">Cargando...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 pb-12">
      {/* Tarjeta de Bienvenida */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-purple-500 text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg shadow-primary-500/30">
            {user?.firstName?.[0] || user?.email?.[0]}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-neutral-800">
              ¡Hola, {user?.firstName}! 👋
            </h1>
            <p className="text-neutral-500 mb-2">{user?.email}</p>
            <span className="inline-block bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
              Administradora
            </span>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <p className="text-3xl font-black text-primary-500 mb-1">
              {stats.products}
            </p>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Productos
            </p>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <p className="text-3xl font-black text-indigo-500 mb-1">
              {stats.users}
            </p>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Usuarios
            </p>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
            <p className="text-3xl font-black text-emerald-500 mb-1">
              {stats.orders}
            </p>
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Pedidos
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-neutral-800">
        Panel de Control
      </h2>

      {/* Grilla de Botones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-lg hover:border-primary-200 transition-all flex items-center gap-4 group"
          >
            <div
              className={`${item.color} text-white p-4 rounded-xl group-hover:scale-110 transition-transform shadow-md`}
            >
              <item.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-neutral-800 group-hover:text-primary-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-neutral-500 text-sm mt-0.5">
                {item.description}
              </p>
            </div>
          </Link>
        ))}

        {/* Botón Salir */}
        <button
          onClick={handleLogout}
          className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-lg hover:border-red-200 transition-all flex items-center gap-4 group text-left lg:col-span-3"
        >
          <div className="bg-red-500 text-white p-4 rounded-xl group-hover:scale-110 transition-transform shadow-md">
            <FiLogOut size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-red-600 group-hover:text-red-700 transition-colors">
              Cerrar Sesión de Administrador
            </h3>
            <p className="text-neutral-500 text-sm mt-0.5">
              Salir de forma segura del panel
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
