const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

// AGREGAR UN GASTO (Hormiga o Fijo)
router.post("/", async (req, res) => {
    const { user_id, description, amount, category, is_paid } = req.body;
    try {
        const newExpense = new Expense({
            user_id,
            description,
            amount,
            category,
            is_paid,
        });
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// OBTENER RESUMEN PARA EL DASHBOARD
router.get("/summary/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const expenses = await Expense.find({ user_id: user_id });

        const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const pendingToPay = expenses
            .filter((e) => !e.is_paid)
            .reduce((acc, curr) => acc + curr.amount, 0);

        res.json({
            total_gastado: totalSpent,
            pendiente_pago: pendingToPay,
            conteo_gastos: expenses.length,
            // Segmentación por categoría para los circulitos de la imagen
            por_categoria: {
                hormiga: expenses.filter((e) => e.category === "Hormiga")
                    .length,
                fijo: expenses.filter((e) => e.category === "Fijo").length,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// OBTENER RESUMEN (Ahora protegida)
router.get("/summary", auth, async (req, res) => {
    try {
        // El id del usuario viene del token gracias al middleware (req.user.id)
        const expenses = await Expense.find({ user_id: req.user.id });

        // ... (lógica de cálculo que ya teníamos)
        res.json({ total_gastado: totalSpent });
    } catch (err) {
        res.status(500).send("Error al obtener datos");
    }
});

module.exports = router;
