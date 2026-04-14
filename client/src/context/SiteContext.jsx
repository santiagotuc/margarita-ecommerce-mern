import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
    fetchCategories();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data } = await api.get("/config");
      setConfig(data);
    } catch (error) {
      console.error("Error cargando configuración:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshConfig = async () => {
    await fetchConfig();
  };

  return (
    <SiteContext.Provider
      value={{
        config,
        categories,
        loading,
        refreshConfig,
        contact: config?.contact,
        social: config?.social,
        hero: config?.hero,
        aboutUs: config?.aboutUs,
        footerInfo: config?.footerInfo,
        banners: config?.banners,
        siteName: config?.siteName,
        logo: config?.logo,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
