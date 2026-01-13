const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite leer JSON en las peticiones

// Rutas
app.use("/api/auth", authRoutes);

// Prueba de vida del servidor
app.get("/", (req, res) => res.send("API de Gastos funcionando 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
