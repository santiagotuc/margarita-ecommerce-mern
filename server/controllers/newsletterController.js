const Newsletter = require("../models/Newsletter");

// Suscribirse (público)
exports.subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;

    // Verificar si ya existe
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Este email ya está suscrito" });
    }

    const subscriber = await Newsletter.create({ email, name });
    res.status(201).json({
      message: "¡Gracias por suscribirte!",
      subscriber,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener suscriptores (Admin)
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Desactivar suscriptor (Admin)
exports.unsubscribe = async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true },
    );
    res.json(subscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
