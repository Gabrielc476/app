const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Sentimento = require("./models/Sentimento");
const Encontro = require("./models/Encontro");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "*", // Substitua pelo endereço do seu frontend
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Se você estiver usando cookies
  })
);

app.use(express.json());

console.log("MongoDB URI:", process.env.MONGODB_URI);
console.log("JWT Secret:", process.env.JWT_SECRET);

// Conectar ao MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado ao MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB Atlas:", error);
  });

// Registrar usuário
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Algo deu errado, tente novamente" });
  }
});

// Autenticar usuário
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Erro ao autenticar usuário:", error);
    res.status(500).json({ message: "Algo deu errado, tente novamente" });
  }
});

// Adicionar sentimento
app.post("/sentimentos", async (req, res) => {
  try {
    const { frase } = req.body;
    const sentimento = new Sentimento({ frase });
    await sentimento.save();
    res.status(201).json({ message: "Sentimento adicionado com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar sentimento:", error);
    res.status(500).json({ message: "Algo deu errado, tente novamente" });
  }
});

app.get("/sentimentos", async (req, res) => {
  try {
    const sentimentos = await Sentimento.find();
    res.json(sentimentos);
  } catch (error) {
    console.error("Erro ao buscar sentimentos:", error);
    res.status(500).json({ message: "Algo deu errado, tente novamente" });
  }
});

app.delete("/sentimentos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Sentimento.findByIdAndDelete(id);
    res.status(200).json({ message: "Sentimento excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir sentimento" });
  }
});

app.get("/encontros", async (req, res) => {
  try {
    const encontros = await Encontro.find();
    res.json(encontros);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar encontros" });
  }
});

app.post("/encontros", async (req, res) => {
  try {
    const { titulo, tipo, faixaPreco, descricao } = req.body;
    console.log(req.body);
    const novoEncontro = new Encontro({ titulo, tipo, faixaPreco, descricao });
    await novoEncontro.save();
    res.status(201).json(novoEncontro);
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar encontro" });
  }
});

app.delete("/encontros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Encontro.findByIdAndDelete(id);
    res.status(200).json({ message: "Encontro excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir encontro" });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
