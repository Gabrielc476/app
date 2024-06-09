const mongoose = require("mongoose");

const encontroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  tipo: { type: String },
  faixaPreco: { type: String },
  descricao: { type: String },
});

module.exports = mongoose.model("Encontro", encontroSchema);
