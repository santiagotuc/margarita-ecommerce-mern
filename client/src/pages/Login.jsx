import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import api from "../services/api";
import { login } from "../store/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", formData);
      dispatch(login(data));
      localStorage.setItem("token", data.token);
      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Fondo animado con círculos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Patrón de flores decorativo */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse-soft">
        🌸
      </div>
      <div
        className="absolute bottom-20 right-10 text-5xl opacity-20 animate-pulse-soft"
        style={{ animationDelay: "1s" }}
      >
        🌺
      </div>
      <div
        className="absolute top-1/3 right-20 text-4xl opacity-15 animate-pulse-soft"
        style={{ animationDelay: "2s" }}
      >
        🌼
      </div>

      {/* Card principal */}
      <div
        className={`relative z-10 w-full max-w-md ${mounted ? "animate-slide-up" : "opacity-0"}`}
      >
        {/* Logo flotante */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full blur-lg opacity-50 scale-110 animate-pulse-soft"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-white text-4xl font-bold">M</span>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-yellow-700 text-sm">✿</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="glass rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Bienvenida
            </h1>
            <p className="text-neutral-500">Ingresa a tu tienda Margarita</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="group">
              <label className="block text-sm font-medium text-neutral-700 mb-2 ml-1">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none text-neutral-700 placeholder-neutral-400"
                  placeholder="ari@margarita.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-medium text-neutral-700 mb-2 ml-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-12 pr-12 py-4 bg-white/50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all outline-none text-neutral-700 placeholder-neutral-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Recordarme y olvidé */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-400"
                />
                <span className="text-neutral-600">Recordarme</span>
              </label>
              <Link
                to="#"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative py-4 px-6 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Entrando...
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/50 text-neutral-500">
                Credenciales de prueba
              </span>
            </div>
          </div>

          {/* Info de demo */}
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔑</span>
              <div>
                <p className="font-medium text-amber-800 text-sm mb-1">
                  Acceso de administradora
                </p>
                <p className="text-amber-700 text-xs">
                  Email:{" "}
                  <span className="font-mono font-medium">
                    ari@margarita.com
                  </span>
                </p>
                <p className="text-amber-700 text-xs">
                  Pass:{" "}
                  <span className="font-mono font-medium">margarita2024</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-neutral-500 text-sm">
          ¿Necesitas ayuda?{" "}
          <Link
            to="#"
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            Contactar soporte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
