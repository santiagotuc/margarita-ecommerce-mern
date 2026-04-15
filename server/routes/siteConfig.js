const express = require("express");
const router = express.Router();
const siteConfigController = require("../controllers/siteConfigController");
const { auth, adminOnly } = require("../middleware/auth");
const { upload } = require("../middleware/upload"); // Importamos tu configurador de Cloudinary

// Público (Cualquiera puede ver la info de la página)
router.get("/", siteConfigController.getConfig);

// Admin (Solo la administradora puede modificar)
// Usamos upload.single('heroImage') para atrapar la imagen si ella sube una
router.put(
  "/",
  auth,
  adminOnly,
  upload.single("heroImage"),
  siteConfigController.updateConfig,
);

module.exports = router;
