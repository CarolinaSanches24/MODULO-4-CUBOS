require("dotenv").config();
const express = require("express");
const knex = require("./conexao");
const server = express();

server.use(express.json());

server.post("/cadastrar", async (req, res) => {
  const { nome, email, telefone } = req.body;

  const agenda = await knex("agenda")
    .insert({ nome, email, telefone })
    .returning("*");
  return res.json(agenda);
});
server.put("/atualizar/:id", async (req, res) => {
  const { nome, email, telefone } = req.body;
  const { id } = req.params;

  const agendaAtualizada = await knex("agenda")
    .update({ nome, email, telefone })
    .where("id", id);
  return res.json(agendaAtualizada);
});
server.delete("/excluir/:id", async (req, res) => {
  const { id } = req.params;

  const agendaExcluida = await knex("agenda")
    .del()
    .where("id", id)
    .returning("id");
  return res.json(agendaExcluida);
});

server.post("/:id/anotacoes", async (req, res) => {
  const { id } = req.params;
  const { nota } = req.body;
  const anotacao = await knex("anotacoes")
    .insert({
      agenda_id: id,
      nota,
    })
    .returning("*");
  return res.json(anotacao);
});
server.get("/anotacoes", async (req, res) => {
  const listaAnotacoes = await knex("anotacoes");
  return res.json(listaAnotacoes);
});
server.get("/anotacoes/juntar", async (req, res) => {
  const listaAnotacoes = await knex("anotacoes")
    .join("agenda", "anotacoes.agenda_id", "agenda.id")
    .select("anotacoes.*", "agenda.nome");
  return res.json(listaAnotacoes);
});
const PORT = process.env.SERVER_PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor está ouvindo na porta ${PORT}`);
});
