const express = require("express");
const router = express.Router();
const siteConfigController = require("../controllers/siteConfigController");
const { auth, adminOnly } = require("../middleware/auth");

// Público
router.get("/", siteConfigController.getConfig);

// Admin
router.put("/", auth, adminOnly, siteConfigController.updateConfig);

module.exports = router;
