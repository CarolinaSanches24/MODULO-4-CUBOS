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

    return res.status(200).json(usuario);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do Servidor!" });
  }
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  const hashSenha = await bcrypt.hash(senha, 10);
  const { id } = req.params;
  try {
    const usuario = await knex("usuarios")
      .update({
        nome,
        email,
        senha: hashSenha,
      })
      .where({ id });

    return res.status(200).json({ mensagem: "Usuario atualizado com sucesso" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do Servidor!" });
  }
};

const excluir = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await knex("usuarios").del().where({ id });

    return res.status(200).json("Usuário excluido com sucesso");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: "Erro interno do Servidor!" });
  }
};
module.exports = {
  listarUsuarios,
  cadastrarUsuario,
  obterRegistro,
  atualizarUsuario,
  excluir,
};
