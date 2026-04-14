const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No hay token, autorización denegada" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Acceso denegado - Solo administradores" });
  }
  next();
};

module.exports = { auth, adminOnly };
