const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generar JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Registro (solo para crear el primer admin, luego lo desactivamos)
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Verificar si existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Crear usuario
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || "user",
    });

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar email y password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    // Verificar password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email o contraseña incorrectos" });
    }

    // Verificar si está activo
    if (!user.isActive) {
      return res.status(401).json({ message: "Usuario desactivado" });
    }

    // Generar token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener perfil
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
