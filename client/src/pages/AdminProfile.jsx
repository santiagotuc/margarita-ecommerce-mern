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
      // Aquí luego agregaremos usuarios y órdenes
      setStats({
        products: productsRes.data.total,
        users: 0, // Temporal
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
      title: "Gestionar Productos",
      description: "Crear, editar, eliminar productos",
      link: "/admin/productos",
      color: "bg-primary",
    },
    {
      icon: FiUsers,
      title: "Gestionar Usuarios",
      description: "Ver usuarios, asignar roles",
      link: "/admin/usuarios",
      color: "bg-green-500",
    },
    {
      icon: FiEdit,
      title: "Mi Perfil",
      description: "Editar datos personales",
      link: "/perfil/editar",
      color: "bg-purple-500",
    },
    {
      icon: FiKey,
      title: "Cambiar Contraseña",
      description: "Seguridad de la cuenta",
      link: "/perfil/password",
      color: "bg-orange-500",
    },
  ];

  if (loading) return <div className="text-center py-12">Cargando...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold">
            {user?.firstName?.[0] || user?.email?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-500">{user?.email}</p>
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mt-2">
              Administrador
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-primary">{stats.products}</p>
            <p className="text-sm text-gray-500">Productos</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600">{stats.users}</p>
            <p className="text-sm text-gray-500">Usuarios</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">{stats.orders}</p>
            <p className="text-sm text-gray-500">Pedidos</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Panel de Control</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div
              className={`${item.color} text-white p-4 rounded-xl group-hover:scale-110 transition-transform`}
            >
              <item.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </div>
            <span className="text-gray-400 group-hover:text-primary transition-colors">
              →
            </span>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group text-left md:col-span-2"
        >
          <div className="bg-red-500 text-white p-4 rounded-xl group-hover:scale-110 transition-transform">
            <FiLogOut size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-red-600 group-hover:text-red-700 transition-colors">
              Cerrar Sesión
            </h3>
            <p className="text-gray-500 text-sm">
              Salir del panel de administración
            </p>
          </div>
          <span className="text-red-400 group-hover:text-red-600 transition-colors">
            →
          </span>
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
