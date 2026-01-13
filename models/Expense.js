const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
        type: String,
        enum: ["Fijo", "Hormiga", "Transporte", "Comida", "Tarjetas"],
        required: true,
    },
    is_paid: { type: Boolean, default: false }, // Para saber cuánto falta por pagar
    date: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
