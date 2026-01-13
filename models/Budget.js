const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    monthly_income: { type: Number, required: true }, // Tu Sueldo
    month: { type: Number, required: true }, // 1-12
    year: { type: Number, required: true },
    savings_goal: { type: Number, default: 0 }, // Opcional: Meta de ahorro
});

// Índice único para que no haya dos sueldos el mismo mes para el mismo usuario
BudgetSchema.index({ user_id: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Budget", BudgetSchema);
