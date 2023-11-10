const knex = require("../config/conection");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const { username, senha } = req.body;

  if (!username || !senha) {
    return res.status(404).json("É obrigatório username e senha");
  }
  if (senha.length < 5) {
    return res.status(400).json("A senha deve conter, no mínimo, 5 caracteres");
  }
  try {
    const quantidadeUsuarios = await knex("usuarios")
      .where({ username })
      .first();

    if (quantidadeUsuarios) {
      return res.status(400).json("O username informado já existe");
    }
    const senhaCripto = await bcrypt.hash(senha, 10);

    const user = await knex("usuarios").insert({
      username,
      senha: senhaCripto,
    });
    if (!user) {
      return res.status(400).json("O usuário não foi cadastrado");
    }
    return res.status(201).json("Usuário cadastrado com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const search = async (req, res) => {
  return res.status(200).json(req.usuario);
};

const updateProfile = async (req, res) => {
  let { nome, email, senha, imagem, username, site, bio, telefone, genero } =
    req.body;

  const { id } = req.usuario;

  if (
    !nome &&
    !email &&
    !senha &&
    !imagem &&
    !username &&
    !site &&
    !bio &&
    !telefone &&
    !genero
  ) {
    return res
      .status(404)
      .json("É obrigatório informar ao menos um campo para atualização");
  }
  try {
    if (senha) {
      if (senha.length < 5) {
        return res
          .status(400)
          .json("A senha deve conter, no mínimo, 5 caracteres");
      }

      senha = await bcrypt.hash(senha, 10);
    }
    if (email !== req.usuario.email) {
      const emailUsuarioExiste = await knex("usuarios")
        .where({ email })
        .first();
      if (emailUsuarioExiste) {
        return res.status(400).json("O Email já existe");
      }
    }
    if (username !== req.usuario.username) {
      const usernameUsuarioExiste = await knex("usuarios")
        .where({ username })
        .first();
      if (usernameUsuarioExiste) {
        return res.status(400).json("O Username já existe");
      }
    }

    //atualizar o usuario

    const usuarioAtualizado = await knex("usuarios").where({ id }).update({
      nome,
      email,
      senha,
      imagem,
      username,
      site,
      bio,
      telefone,
      genero,
    });
    if (!usuarioAtualizado) {
      return res.status(400).json("O usuário não foi atualizado");
    }
    return res.status(200).json("Usuário foi atualizado com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  registerUser,
  search,
  updateProfile,
};
