import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminProfile from "./pages/AdminProfile";
import AdminCategories from "./pages/AdminCategories";
import CategoryGrid from "./components/Home/CategoryGrid";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CategoryGrid />} />
        <Route path="/admin" element={<AdminProfile />} />
        <Route path="/admin/categorias" element={<AdminCategories />} />
      </Routes>
    </Router>
  );
}

export default App;
