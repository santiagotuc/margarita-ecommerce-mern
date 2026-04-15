const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No hay token, autorización denegada" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Buscamos al usuario en la BD para saber su rol
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

const adminOnly = (req, res, next) => {
  // Verificamos que el usuario tenga rol de admin
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado - Solo administradores" });
  }
  next();
};

module.exports = { auth, adminOnly };
