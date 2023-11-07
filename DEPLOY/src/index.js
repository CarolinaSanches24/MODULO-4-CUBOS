require("dotenv").config({
  path: "./src/.env",
});
const express = require("express");

const server = express();
const porta = process.env.PORT || 3000;
server.listen(porta, () => {
  console.log(`Servidor Rodando na porta ${porta}`);
});
