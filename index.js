// DEBUG
const {
    color,
    log,
    red,
    green,
    cyan,
    cyanBright,
} = require("console-log-colors");
// END DEBUG

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
require("dotenv").config();

const app = express();

// ROUTES
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// Prueba de vida del servidor
app.get("/", (req, res) => {
    console.log(cyan.bold(`🚀 API Connect - success! ✅`));

    res.send("API de Gastos funcionando 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
