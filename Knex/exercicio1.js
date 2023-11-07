require("dotenv").config();
const express = require("express");
const knex = require("./conexao");
const server = express();

server.use(express.json());

server.get("/quantidade", async (req, res) => {
  const quantidadeMedicamentos = await knex("farmacia").count().debug();
  return res.json(quantidadeMedicamentos);
});
server.get("/menorIdade", async (req, res) => {
  const IdadeUsuarioMaisNovo = await knex("usuarios").min("idade").debug();
  return res.json(IdadeUsuarioMaisNovo);
});
server.get("/categorias", async (req, res) => {
  const categorias = await knex("farmacia")
    .select("categoria")
    .sum("estoque")
    .whereNotNull("categoria")
    .groupBy("categoria")
    .debug();
  return res.json(categorias);
});
server.get("/medicamentosSemCategoria", async (req, res) => {
  const quantidadeMedicamentosSemCategoria = await knex("farmacia")
    .whereNull("categoria")
    .count()
    .debug();
  return res.json(quantidadeMedicamentosSemCategoria);
});
server.get("/categoriaQuantidade", async (req, res) => {
  const categoriaQuantidade = await knex("farmacia")
    .select("categoria")
    .count()
    .whereNotNull("categoria")
    .groupBy("categoria")
    .debug();
  return res.json(categoriaQuantidade);
});
server.get("/quantidadeRegistrosIdade", async (req, res) => {
  const quantidadeRegistros = await knex("usuarios")
    .select("idade")
    .count("* as quantidade")
    .where("idade", ">=", 18)
    .groupBy("idade")
    .debug();
  return res.json(quantidadeRegistros);
});

const PORT = process.env.SERVER_PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
