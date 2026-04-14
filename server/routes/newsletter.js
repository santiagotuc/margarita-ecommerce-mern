const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletterController");
const { auth, adminOnly } = require("../middleware/auth");

// Público
router.post("/subscribe", newsletterController.subscribe);

// Admin
router.get(
  "/subscribers",
  auth,
  adminOnly,
  newsletterController.getSubscribers,
);
router.patch(
  "/:id/unsubscribe",
  auth,
  adminOnly,
  newsletterController.unsubscribe,
);

module.exports = router;
