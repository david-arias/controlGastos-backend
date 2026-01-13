const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");

// RUTA: POST /api/auth/register
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
            [username, email, hash]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        res.status(500).json({
            error: "El email ya existe o hay un error en la BD",
        });
    }
});

module.exports = router;
