const SiteConfig = require("../models/SiteConfig");

// Obtener configuración pública
exports.getConfig = async (req, res) => {
  try {
    const config = await SiteConfig.getConfig();
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar configuración (Admin)
exports.updateConfig = async (req, res) => {
  try {
    const config = await SiteConfig.getConfig();

    // Actualizar campos permitidos
    const updates = req.body;

    // Merge profundo para objetos anidados
    if (updates.hero) Object.assign(config.hero, updates.hero);
    if (updates.contact) Object.assign(config.contact, updates.contact);
    if (updates.social) Object.assign(config.social, updates.social);
    if (updates.aboutUs) Object.assign(config.aboutUs, updates.aboutUs);
    if (updates.footerInfo)
      Object.assign(config.footerInfo, updates.footerInfo);
    if (updates.banners) Object.assign(config.banners, updates.banners);
    if (updates.siteName) config.siteName = updates.siteName;
    if (updates.logo) config.logo = updates.logo;

    await config.save();
    res.json(config);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
