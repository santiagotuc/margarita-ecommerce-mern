// middleware/upload.js mejorado
const sharp = require("sharp");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configuración con transformación previa
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Si es HEIC, Cloudinary no lo maneja bien, mejor rechazar o convertir antes
    return {
      folder: "margarita-categories",
      format: "webp", // Cloudinary convierte a WebP (mejor compresión)
      quality: "auto:good",
      transformation: [
        { width: 800, height: 800, crop: "limit" },
        { fetch_format: "auto" }, // Auto-selección de formato según navegador
      ],
    };
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB límite Cloudinary
  fileFilter: (req, file, cb) => {
    // Aceptar solo imágenes (incluyendo HEIC aunque no funcione bien)
    if (file.mimetype.startsWith("image/") || file.mimetype === "image/heic") {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"), false);
    }
  },
});
