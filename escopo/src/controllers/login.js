const knex = require("../config/conection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, senha } = req.body;

  if (!username || !senha) {
    return res.status(404).json("É obrigatório username e senha");
  }
  try {
    const user = await knex("usuarios").where({ username }).first();
    if (!user) {
      return res.status(404).json("O usuario não foi encontrado");
    }
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return res.status(400).json("Email e senha não confere");
    }
    const dadosTokenUsuario = {
      id: user.id,
      username: user.username,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign(dadosTokenUsuario, SECRET_KEY, { expiresIn: "8h" });
    delete user.senha;
    // const { senha_, ...dadosUsuario } = user;

    return res.status(200).json({
      usuario: user,
      token,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = login;
