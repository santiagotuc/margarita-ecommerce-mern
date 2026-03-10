const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

connectDB();
const app = express();
const PORT = process.env.PORT || 5000;

//Midleware
app.use(cors());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.send("¡Servidor de Margarita funcionando a la perfección!");
});

//Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
