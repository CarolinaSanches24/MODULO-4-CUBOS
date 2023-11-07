const knex = require("../config/connectionDB");
const bcrypt = require("bcrypt");

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await knex("usuarios");
    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do Servidor!" });
  }
};

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const hashSenha = await bcrypt.hash(senha, 10);
    const novoRegistro = await knex("usuarios")
      .insert({ nome, email, senha: hashSenha })
      .returning(["id", "nome", "email"]);
    return res.status(201).json(novoRegistro);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do Servidor!" });
  }
};

const obterRegistro = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await knex("usuarios")
      .select("id", "nome", "email")
      .where({ id })
      .first();
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do Servidor!" });
  }
};

module.exports = {
  listarUsuarios,
  cadastrarUsuario,
  obterRegistro,
};
