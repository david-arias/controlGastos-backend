const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

// RUTA: GET /api/auth/status
router.get("/status", async (req, res) => {
    try {
        const count = await User.countDocuments();
        const users = await User.find({});

        res.json({
            status: "Conectado a MongoDB",
            total_users: count,
            // users,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// RUTA: POST /api/auth/register
router.post("/register", async (req, res) => {
    const { username, email, password, currency } = req.body;
    try {
        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Crear instancia del modelo
        const newUser = new User({
            username,
            email,
            password_hash: hash,
            currency,
        });

        // Guardar en MongoDB
        const savedUser = await newUser.save();
        res.status(201).json({
            message: "usuario creado con exito",
            title: "¡Ya eres parte del equipo!",
            text: "Todo está listo para que alcances tus metas financieras.",
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                currency: savedUser.currency,
            },
        });
    } catch (err) {
        res.status(400).json({
            error: "El email ya existe o datos inválidos",
            title: "Esta cuenta ya existe.",
            text: "Ya hay un usuario registrado con este correo.",
        });
    }
});

// RUTA: POST /api/auth/login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Buscar si el usuario existe
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                error: "¡Ups! No te encontramos, tu nombre de usuario no existe",
                title: "¡Ups! No te encontramos.",
                text: "Tu nombre de usuario no existe",
            });
        }

        // 2. Comparar la contraseña enviada con el hash en la BD
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({
                error: "Credenciales inválidas pass",
                title: "¡Algo no cuadra...",
                text: "Esa contraseña no coincide con nuestros registros",
            });
        }

        // 3. Crear el Token JWT
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "24h" } // El token expira en un día
        );

        // 4. Enviar respuesta con el token y datos básicos
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({
            error: "Error en el servidor al iniciar sesión",
            title: "Tenemos un problema técnico.",
            text: "No pudimos conectar con tu cuenta en este momento. Por favor, inténtalo de nuevo en unos minutos.",
        });
    }
});

module.exports = router;
