const mongoose = require("mongoose");

const SentimentoSchema = new mongoose.Schema({
  frase: { type: String, required: true },
});

module.exports = mongoose.model("Sentimento", SentimentoSchema);
