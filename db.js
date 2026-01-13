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

const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(green("✅ Conectado a MongoDB con éxito"));
    } catch (err) {
        console.error(red("❌ Error de conexión a MongoDB:"), err.message);
        process.exit(1); // Detener la app si falla la conexión
    }
};

module.exports = connectDB;
