const knex = require("../config/connectionPostgres");
const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha, idade, ativo } = req.body;

  const novoUsuario = await knex("usuarios")
    .insert({ nome, email, senha, idade, ativo })
    .returning("*");
  if (!novoUsuario) {
    return res.status(400).json({ mesagem: "Usuário não foi cadastrado!" });
  }
  return res.json(novoUsuario);
};
const listarUsuarios = async (req, res) => {
  const listaUsuarios = await knex("usuarios");
  return res.status(200).json(listaUsuarios);
};

module.exports = {
  cadastrarUsuario,
  listarUsuarios,
};
