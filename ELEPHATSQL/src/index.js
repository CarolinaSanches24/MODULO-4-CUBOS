require("dotenv").config();
const express = require("express");
const knex = require("./conexao");
const cors = require("cors");
const server = express();

server.use(cors());
server.use(express.json());

server.get("/", async (req, res) => {
  try {
    const carros = await knex("carros");
    return res.json(carros);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro do servidor" });
  }
});

const PORT = process.env.SERVER_PORT;
server.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
