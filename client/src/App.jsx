import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Hero from "./components/Hero";
import BannerSection from "./components/BannerSection";
import CategoryCards from "./components/CategoryCards";
import ProductGrid from "./components/ProductGrid";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminProfile from "./pages/AdminProfile";
import AdminCategories from "./pages/AdminCategories";
import AdminSettings from "./pages/AdminSettings";
import AdminProducts from "./pages/AdminProducts";
import Shop from "./pages/Shop";

// Scroll to top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

// Home completo
const Home = () => (
  <>
    <Hero />
    <BannerSection />
    <CategoryCards />
    <ProductGrid />
  </>
);

// Layout con Header/Footer
const MainLayout = ({ children }) => (
  <>
    <Header />
    <main className="min-h-screen">{children}</main>
    <Footer />
  </>
);

const EditProfile = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Editar Perfil</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <p>
          <strong>Nombre:</strong> {user?.firstName} {user?.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p className="text-gray-500 mt-4">
          Funcionalidad completa en desarrollo...
        </p>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Login - Sin layout */}
        <Route path="/ingresar" element={<Login />} />
        <Route path="/registrarse" element={<Register />} />
        {/* Redirects por si alguien usa /login */}
        <Route path="/login" element={<Login />} />
        {/* Rutas públicas con layout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/productos"
          element={
            <MainLayout>
              <Shop />
            </MainLayout>
          }
        />

        {/* Rutas de Admin (protegidas) */}
        <Route
          path="/admin"
          element={
            <MainLayout>
              <PrivateRoute adminOnly>
                <AdminProfile />
              </PrivateRoute>
            </MainLayout>
          }
        />

        <Route
          path="/admin/categorias"
          element={
            <MainLayout>
              <PrivateRoute adminOnly>
                <AdminCategories />
              </PrivateRoute>
            </MainLayout>
          }
        />

        <Route
          path="/admin/productos"
          element={
            <MainLayout>
              <PrivateRoute adminOnly>
                <AdminProducts />
              </PrivateRoute>
            </MainLayout>
          }
        />

        <Route
          path="/admin/configuracion"
          element={
            <MainLayout>
              <PrivateRoute adminOnly>
                <AdminSettings />
              </PrivateRoute>
            </MainLayout>
          }
        />

        {/* Perfil de usuario (protegido) */}
        <Route
          path="/perfil/editar"
          element={
            <MainLayout>
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            </MainLayout>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <MainLayout>
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p>Página no encontrada</p>
              </div>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
