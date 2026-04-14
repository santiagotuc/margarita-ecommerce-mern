const mongoose = require("mongoose");

const siteConfigSchema = new mongoose.Schema(
  {
    // Hero/Bienvenida
    hero: {
      title: { type: String, default: "Bienvenidos al mundo de Margarita" },
      subtitle: { type: String, default: "Estilo y alegría para tu día a día" },
      image: { type: String, default: "" }, // URL de imagen subida
      buttonText: { type: String, default: "Ver Productos" },
    },

    // Contacto global (aparece en navbar, footer, contacto)
    contact: {
      email: { type: String, default: "e-mail@margarita27.com" },
      phone: { type: String, default: "(913) 956-3938" },
      whatsapp: { type: String, default: "" },
      address: { type: String, default: "" },
      schedule: { type: String, default: "Lun - Vie: 9:00 - 18:00" },
    },

    // Redes sociales
    social: {
      instagram: { type: String, default: "@margarita27_10" },
      facebook: { type: String, default: "" },
      youtube: { type: String, default: "" },
      tiktok: { type: String, default: "" },
    },

    // SEO/General
    siteName: { type: String, default: "Margarita By Ari Rivarola" },
    logo: {
      type: String,
      default: "https://imagenbes.netlify.app/logos/margarita.jpeg",
    },

    // Secciones editables
    aboutUs: {
      title: { type: String, default: "Sobre Nosotros" },
      content: {
        type: String,
        default:
          "Somos Margarita, dedicados a traer estilo y alegría para tu día a día...",
      },
      image: { type: String, default: "" },
    },

    // Footer info
    footerInfo: {
      payment: {
        type: String,
        default: "Aceptamos tarjetas de crédito, débito y transferencias",
      },
      shipping: {
        type: String,
        default: "Envíos a todo el país. Gratis en compras mayores a $50.000",
      },
      returns: { type: String, default: "Devoluciones dentro de los 30 días" },
    },

    // Configuración de banners
    banners: {
      newArrivals: {
        title: { type: String, default: "Nuevas Llegadas" },
        subtitle: { type: String, default: "Descubre lo último" },
        enabled: { type: Boolean, default: true },
      },
      featured: {
        title: { type: String, default: "Kits Escolares" },
        subtitle: { type: String, default: "Todo en uno" },
        enabled: { type: Boolean, default: true },
      },
      collection: {
        title: { type: String, default: "Colección de Botellas" },
        subtitle: { type: String, default: "Mantente hidratado" },
        enabled: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true },
);

// Singleton - solo debe haber un documento
siteConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

module.exports = mongoose.model("SiteConfig", siteConfigSchema);
