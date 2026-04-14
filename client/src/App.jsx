import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BannerSection from "./components/BannerSection";
import CategoryCircles from "./components/CategoryCircles";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import AdminProfile from "./pages/AdminProfile";
import AdminCategories from "./pages/AdminCategories";

// Scroll to top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

const Home = () => (
  <>
    <Hero />
    <BannerSection />
    <CategoryCircles />
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Login - Sin layout, pantalla completa */}
        <Route path="/login" element={<Login />} />

        {/* Rutas con layout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <MainLayout>
              <AdminProfile />
            </MainLayout>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <MainLayout>
              <AdminCategories />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
