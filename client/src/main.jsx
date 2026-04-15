import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { SiteProvider } from "./context/SiteContext";
import { CartProvider } from "./context/CartContext"; // <-- 1. Importamos el contexto del carrito
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SiteProvider>
        <CartProvider>
          {" "}
          {/* <-- 2. Envolvemos la app con el proveedor del carrito */}
          <App />
        </CartProvider>
      </SiteProvider>
    </Provider>
  </StrictMode>,
);
